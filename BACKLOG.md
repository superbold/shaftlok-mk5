# Backlog

## "Which Shaft Lok is right for me?" selector page

A guided page/quiz that recommends a product based on shaft bore diameter, engine room space restriction, propeller type (fixed vs. feathering/folding), and vessel class (sailboat vs. large yacht).

Feasible from existing product data, but a few decision boundaries need resolving first:
- Mod II EasyLok (up to 2.25"/57mm) vs. Mod II High Torque (2.25"+ up to 80mm) overlap at the boundary depending on propeller type.
- Mod V has no fixed bore spec ("sized to the application") — needs a rule for how the quiz handles it.
- Any other cases where two products both technically fit need a tiebreaker (e.g. space restriction level).

## "Already Sent" confirmation before re-sending a quote

On `pages/qms/[id].vue`, nothing currently warns an admin before they re-send a quote that's already gone out. Once `quote.sent_html` exists, clicking "Send Quote to Sailor" again silently overwrites it (and `sent_at`) with the new content — by design (documented in `docs/QMS_Store-and-View_plan.md` — "most recent send wins"), but there's no explicit heads-up in the moment it happens.

A confirmation modal — "This quote was already sent to {{ sailor }} on {{ sent_at }}. Send the updated version instead?" — shown only when `quote.sent_html` is already set, would catch an admin re-sending by accident while just meaning to edit/save. The "Sent to Sailor" section further down the page shows the last-sent version, which helps, but isn't in the direct path of clicking Send.

Related, smaller polish noted in the same conversation: the Send button gives no explanation when it's disabled by the "Quote Finished" status gate — an inline hint (e.g. "Set status to Quote Finished to enable sending") would help, as would a plain confirm-before-send for the general misclick case, independent of the re-send scenario above.
