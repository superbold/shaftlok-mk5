# Shaft Lok Handbook

Reference notes on how parts of the site work, for whoever's picking this up later (including future-us). Unlike `docs/*.md`, which capture the reasoning behind a specific change, this is meant to describe current behavior — update it in place as things change rather than leaving stale entries.

## Quote Management System (QMS)

Admin-facing quote workflow at `/qms` (list) and `/qms/:id` (detail/edit/send), backed by the `quotes` table in Supabase.

### One row per quote, always overwritten

A `quotes` row is created once, when a sailor submits the public quote form (`server/api/quote.post.ts`). Every admin action after that — Save, Send, Mark Won/Dead — is an `update` on that same row, never a new insert. There's no versioning: the row only ever holds the *latest* draft (`quoted_price`, `shipping_price`, `shipping_notes`, `quote_notes`, `line_items`) plus a snapshot of the *last sent* version (`sent_html`, `sent_at`, `sent_quoted_price`, `sent_shipping_price`, `sent_shipping_notes`, `sent_quote_notes`, `sent_line_items`). A re-send overwrites the previous snapshot — "most recent send wins" (see `docs/QMS_Store-and-View_plan.md`).

The public form silently drops suspected bots (filled honeypot, or a name that looks like random characters) and still shows "Request Sent" so bots don't learn to adjust. The honeypot must not be named `company` — browsers autofill that and would drop real sailors (and Sean testing the form). Drops log `Quote request dropped as likely bot` in Vercel.

`quoted_price` is **products only** — always the sum of `line_items[].price`. Grand total is always `quoted_price + shipping_price`. Pipeline dollars on `/qms` and the list Total column use that grand total.

Each `line_items` entry is `{ product_slug, product_name, detail, price }`. Price is seeded from Product Management (`products.price` / length tiers) when the admin picks a product, then editable on the quote. `price_manual` is UI-only and not persisted.

### Per-item warnings

The "Send Quote to Sailor" email can include warning/info blocks about how to operate specific accessories — but only the ones actually relevant to what's being quoted, not a blanket block for every product.

- **Source of truth**: `utils/quoteItemWarnings.ts`, a static object `QUOTE_ITEM_WARNINGS` keyed by `product_slug`. Currently two entries: `marine-control-cable` and `simple-spring-locking-system` (SSLS) — both locking-mechanism accessories, not the Shaft Lok Mods (I–VI) themselves. A Mod line item with no matching entry contributes no warning.
- **Selection logic**: `getApplicableWarnings(lineItems)` in the same file walks a quote's `line_items`, looks each `product_slug` up in the registry, de-dupes by slug, and returns whichever warning blocks matched (zero, one, or both).
- **Where it's applied**: `server/api/qms/send-quote.post.ts` calls `getApplicableWarnings` when building the outbound email HTML — this is what actually goes to the sailor.
- **Live preview**: `pages/qms/[id].vue` calls the same function to render a "Warnings That Will Be Included" preview as the admin builds the quote, so what's shown while editing always matches what the send endpoint will actually include.
- **Adding a new warning**: add one entry to `QUOTE_ITEM_WARNINGS`, keyed by the product's `slug`. No other code changes needed — both the email and the admin preview are already driven by the registry.

### "Already Sent" re-send confirmation

`pages/qms/[id].vue` shows a confirmation modal before "Send Quote to Sailor" overwrites an already-sent quote (`quote.sent_html` set). It distinguishes two cases by comparing the current draft to the `sent_quoted_price`/`sent_shipping_price`/`sent_shipping_notes`/`sent_quote_notes`/`sent_line_items` snapshot:
- Draft unchanged from what was last sent → stronger warning ("this will resend the exact same quote").
- Draft actually differs → normal re-send confirmation.

Legacy quotes sent before the snapshot columns existed (`sent_quoted_price` null despite `sent_html` being set) fall back to the normal wording rather than misreporting "unchanged."

### Unread inquiry marker

