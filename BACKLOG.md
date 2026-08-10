# Backlog

## "Which Shaft Lok is right for me?" selector page

A guided page/quiz that recommends a product based on shaft bore diameter, engine room space restriction, propeller type (fixed vs. feathering/folding), and vessel class (sailboat vs. large yacht).

Feasible from existing product data, but a few decision boundaries need resolving first:
- Mod II EasyLok (up to 2.25"/57mm) vs. Mod II High Torque (2.25"+ up to 80mm) overlap at the boundary depending on propeller type.
- Mod V has no fixed bore spec ("sized to the application") — needs a rule for how the quiz handles it.
- Any other cases where two products both technically fit need a tiebreaker (e.g. space restriction level).

## "Already Sent" confirmation before re-sending a quote

Done: `pages/qms/[id].vue` now shows a confirmation modal when `quote.sent_html` is already set, before "Send Quote to Sailor" overwrites it. It also distinguishes an actual content change from an identical re-send by comparing the current draft against `sent_quoted_price`/`sent_quote_notes`/`sent_line_items` (snapshot columns written at send time, see `supabase/migrations/20260809_add_quote_sent_snapshot.sql`) — the modal copy differs depending on whether anything actually changed.

Still open, smaller polish noted in the same conversation:
- The Send button gives no explanation when it's disabled by the "Quote Finished" status gate — an inline hint (e.g. "Set status to Quote Finished to enable sending") would help.
- A plain confirm-before-send for the general misclick case (i.e. even on a first-ever send), independent of the re-send scenario above.
- Minor: a reason-text field on the re-send modal, so the admin notes *why* they're resending (sailor says they never got it, price changed, etc.) as a paper trail. Not needed for the spam concern itself — change-detection above already covers that — so **ask ADMIN** whether this is wanted before building it.
