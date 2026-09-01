# Backlog

Prioritized open work for Shaft Lok MK5. Completed items live at the bottom under **Done**. For how shipped features work today, see `docs/_Shaft-Lok-Website-Handbook.md`.

---

## Next up (P1 — owner workflow)

### Shipping cost on quotes

Owner handles shipping manually in the **Message to Sailor** field for now (e.g. "shipping included" / "shipping TBD"). No app field yet — revisit if itemized shipping on the quote email becomes necessary.

### Product/MOD price history

Owner wants to track MOD and locking-system price changes over time (materials, machining, etc.) without losing history.

**Resolved:** current price lives in `products.price`, editable at `/products/manage`. Quotes snapshot price at send via `sent_quoted_price`.

**Still to decide / build:**

- Price-*history* table (product, price, effective date, reason/note, changed-by) vs. overwriting a single field only.
- Admin UI — dedicated "Pricing" section vs. logging changes from the existing product edit form.

---

## Next up (P2 — revenue & discovery)

### Show price on `/products` catalog cards

Detail pages show price (or "Request Price & Delivery"); the catalog index does not. Add once owner has list prices filled in.

### Owner: fill list prices for displayed products

Content/ops task in `/products/manage` — not a code item. Blocks meaningful catalog pricing and comparison work.

### "Which Shaft Lok is right for me?" selector page

Guided page/quiz recommending a product from shaft bore, engine room space, propeller type (fixed vs. feathering/folding), and vessel class.

**Decision boundaries to resolve with owner first:**

- Mod II EasyLok (up to 2.25"/57mm) vs. Mod II High Torque at the boundary — depends on propeller type / load, not bore alone.
- Mod IV/V are OBE; megayacht path is **Mod VI** (custom bore) — quiz needs a rule for "contact us / custom" rather than a fixed Mod V spec.
- Tiebreakers when two products technically fit (e.g. space restriction level).

### GA4 & ads (mostly ops)

- Mark `generate_lead` as a **conversion** in the GA4 UI (event already fires from `pages/quote.vue` on successful submit).
- Configure a **bot filter** or segment — raw user/country counts are inflated by automated traffic (see handbook GA4 section).
- Evaluate Google Search ads on high-intent terms ("propeller shaft lock", "shaft lok") — business decision, not dev.

---

## Later (P3)

### QMS re-send reason field

Optional note on the re-send modal ("sailor never got it", "price changed", etc.) for a paper trail. **Ask ADMIN** before building.

### Product comparison tools

Side-by-side spec comparison across Mods — useful after catalog data and pricing are stable.

### Richer yacht list filtering

Beyond current list/search — filters by length, transmission, etc.

### Performance

PWA features and further image optimization.

---

## Done

### "Already Sent" re-send confirmation ✓

`pages/qms/[id].vue` confirmation modal before overwriting `quote.sent_html`; distinguishes unchanged vs. changed re-sends using `sent_quoted_price` / `sent_quote_notes` / `sent_line_items` snapshot columns (`supabase/migrations/20260809_add_quote_sent_snapshot.sql`).

### Send button missing-requirements hint ✓

Send button spells out which of the three requirements are still missing (status "Quote Finished", price, message) via `missingSendRequirements` / `sendRequirementsHint` — inline text and tooltip.

### GA4 quote submission event ✓

`generate_lead` fires on successful quote form submission in `pages/quote.vue`.

### Supabase Types ✓

`types/supabase.ts` from live schema; `nuxt.config.ts` → `types: '~~/types/supabase.ts'`. Regenerate after migrations — `docs/supabase_types.md`.

### Supabase-backed product pages & admin editing ✓

Dynamic `/products/[slug]` from the `products` table; admin CRUD at `/products/manage` with structured fields (`details` intro, `features` highlight cards, `specs` detail bullets, tagline, price, visibility). Handbook: Product Management section.

### QMS proactive send validation ✓

Price and Message fields highlight with inline hints while empty; **Quote Finished** status disabled until both are filled. Handbook: "Send Quote to Sailor" button gating.

### QMS first-send confirmation ✓

Confirm modal before the first email to a sailor (`sent_html` empty), separate from the Already Sent re-send modal.