The cyan left bar on `/qms` list rows marks inquiries the owner has not opened yet (`quotes.read_at` is null). New sailor submissions from `/quote` start unread. Opening `/qms/:id` stamps `read_at` and the bar goes away. Quotes Sean creates himself in QMS are marked read on insert. Migration: `20260913_add_quote_read_at.sql`.

### Status list: app vs. database

`utils/quoteStatus.ts` (`QUOTE_STATUSES`) is the source of truth for valid quote statuses: `new`, `sent`, `followed_up`, `won`, `dead`. The `quotes` table has a matching `quotes_status_check` CHECK constraint — the two aren't kept in sync automatically.

| Value | Label | When |
|---|---|---|
| `new` | New | Intake / drafting (pre-send) |
| `sent` | Quote Sent | Set automatically when "Send Quote to Sailor" succeeds; may also be set manually |
| `followed_up` | Followed up | After a chase call/email — **disabled in the UI until the quote has been sent** (`sent_html` or a post-send status) |
| `won` | Won | Sailor accepted |
| `dead` | Dead | Declined, went elsewhere, or went cold |

Legacy statuses (`quoted`, `in_review`, `finished`, `lost`) were remapped by `supabase/migrations/20260912_simplify_quote_statuses.sql` (`quoted`/`in_review`/`finished` → `new`, `lost` → `dead`).

**If `QUOTE_STATUSES` ever gains another value, add a migration to widen `quotes_status_check` in the same change.**

### "Send Quote to Sailor" button gating

In `pages/qms/[id].vue`, the Send button is disabled unless **every quoted item has a price**, **shipping** (details + price), and **message** are set. Shipping price may be `0` when shipping is included — details still required. Status no longer gates send — drafting stays on **New** until send succeeds (server sets status to `sent`). The server endpoint (`server/api/qms/send-quote.post.ts`) re-checks the same fields, recomputes `quoted_price` from line prices, and returns `400` if any are missing.

`missingSendRequirements` lists unmet requirements; `sendRequirementsHint` turns that into one sentence — e.g. "Before sending, you still need a price on each quoted item, shipping details, a shipping price, and a message to the sailor." — shown under the buttons and as the button's `title` tooltip.

**Proactive field guidance** (`pages/qms/[id].vue`): Missing item prices, Shipping, and Message fields show a gold highlight and inline hint while empty. A helper under the status dropdown says "Ready to send" when status is New and all required fields are complete. **Followed up** is disabled with suffix `(send quote first)` until the quote has been emailed.

**First-send confirmation**: Before the first email ever goes out (`sent_html` empty), clicking Send opens a confirm modal ("Send this quote to …?") — separate from the Already Sent re-send modal.

**Catalog prices on quotes**: The Items Quoted picker loads `products.price` and `products.price_tiers`. Selecting a product seeds that row's **Price ($)** from the catalog (length tiers use line detail or the sailor's `cable_length`). The admin can edit the line price afterward; **Reset from catalog** appears when overridden. **Products** is a read-only sum of line prices. Shipping is a separate required line (details + price); Total is products + shipping. Products without a list price (e.g. Mod VI) leave the price blank for manual entry.

**Quote email**: Quote Total (Products / Shipping / Total), a **Valid until** line (exactly one calendar month from send), then Items Quoted with each line's name, detail, and price, then message, warnings, payment, and terms. Payment is Stripe only (Associated Bank wire copy is OBE). **Hide Payment** on the QMS quote (default **On**) omits the Payment card and pay buttons from the Email to Sailor until Sean turns it off. When payment is included, the email states the quoted total for bank transfer and the card total (quoted total + 3% processing fee), then **Pay by Bank Transfer** and **Pay by Credit Card** buttons to `/pay/:token`. Validity is display-only — status stays manual (Followed up / Dead) unless Stripe marks the quote paid. Re-send refreshes `sent_at` and the validity window. QMS “Sent to Sailor” shows the same valid-until date.

### Stripe payments

Sailors pay on Shaft Lok first, then Stripe. Associated Bank account numbers are not included in quotes.

