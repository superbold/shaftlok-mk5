# Shaft Lok Handbook

Reference notes on how parts of the site work, for whoever's picking this up later (including future-us). Unlike `docs/*.md`, which capture the reasoning behind a specific change, this is meant to describe current behavior — update it in place as things change rather than leaving stale entries.

## Quote Management System (QMS)

Admin-facing quote workflow at `/qms` (list) and `/qms/:id` (detail/edit/send), backed by the `quotes` table in Supabase.

### One row per quote, always overwritten

A `quotes` row is created once, when a sailor submits the public quote form (`server/api/quote.post.ts`). Every admin action after that — Save, Send, Mark Won/Lost — is an `update` on that same row, never a new insert. There's no versioning: the row only ever holds the *latest* draft (`quoted_price`, `quote_notes`, `line_items`) plus a snapshot of the *last sent* version (`sent_html`, `sent_at`, `sent_quoted_price`, `sent_quote_notes`, `sent_line_items`). A re-send overwrites the previous snapshot — "most recent send wins" (see `docs/QMS_Store-and-View_plan.md`).

### Per-item warnings

The "Send Quote to Sailor" email can include warning/info blocks about how to operate specific accessories — but only the ones actually relevant to what's being quoted, not a blanket block for every product.

- **Source of truth**: `utils/quoteItemWarnings.ts`, a static object `QUOTE_ITEM_WARNINGS` keyed by `product_slug`. Currently two entries: `marine-control-cable` and `simple-spring-locking-system` (SSLS) — both locking-mechanism accessories, not the Shaft Lok Mods (I–VI) themselves. A Mod line item with no matching entry contributes no warning.
- **Selection logic**: `getApplicableWarnings(lineItems)` in the same file walks a quote's `line_items`, looks each `product_slug` up in the registry, de-dupes by slug, and returns whichever warning blocks matched (zero, one, or both).
- **Where it's applied**: `server/api/qms/send-quote.post.ts` calls `getApplicableWarnings` when building the outbound email HTML — this is what actually goes to the sailor.
- **Live preview**: `pages/qms/[id].vue` calls the same function to render a "Warnings That Will Be Included" preview as the admin builds the quote, so what's shown while editing always matches what the send endpoint will actually include.
- **Adding a new warning**: add one entry to `QUOTE_ITEM_WARNINGS`, keyed by the product's `slug`. No other code changes needed — both the email and the admin preview are already driven by the registry.

### "Already Sent" re-send confirmation

`pages/qms/[id].vue` shows a confirmation modal before "Send Quote to Sailor" overwrites an already-sent quote (`quote.sent_html` set). It distinguishes two cases by comparing the current draft to the `sent_quoted_price`/`sent_quote_notes`/`sent_line_items` snapshot:
- Draft unchanged from what was last sent → stronger warning ("this will resend the exact same quote").
- Draft actually differs → normal re-send confirmation.

Legacy quotes sent before the snapshot columns existed (`sent_quoted_price` null despite `sent_html` being set) fall back to the normal wording rather than misreporting "unchanged."

### Status list: app vs. database

`utils/quoteStatus.ts` (`QUOTE_STATUSES`) is the source of truth for valid quote statuses in the UI: `new`, `quoted`, `in_review`, `finished`, `sent`, `won`, `lost`. The `quotes` table has its own `quotes_status_check` CHECK constraint that must independently allow the same set — the two aren't kept in sync automatically.

They drifted once already: `finished` was added to `QUOTE_STATUSES` (it gates sending — see below) without a matching migration, so saving a quote as "Quote Finished" threw `new row for relation "quotes" violates check constraint "quotes_status_check"`. Fixed 2026-08-11 via `supabase/migrations/20260811_add_finished_to_quote_status_check.sql`, which drops and recreates the constraint with `finished` included (Postgres has no `ALTER CONSTRAINT ADD VALUE` for `CHECK` constraints — drop-and-recreate in one statement is the normal way to widen one, and it only affects future writes, not existing rows).

**If `QUOTE_STATUSES` ever gains another value, add a migration to widen `quotes_status_check` to match in the same change** — otherwise saving that status will fail with the same constraint violation.

