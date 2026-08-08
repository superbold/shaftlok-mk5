# Store & View "What Was Actually Sent" on /qms/:id

## Context

The `/qms/:id` admin page only stored the *inputs* that go into a quote email (price, notes, line items) — the actual warning text and payment details shown to the sailor were re-derived live from whatever the current code said, every time the email was built. Nothing captured what was **actually emailed** at a given moment. If the payment details or a warning's wording changes later (as it already has once this session — see [`quote-line-items.md`](./quote-line-items.md)), an old "sent" quote had no record of what it originally said, and there was no way to compare two quotes to see how they differed.

Fix, in two parts:
1. **Store the exact rendered email HTML** at send time, so there's a perfect-fidelity historical record.
2. **Restructure `/qms/:id`** so the sailor's original inquiry, the editable quote, and (once sent) the exact sent email are all viewable stacked on the same page, with a sticky jump-nav to navigate between them instead of squeezing more content into the previous two-column side-by-side layout.

## Prior State

- `server/api/qms/send-quote.post.ts` built the final email HTML into a `const html` template literal, sent it via Resend, then updated the quote row with only `status`, `sent_at`, `updated_at` — the `html` itself was discarded after the Resend call.
- `pages/qms/[id].vue`'s `.detail-grid` was a two-column CSS grid: `.summary-column` (left) held the sailor's original inquiry (Contact/Vessel/Propeller/Engine/Locking System cards + Sailor's Notes); `.action-column` (right, sticky) held the editable Status/Items/Price/Message form and Save/Send/Decision buttons.
- The isolated-iframe rendering technique (`srcdoc` + auto-resize on `load`) was already proven working via the simulated-email-preview artifact built earlier this session — reused here as a real Vue component instead of a standalone HTML file.

## Implementation

### 1. Migration — `supabase/migrations/20260807_add_quote_sent_html.sql`

```sql
-- Stores the exact HTML that was emailed to the sailor at send time, so a
-- historical quote reflects what was actually sent even if the payment
-- details, warning text, or template styling change later. Null until the
-- quote has been sent at least once; overwritten on every re-send (most
-- recent send wins, matching how sent_at already behaves).
ALTER TABLE public.quotes ADD COLUMN sent_html text;
```

Pasted into the Supabase dashboard SQL editor, same as prior migrations (no CLI project link in this repo).

### 2. `server/api/qms/send-quote.post.ts` — persist `html`

Added `sent_html: html` to the existing status-update call. No other change — the `html` variable already existed and is exactly what was emailed.

### 3. New component — `components/EmailFrame.vue`

A small reusable wrapper around the iframe technique already validated in this session's artifact preview: takes an `html` prop, assigns it to an iframe's `srcdoc`, and auto-resizes the iframe height once loaded.

This is intentionally reusable — it's also what the already-backlogged "Review Quote" button (see `BACKLOG.md`) will need later to preview an email before sending.

### 4. `pages/qms/[id].vue` — restructured into stacked sections with jump-nav

Replaced the `.detail-grid` two-column layout with three stacked full-width `<section>` blocks, each with an anchor `id`, plus a sticky jump-nav between the header and the first section:

- **Inquiry** — the sailor's original submission (unchanged content, just repositioned).
- **Quote** — the editable Status/Items/Price/Message form (unchanged content, just repositioned).
- **Sent to Sailor** — new, only rendered once `quote.sent_html` exists, showing the stored HTML via `EmailFrame`.

No changes to any existing logic (`editForm`, `loadQuote`, `saveQuote`, `sendQuote`, `markDecision`, `sections`, `pickableProducts`) — this was purely a template/CSS restructure plus the one new read-only section. The jump-nav is sticky under the site header; each section has `scroll-margin-top` so anchor-scrolling doesn't land content underneath the fixed headers.

### Explicitly Out of Scope

- No backfill of `sent_html` for quotes already sent before this migration — those simply don't show a "Sent to Sailor" section. Consistent with how this session already treated the line-items backward-compatibility question.
- No multi-send history (e.g. a table of every past send) — `sent_html` reflects only the most recent send, same as `sent_at` already does. A possible future extension, not built now.
- `send-quote.post.ts`'s auth, Resend call, and admin-email logic — untouched.

## Verification

1. Apply the migration in the Supabase SQL editor.
2. `npx supabase gen types typescript --project-id biwrvsshuqfgeyfogqos --schema public > types/supabase.ts`.
3. `npx nuxi typecheck`.
4. Open an existing sent quote (or send a new test quote) on `/qms/:id` — confirm the "Sent to Sailor" nav link and section appear, and the iframe renders the exact email at the right height.
5. Confirm anchor-clicking each jump-nav link scrolls to the right section without landing underneath the fixed headers.
6. Open a never-sent quote — confirm no "Sent to Sailor" link/section appears.
7. Re-send a quote after editing price/items — confirm `sent_html` updates to reflect the new content.