1. **Send Quote** includes Stripe pay buttons only when **Hide Payment** is off. Then it creates (or reuses) `quotes.payment_token` and puts `/pay/:token` in the email. That send requires `STRIPE_SECRET_KEY` (and Resend). Hidden-payment sends still go out with Resend and omit the Payment section.
2. The public pay page shows quoted total vs card total (3% added **here**, not by Stripe) and two buttons: **Pay by Bank Transfer** / **Pay by Credit Card**.
3. Each button creates a Stripe Checkout Session with that amount already in it — card sessions accept cards only; bank sessions accept ACH / US bank transfer. Checkout Sessions expire in 24 hours; the quote pay page stays valid for the quote window (~1 month).
4. Webhook `POST /api/stripe/webhook` sets `payment_status` (`unpaid` / `pending` / `paid` / `failed` / `expired`). **Paid** also sets status to **Won**. Bank transfers can sit on **Pending** until funds clear.
5. After Stripe, sailors land on `/pay/:token/confirmed` (**Order Confirmed**: quote number + “Thank you for your order. Happy sailing!”). That page asks Stripe for the Checkout Session (it does not wait on the webhook) and will not send them back to pay. Cancel returns to the pay page. Paid quotes that reopen `/pay/:token` are sent to the confirmed page.
6. Env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, optional `NUXT_PUBLIC_SITE_URL` (defaults to `https://shaftlok.com`). Dashboard: enable Cards, Bank transfers, and ACH; add the live webhook URL; turn on Radar.

Migration: `supabase/migrations/20260921_add_quote_stripe_payment.sql`. Hide Payment: `supabase/migrations/20260922_add_quote_hide_payment.sql`.

### Custom Bore

`Custom Bore` is a displayed **Controls & Accessories** product (`slug: custom-bore`) for the catalog card, detail page, and QMS Items Quoted picker. Price is blank (quoted per job).

On `/quote`, an always-on optional checkbox **“I may need a custom bore”** sits under Shaft Diameter with reassuring copy (can remove later if not a fit). Checking it sets `quotes.custom_bore_requested` and pre-seeds a Custom Bore line item (detail = shaft diameter when provided). Sean confirms or removes it on QMS after the call. Migration: `20260912_add_custom_bore.sql`.

## Admin chrome

Admin pages (QMS, Library, Product Management, and Yacht List while Sean is signed in) use a **red** house breadcrumb and hamburger so they are visually distinct from the public site. The house goes to `/adminaccess` (the area picker) — not the public homepage. The Shaft Lok logo in those headers goes to `/` (the public landing page).

`/adminaccess` shows the sign-in form to visitors. If Sean is already signed in, it skips the form and opens the same “which area?” picker. Overlay click does not dismiss it; **Public site** goes to `/`.

Public pages keep the cyan breadcrumb with house → `/`.

## Shaft Lok Library

Admin shared document store at `/library` (also linked from `/adminaccess` after sign-in, and from QMS / Product Management nav). Admins upload PDFs and common files once; metadata lives in `library_documents`, files in private Storage bucket `shaft-lok-library` (20 MB/file; PDF, Word, text, JPEG, PNG, WebP). Download uses short-lived signed URLs. Upload, download, and delete are all available on the Library page. Admin-only via RLS. Migration: `20260913_shaft_lok_library.sql`.

### Attach library docs to quote emails

On a QMS quote detail page, under **Email Attachments**, Sean checks library files for that send. IDs are stored on `quotes.attachment_ids`. On send, the API downloads each file from Storage and passes them to Resend as email attachments; the email HTML lists the titles. `sent_attachment_ids` snapshots what went out (used for “unchanged since last send” checks). Missing/deleted library rows fail the send with a clear error. Migration: `20260913_quote_library_attachments.sql`.

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
| Length-based price tiers | `price_tiers` (JSON) | Optional foot-range tiers (`minFeet`, `maxFeet`, `price`). When set, overrides single Price on the public page and in QMS — e.g. Marine Control Cable 1–30′. Editable in Product Management under **Length-based price tiers**. |
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
- `supabase/migrations/20260831_add_product_price_tiers.sql` — `price_tiers` JSON + Marine Control Cable seed tiers
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