### "Send Quote to Sailor" button gating

In `pages/qms/[id].vue`, the Send button is disabled unless *all three* are true: `editForm.status === 'finished'`, `editForm.quoted_price` is set, and `editForm.quote_notes` is set. It reads from local `editForm` state, so a status change (or price/notes edit) must be saved before the button's disabled state reflects it. The server endpoint (`server/api/qms/send-quote.post.ts:38-42`) independently re-checks price/notes and `status === 'finished'`, returning `400` if either is missing — the client-side gating is a UX convenience, not the actual enforcement.

Whichever of the three are still missing is spelled out for the admin, not just a disabled button with no explanation. `missingSendRequirements` (computed) lists which of the three are unmet; `sendRequirementsHint` turns that into one sentence — e.g. "Before sending, you still need a price and a message to the sailor." — shown both as a `<p class="send-hint">` under the buttons and as the button's `title` tooltip. It's a single combined sentence listing everything missing, not one message per missing field.

## Product Management

Admin-facing product catalog editing at `/products/manage`, linked from `/adminaccess`. Public sailors see `/products` (catalog) and `/products/[slug]` (detail pages). All copy and specs live in the Supabase `products` table — there are no static per-product Vue pages anymore.

### Who can edit

`/products/manage` uses the `admin` middleware (`middleware/admin.ts`). Saves require the admin write RLS policies from `supabase/migrations/20260829_products_admin_write_policies.sql` — without them, updates appear to succeed but return zero rows.

### Admin form fields → database columns

| Form label | Column | Where it shows publicly |
|---|---|---|
| Tagline | `tagline` | Subtitle under the product title (wins over Card Summary when set) |
| Card Summary | `summary` | `/products` catalog card; fallback subtitle if Tagline is blank |
| Search & Social Preview | `description` | Google / email / social link previews only — **not** on the product page |
| Details Intro | `details` | Opening paragraph in the Details section |
| Highlight Cards | `features` (JSON) | Icon spec cards above Details (`icon`, `title`, `text` per row) |
| Detail Bullets | `specs` (JSON) | Bullet list under the intro (`name`, `value` per row → rendered as `Label: Text`) |
| Max Bore Size (mm / display) | `max_bore_size_mm`, `max_bore_size_inch` | Used for default highlight cards when `features` is empty; also JSON-LD |
| Price (USD) | `price` | Chip under the product image; blank = "Request Price & Delivery" |
| Visibility toggle | `display` | `false` hides the product from the public catalog and detail routes |

Locking-unit construction lines (Housing, Shaft collar, Rotating disc) belong in **Detail Bullets**, not Highlight Cards. Controls & Accessories (SSLS, Marine Control Cable) typically skip bore fields and use compatibility-style bullets instead.

### Save behavior

Edits run through `layouts/products-manage-layout.vue` → `CrudModal` → `ProductForm`. **Update** stays disabled until the form is dirty (`isSaveDisabled`). On save, the full normalized payload (including `features` and `specs` JSON) is written to Supabase and `clearNuxtData('product-detail-${slug}')` busts the public page cache.

### Legacy migration on edit

Products saved before the structured form may still have intro + bullets combined in the plain `details` text column. Opening a row in the edit modal runs `hydrateProductFormContent()` (`utils/productDisplay.ts`), which splits legacy `-` bullet lines into **Detail Bullets** and pre-fills **Highlight Cards** from bore/category when `features` is empty. **Re-save once** to persist structured JSON — display still works from legacy text until then via `buildProductDetailBlocks()` fallback.

### Public rendering

- **Route**: `pages/products/[slug].vue` → `components/ProductDetail.vue`
- **Display logic**: `utils/productDisplay.ts` — `getProductTagline`, `getProductFeaturesForDisplay`, `buildProductDetailBlocks`, `formatProductPrice`
- **Structured data**: JSON-LD Product schema uses `specs` for `additionalProperty` even though bullets are the visible UI

### Hidden / redirected products

Mod IV and Mod V are obsolete (superseded by Mod VI). `/products/mod-iv` and `/products/mod-v` 301 to `/products` via `server/middleware/redirects.ts`. Mod VI is the public megayacht offering. `/products/manage` is disallowed in `public/robots.txt`.

