# Backlog

## "Which Shaft Lok is right for me?" selector page

A guided page/quiz that recommends a product based on shaft bore diameter, engine room space restriction, propeller type (fixed vs. feathering/folding), and vessel class (sailboat vs. large yacht).

Feasible from existing product data, but a few decision boundaries need resolving first:
- Mod II EasyLok (up to 2.25"/57mm) vs. Mod II High Torque (2.25"+ up to 80mm) overlap at the boundary depending on propeller type.
- Mod V has no fixed bore spec ("sized to the application") — needs a rule for how the quiz handles it.
- Any other cases where two products both technically fit need a tiebreaker (e.g. space restriction level).

## Rename `NUXT_SUPABASE_SERVICE_KEY` → `NUXT_SUPABASE_SECRET_KEY`

`@nuxtjs/supabase` warns on every dev server start that `SUPABASE_SERVICE_KEY` is deprecated in favor of `NUXT_SUPABASE_SECRET_KEY` (Supabase renamed "service key" to "secret key" terminology). It's a pure rename — same value in `.env`, just needs the key renamed from `NUXT_SUPABASE_SERVICE_KEY` to `NUXT_SUPABASE_SECRET_KEY`. Low priority since the deprecated name still works today, but worth doing before Supabase removes support for it.

## Single source of truth for quote status metadata

Quote status metadata (the value list, display labels, and badge colors for `new`/`quoted`/`in_review`/`finished`/`sent`/`won`/`lost`) is currently duplicated across three files: `pages/qms/[id].vue`, `components/QuoteStatusLegend.vue`, and `pages/qms/index.vue`. Each has its own copy of the dropdown options, `statusLabels` map, and `.status-*` badge CSS.

Adding or changing a status today means updating all three consistently by hand (as happened when `finished` was added). A shared `utils/quoteStatus.ts` exporting the status list, labels, and color tokens once — imported by all three — would remove that risk. Nuxt auto-imports `utils/` on both client and server, matching the pattern already used for `utils/quoteItemWarnings.ts` and `utils/paymentInfo.ts`.
