# "Server Error" on Send Quote to Sailor

## The Symptom

An admin filled in status ("Quote Finished"), price, and message on `/qms/:id`, clicked Save (succeeded), then clicked "Send Quote to Sailor." The page showed a generic **"Server Error"** in the save-message area above the Save/Send buttons — no further detail.

## Investigation

The generic text came from the client's catch-all in `sendQuote()` (`pages/qms/[id].vue`):

```js
saveMessage.value = err.data?.statusMessage || err.message || 'Failed to send quote.'
```

That pattern only shows a specific reason when the server throws a `createError({ statusCode, statusMessage })` with a real message. Here it didn't, which meant the server route was throwing an **unhandled** exception rather than a deliberate `createError` — Nuxt/Nitro masks unhandled 500s in production, so the client only ever sees a generic message.

To find the real cause, the Vercel CLI was linked to the project (`npx vercel link`) and used to pull the actual production function logs (`npx vercel logs <deployment-url>`), rather than guessing from the client-side symptom. The log showed:

```
ReferenceError: getApplicableWarnings is not defined
  at Object.handler (file:///var/task/chunks/routes/api/qms/send-quote.post.mjs:114:24)
```

## Where the literal text "Server Error" actually comes from

Neither Vercel nor this app's own code wrote that string — it's Nitro's built-in default. Confirmed by grepping the compiled server bundle (`.output/server/chunks/_/nitro.mjs`):

```js
const statusMessage = error.statusMessage || "Server Error";
...
message: isSensitive ? "Server Error" : error.message,
```

Nitro's default error handler treats any error as "sensitive" when it's unhandled or marked `fatal` (which an uncaught `ReferenceError` is) and deliberately masks the real message in production, substituting the literal string `"Server Error"` so internal stack traces/implementation details never reach the client. It's baked into the Nitro framework build itself — Vercel just runs that build, it didn't generate the message. (The app's own `error.vue` also happens to display "Server Error" for `statusCode === 500`, but that's a coincidence of wording for the full-page error view — it's not what rendered here, since this showed up inline above the Save/Send buttons, not as a full-page takeover.)

This is also *why* the client-side symptom alone couldn't reveal the real cause — Nitro will mask any unhandled exception this same way regardless of what it actually is, so the only way to see the real error was the production function logs (`npx vercel logs`), not the browser.

## Root Cause

`server/api/qms/send-quote.post.ts` calls `getApplicableWarnings(lineItems)` and references `PAYMENT_INFO`, but never imports either — they were relied on as if auto-imported, the way `escapeHtml` is in the same file.

That works for `escapeHtml` because it lives in `server/utils/escapeHtml.ts` — Nitro auto-imports everything in `server/utils/**` into server routes. But `getApplicableWarnings` (`utils/quoteItemWarnings.ts`) and `PAYMENT_INFO` (`utils/paymentInfo.ts`) live in the project's root `utils/` folder, which is **Nuxt's client-side auto-import scope**, not Nitro's server-side one. Server routes never had access to them — the reference was only ever going to throw the moment that code path actually executed, which is exactly what happened on the first real send attempt.

## The Fix

Added explicit imports to `server/api/qms/send-quote.post.ts`:

```ts
import { getApplicableWarnings } from '~/utils/quoteItemWarnings'
import { PAYMENT_INFO } from '~/utils/paymentInfo'
```

Verified with a full `nuxt build` that the compiled bundle (`.output/server/chunks/routes/api/qms/send-quote.post.mjs`) actually resolves both symbols now, rather than just re-running the dev server and hoping.

Note: **Save was never affected by this bug.** `saveQuote()` in `pages/qms/[id].vue` only does a direct Supabase `.update()` from the client — it never calls `/api/qms/send-quote`, so it doesn't touch `getApplicableWarnings`/`PAYMENT_INFO` at all. Only clicking "Send Quote to Sailor" hit the broken code path.

## Verification

Confirmed working end-to-end on 2026-08-11 with a real test quote sent to the admin's own email: after the fix deployed, "Send Quote to Sailor" returned "Quote sent to sailor.", the quote's status flipped to `sent`, and the Won/Lost decision buttons appeared on `/qms/:id` (gated on `quote.status` being `sent`/`won`/`lost`) — confirming both the email actually sent and the post-send Supabase update succeeded.

## Takeaway

Nuxt's root `utils/` auto-import and Nitro's `server/utils/` auto-import are two separate scopes. Any helper a `server/api/**` route needs from root `utils/` (or anywhere else outside `server/`) must be imported explicitly — it will not be caught at build/typecheck time, only at runtime when that code path actually executes, which can make it look like an intermittent or environment-specific problem when it isn't.