### Schema migrations (product page fields)

Run in Supabase if not already applied:

- `supabase/migrations/20260829_add_product_page_fields.sql` — `tagline`, `details`, `features`, `specs`
- `supabase/migrations/20260829_add_product_price.sql` — `price`
- `supabase/migrations/20260829_products_admin_write_policies.sql` — admin INSERT/UPDATE/DELETE

Regenerate `types/supabase.ts` after schema changes (see `docs/supabase_types.md`).

## Google Analytics (GA4)

Tracking is wired up via the standard `gtag.js` snippet in `nuxt.config.ts` under `app.head.script` (Measurement ID `G-XDWZW2TCLR`). Because it lives in the global Nuxt head config, it's injected into every server-rendered page automatically — no per-page setup needed. The corresponding cookies (`_ga`, `_ga_XDWZW2TCLR`) are documented for sailors in `pages/privacy.vue`.

There's no environment gating: `nuxt dev` and production both fire the same snippet into the same GA4 property, so local browsing during development mixes into real traffic data. Worth keeping in mind when reading reports — see the bot-traffic note below for a related "don't take the raw numbers at face value" case.

### Conversion tracking: `generate_lead`

`pages/quote.vue` fires `gtag('event', 'generate_lead', { lock_type, via_yacht_list_discount })` right after a quote form submission succeeds (`submitted.value = true`), using the global `window.gtag` set up by the snippet above — no separate GA4 wiring needed. `lock_type` is the sailor's chosen locking system (`spring` / `cable` / `unsure`); `via_yacht_list_discount` flags whether they arrived via the Yacht List $50-off link.

This event has to be **manually marked as a conversion** in the GA4 UI (Admin → Events) before GA4 will count it — and it only becomes selectable there after it's fired at least once. Marking it applies retroactively to all future `generate_lead` events by exact name match; it isn't a pattern GA4 "learns," and no further examples are needed once it's toggled on.

**Checking that it fired, via Reports → Realtime:** look at the **"Event count by Event name"** card specifically — not the "Views by Page title and screen name" card, which only shows that `/quote` was visited, not that the submission event itself fired.

**The "aged out" gotcha:** Realtime only shows roughly the last 30 minutes of activity. Submitting one test quote and then coming back to check Realtime later — after getting pulled into unrelated debugging, a meeting, etc. — will show "No data available" even though the event fired and tracked correctly at the time. That's not a tracking failure, just Realtime's window closing. To verify tracking, submit a fresh test quote and check Realtime within a couple minutes of doing so, rather than relying on an earlier submission.

### Known data quality issue: bot traffic inflating country/user counts

As of August 2026, a large share of "users" reported by GA4 is not real visitors. The signature to watch for: high user/event count paired with near-zero engaged sessions and 0s engagement time. That's automated/bot traffic, not sailors browsing the site, and it currently is not filtered out anywhere (no GA4 Data Filter is configured). When reading reports, weight countries/segments with real engagement (non-zero engagement time, reasonable engagement rate) over raw user counts.

Example from the Demographics report (User → Demographics, by Country) that first surfaced this:

| Metric | 🇸🇬 Singapore (bot) | 🇺🇸 United States (real) |
|---|---|---|
| Users | 150 (52.6%) | 60 (21.1%) |
| Engaged sessions | 3 (3.3%) | 46 (51.1%) |
| Engagement rate | 1.97% | 46.94% |
| Avg. engagement time | 0s | 2m 28s |
| Event count | 457 (25.3%) | 739 (41.0%) |

Singapore had more than double the raw users but almost none of the engagement — a script hitting pages, not a person. The US segment looks like genuine traffic: real engagement time, a healthy engagement rate, and it accounts for the plurality of real events despite fewer raw users.

### Accessing the data

GA4 is at [analytics.google.com](https://analytics.google.com) — select the Shaft Lok property, then use **Reports → Life cycle** (Acquisition, Engagement) for traffic/behavior trends and **Reports → User** (Demographics, Tech) to break down by country, city, browser, or device. **Reports → Realtime** is the fastest way to confirm tracking is firing at all.
