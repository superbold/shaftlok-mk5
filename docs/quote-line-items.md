# Quote Line Items & Per-Product Warnings

## The Problem

The "Send Quote to Sailor" email (`server/api/qms/send-quote.post.ts`) originally showed a sailor a single lump-sum price and a freeform notes paragraph — nothing that said *what* was actually being quoted. It also had a block that **always** mentioned both the Marine Control Cable and the Simple Spring Locking System (SSLS), regardless of which one (if either) the sailor actually needed.

That was confusing: the two have different, sometimes contradictory operating instructions (the SSLS requires engine-room access every time you lock the unit; the cable doesn't). A sailor who ordered a cable had no reason to read SSLS instructions, and vice versa.

## The Decision

Let the admin pick the actual product(s) being quoted from a dropdown on `/qms/:id` (e.g. "Mod III EasyLok High Torque" + "Marine Control Cable — 15 ft"), and have the email:
1. List those items.
2. Show only the warning/info block relevant to items actually selected.

**Pricing stays exactly as it was** — one admin-typed lump `quoted_price`. Line items are purely descriptive, not itemized pricing. This was a deliberate scope decision to avoid building a full per-item invoice system when a simple items-list solves the actual problem (confusing/irrelevant warning text).

Three admin-UI options were considered: free-text items, checkboxes reusing the existing `locking_system` intake field, or a structured product picker sourced from the real product catalog. The structured picker was chosen — checkboxes only covered the cable/SSLS case, not other products, and free text couldn't reliably drive which warning block(s) to include.

## Data Shape

New `quotes.line_items` column (`supabase/migrations/20260805_add_quote_line_items.sql`):

```sql
ALTER TABLE public.quotes ADD COLUMN line_items jsonb NOT NULL DEFAULT '[]'::jsonb;
```

Array of objects:
```json
[{ "product_slug": "marine-control-cable", "product_name": "Marine Control Cable", "detail": "15 ft" }]
```

- `product_slug` + `product_name` are a **snapshot** taken when the admin picks the product on `/qms/:id` — not a live join against the `products` table. If a product is later renamed or archived, an already-sent quote still reads correctly. No foreign key to `products.slug`.
- `detail` is one generic optional free-text field on every row (not split into typed quantity/length fields) — covers "15 ft" for a cable today, "x2" for a twin-screw boat quoting two units, or nothing at all, without needing conditional per-product fields in the row UI.
- `product_slug` is the key used to decide which warning block(s), if any, the email includes.
- Existing rows (and any quote that never gets items added) default to `[]` — this is not a regression, see "Backward Compatibility" below.

## Architecture

**1. Product catalog** — the admin picker at `/qms/:id` queries the same `products` table (filtered to `display = true`, ordered by `id`) that `components/MainNav.vue` already uses for the public nav, so it never drifts from the real product list.

**2. Warning registry** — `utils/quoteItemWarnings.ts`, a plain object keyed by `product_slug`:

```ts
export const QUOTE_ITEM_WARNINGS: Record<string, QuoteItemWarning> = {
  'marine-control-cable': { title: '...', paragraphs: [...] },
  'simple-spring-locking-system': { title: '...', paragraphs: [...] }
}
```

Nuxt auto-imports everything in `utils/`, so this needs no import statement anywhere it's used — client or server, which matters here since the admin-page live preview (`pages/qms/[id].vue`) needs it too, not just the send endpoint (unlike `server/utils/`, which is server-only, e.g. the pre-existing `escapeHtml.ts`). Adding a third product-specific warning later is a one-entry addition here — no branching logic elsewhere.

The two entries above are the original combined cable/SSLS block, split by product with every sentence preserved and reattributed to whichever product it actually describes.

**3. Admin UI** (`pages/qms/[id].vue`) — a new "Items Quoted" field group between the Price and Message fields. Each row: a product `<select>` + a free-text `detail` `<input>` + a remove button; an "Add Item" button appends a blank row. This is the first repeatable add/remove-row UI pattern in the codebase.

**4. Email restructure** (`server/api/qms/send-quote.post.ts`) — builds two derived HTML strings after fetching the quote:
- `itemsHtml` — an "Items Quoted" card listing each item's name + detail, or `''` if there are none.
- `warningsHtml` — deduplicates items by `product_slug`, looks each up in `QUOTE_ITEM_WARNINGS`, and renders a card per match. An item with no registry entry (e.g. a Mod unit on its own) contributes nothing.

Email order: Quoted Price → Items Quoted → Message → per-item warnings → Payment (unconditional, untouched by this feature) → closing line.

## Backward Compatibility

For any quote with `line_items = []` — every existing quote as of the migration, and any new quote before an admin adds items — `itemsHtml` and `warningsHtml` both evaluate to empty strings. The email degrades to Price → Message → Payment, with no cable/SSLS text at all. This was an explicit decision: the old always-on cable+SSLS text was already replaced earlier in the same effort, so there's no old behavior to preserve — an admin working an existing quote just adds items via the new UI before sending, the same way they already fill in price and notes.

## Files Touched

- `supabase/migrations/20260805_add_quote_line_items.sql` — new column
- `utils/quoteItemWarnings.ts` — new warning registry
- `server/api/qms/send-quote.post.ts` — itemized list + conditional warnings
- `pages/qms/[id].vue` — Items Quoted picker UI
- `types/supabase.ts` — regenerated after the migration was applied (see `docs/supabase_types.md` for how/why this file is generated, not hand-written)

## Extending This Later

To add a warning for a new product: add one entry to `QUOTE_ITEM_WARNINGS` in `utils/quoteItemWarnings.ts`, keyed by that product's `slug`. Nothing else needs to change — the email and the admin picker are both already driven by the live `products` table and this registry.
