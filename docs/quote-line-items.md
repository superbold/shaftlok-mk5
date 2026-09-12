# Quote Line Items & Per-Product Warnings

## The Problem

The "Send Quote to Sailor" email (`server/api/qms/send-quote.post.ts`) originally showed a sailor a single lump-sum price and a freeform notes paragraph — nothing that said *what* was actually being quoted. It also had a block that **always** mentioned both the Marine Control Cable and the Simple Spring Locking System (SSLS), regardless of which one (if either) the sailor actually needed.

That was confusing: the two have different, sometimes contradictory operating instructions (the SSLS requires engine-room access every time you lock the unit; the cable doesn't). A sailor who ordered a cable had no reason to read SSLS instructions, and vice versa.

## The Decision

Let the admin pick the actual product(s) being quoted from a dropdown on `/qms/:id` (e.g. "Mod III EasyLok High Torque" + "Marine Control Cable — 15 ft"), and have the email:
1. List those items.
2. Show only the warning/info block relevant to items actually selected.

**Pricing (updated):** each line stores an editable `price` seeded from Product Management. `quoted_price` on the quote is the sum of those line prices (products only; shipping is separate). The sailor email itemizes each line's dollar amount.

Originally, pricing was a single admin-typed lump `quoted_price` and line items were purely descriptive. That was later superseded so the customer quote can show per-item prices while still allowing overrides on the quote.

Three admin-UI options were considered: free-text items, checkboxes reusing the existing `locking_system` intake field, or a structured product picker sourced from the real product catalog. The structured picker was chosen — checkboxes only covered the cable/SSLS case, not other products, and free text couldn't reliably drive which warning block(s) to include.

## Data Shape

New `quotes.line_items` column (`supabase/migrations/20260805_add_quote_line_items.sql`):

```sql
ALTER TABLE public.quotes ADD COLUMN line_items jsonb NOT NULL DEFAULT '[]'::jsonb;
```

Array of objects:
```json
[{ "product_slug": "marine-control-cable", "product_name": "Marine Control Cable", "detail": "15 ft", "price": 221 }]
```

- `product_slug` + `product_name` are a **snapshot** taken when the admin picks the product on `/qms/:id` — not a live join against the `products` table. If a product is later renamed or archived, an already-sent quote still reads correctly. No foreign key to `products.slug`.
- `detail` is one generic optional free-text field on every row (not split into typed quantity/length fields) — covers "15 ft" for a cable today, "x2" for a twin-screw boat quoting two units, or nothing at all, without needing conditional per-product fields in the row UI. For "x2", the admin edits the line `price` to the desired line total (no auto-multiply).
- `price` is the dollar amount for that row. Seeded from `products.price` / length tiers when the product (or cable length detail) changes; editable afterward on the quote.
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

**3. Admin UI** (`pages/qms/[id].vue`) — "Items Quoted" rows: product `<select>` + free-text `detail` + editable `price` + remove. Catalog price seeds the price field; **Reset from catalog** when overridden. Products subtotal is read-only (sum of line prices).

**4. Email** (`server/api/qms/send-quote.post.ts`) — builds derived HTML after fetching the quote:
- Quote Total card — Products (sum of line prices) / Shipping / Total
- `itemsHtml` — each item's name + detail + line price
- `warningsHtml` — deduplicates items by `product_slug`, looks each up in `QUOTE_ITEM_WARNINGS`, and renders a card per match

Email order: Quote Total → Items Quoted → Message → per-item warnings → Payment → closing line.

## Backward Compatibility

For any quote with `line_items = []` — send is blocked until the admin adds priced items (and shipping + message). Legacy lines missing `price` are seeded from the catalog on load when a list/tier price exists; otherwise the price field stays empty for manual entry.

Already-sent HTML is not rewritten — a re-send picks up the current itemized layout.

## Files Touched

- `supabase/migrations/20260805_add_quote_line_items.sql` — new column
- `utils/quoteItemWarnings.ts` — new warning registry
- `server/api/qms/send-quote.post.ts` — itemized list + conditional warnings
- `pages/qms/[id].vue` — Items Quoted picker UI
- `types/supabase.ts` — regenerated after the migration was applied (see `docs/supabase_types.md` for how/why this file is generated, not hand-written)

## Extending This Later

To add a warning for a new product: add one entry to `QUOTE_ITEM_WARNINGS` in `utils/quoteItemWarnings.ts`, keyed by that product's `slug`. Nothing else needs to change — the email and the admin picker are both already driven by the live `products` table and this registry.
