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

## Google Analytics (GA4)

Tracking is wired up via the standard `gtag.js` snippet in `nuxt.config.ts` under `app.head.script` (Measurement ID `G-XDWZW2TCLR`). Because it lives in the global Nuxt head config, it's injected into every server-rendered page automatically — no per-page setup needed. The corresponding cookies (`_ga`, `_ga_XDWZW2TCLR`) are documented for sailors in `pages/privacy.vue`.

There's no environment gating: `nuxt dev` and production both fire the same snippet into the same GA4 property, so local browsing during development mixes into real traffic data. Worth keeping in mind when reading reports — see the bot-traffic note below for a related "don't take the raw numbers at face value" case.

### Conversion tracking: `generate_lead`

`pages/quote.vue` fires `gtag('event', 'generate_lead', { lock_type, via_yacht_list_discount })` right after a quote form submission succeeds (`submitted.value = true`), using the global `window.gtag` set up by the snippet above — no separate GA4 wiring needed. `lock_type` is the sailor's chosen locking system (`spring` / `cable` / `unsure`); `via_yacht_list_discount` flags whether they arrived via the Yacht List $50-off link.

This event has to be **manually marked as a conversion** in the GA4 UI (Admin → Events) before GA4 will count it — and it only becomes selectable there after it's fired at least once. Marking it applies retroactively to all future `generate_lead` events by exact name match; it isn't a pattern GA4 "learns," and no further examples are needed once it's toggled on.

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
