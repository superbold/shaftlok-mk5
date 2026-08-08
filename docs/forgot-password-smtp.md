# Forgot Password: Why the Reset Email Never Arrived

This covers a *different* problem than [`forgot-password-pkce-fix.md`](./forgot-password-pkce-fix.md), which is about what happens *after* a reset email is clicked. This doc is about why the email never showed up in the inbox at all, even though the UI reported success.

## The Symptom

An admin used "Forgot password?" on `/adminaccess`. The UI showed "Password reset email sent. Check your inbox and follow the link." No error. The email never arrived — not in the inbox, not in spam, and searching for "Supabase" as a keyword found nothing.

## Finding #1: Resend isn't involved in this flow at all

It's easy to assume Resend (already used for quote emails) handles this too. It doesn't. `handleForgotPassword()` in `pages/adminaccess.vue` calls:

```js
const redirectTo = `${window.location.origin}/reset-password`
const { error: resetError } = await supabase.auth.resetPasswordForEmail(form.value.email, { redirectTo })
```

`supabase.auth.resetPasswordForEmail()` is a **Supabase Auth** feature — it sends through whatever mailer is configured in the Supabase project's Auth settings, completely separate from the app's own Resend integration (`server/api/quote.post.ts`, `server/api/qms/send-quote.post.ts`). Until Custom SMTP is configured (see below), Supabase Auth emails go through **Supabase's own built-in sender**, not Resend.

## Finding #2: "Success" doesn't mean "delivered"

`resetPasswordForEmail()` is designed, by Supabase, to **never report an error for "email not found"** — a deliberate anti-enumeration measure, so an attacker can't use the reset flow to discover which emails have accounts. That means the UI's success message only confirms the *request* was accepted, never that an email was actually sent or delivered.

Compounding this: Supabase's default built-in email sender (used automatically whenever Custom SMTP isn't configured) is explicitly meant for early development/testing, not production use. It's rate-limited and known to silently fail to deliver, with nothing surfaced to the app or the end user when it does.

## Finding #3: The Auth Logs are also misleading here

Checking Supabase Dashboard → **Logs → Auth** showed `/recover | request completed`. This looks reassuring but only confirms the Auth **API** accepted and processed the request — it says nothing about whether the mail transport layer actually delivered anything afterward. There's no delivery/bounce status visible in that log.

## The Fix: Custom SMTP via Resend

Since Resend is already set up and verified for this project, the fix is pointing Supabase Auth's mailer at it instead of Supabase's default sender.

**Location** (this moved out of Project Settings in recent Supabase dashboard versions): left sidebar → **Authentication** → **Emails** → **SMTP Settings** → toggle **Enable Custom SMTP**.

Configuration used:

| Field | Value |
|---|---|
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` (literal string, not an email address) |
| Password | the project's `RESEND_API_KEY` value (from `.env`) |
| Sender email | `noreply@contact.shaftlok.com` |
| Sender name | `Shaft Lok Inc.` |

### The domain-verification gotcha

The obvious first choice for sender email was `noreply@shaftlok.com` (the root domain). That would have failed silently — Resend only sends from domains it has verified (SPF/DKIM records added), and checking the Resend dashboard → **Domains** showed only **`contact.shaftlok.com`** verified, not the root `shaftlok.com`. This matches what the quote emails already use (`quote@contact.shaftlok.com`). The sender address had to be changed to `noreply@contact.shaftlok.com` to land on the verified domain.

**If a new sender domain is ever needed**, it must be added and verified in Resend's dashboard first (DNS records), or sends from that domain will fail regardless of what's configured in Supabase.

## A Security Detour Worth Remembering

While opening the SMTP Password field, it turned out to already contain a saved value — from an earlier, incomplete setup attempt. Before treating this as routine, it was worth pausing to check *what* that value actually was, since "a password already sitting in an unrelated field" is exactly the shape of a real credential leak (e.g., if the project's database password had ended up there by mistake).

In this case, it was confirmed to be a self-created placeholder from a prior attempt — not the database password, not the Supabase account password. No rotation of other credentials was needed. But the general instinct was correct: **don't assume a discovered credential is harmless just because it's inconvenient to check** — a real leaked system password sitting in an unrelated dashboard field would have warranted rotating it immediately.

## Status

Custom SMTP is configured and saved in Supabase as of this session. **Final verification (an actual reset email arriving) was still pending** when the session ended — next step is to retry "Forgot password?" from `/adminaccess` and confirm delivery. If it still doesn't arrive, check Supabase Dashboard → Logs → Auth again for a more specific SMTP-layer error (a misconfigured Custom SMTP will usually show a clearer failure than the default sender's silent drop).

## Known Regression: `useSsrCookies` Conflicts With the PKCE Fix

Discovered while re-reading `forgot-password-pkce-fix.md` for context — **this is a real, currently-live issue, introduced later than that doc, in the same session as the quote line-items work** (see `docs/quote-line-items.md`).

That earlier doc's fix for the PKCE "Link Invalid or Expired" bug was `useSsrCookies: false` in `nuxt.config.ts`. Later in a subsequent session, `useSsrCookies` was changed to `true` to fix an unrelated bug: the "Send Quote to Sailor" button on `/qms/:id` was failing with `401 Not signed in`, because the QMS server route (`server/api/qms/send-quote.post.ts`) uses `serverSupabaseUser(event)`, which — confirmed by reading `@nuxtjs/supabase`'s source directly — **always reads the session from a request cookie, unconditionally**, regardless of any other setting. With `useSsrCookies: false`, the browser's Supabase client never wrote that cookie in the first place (session lived only in localStorage), so the server route always saw no session.

The mechanism, confirmed in `node_modules/@nuxtjs/supabase/dist/runtime/plugins/supabase.client.js`:

```js
if (useSsrCookies) {
  client = createBrowserClient(url, key, { ...clientOptions, ... })  // @supabase/ssr
} else {
  client = createClient(url, key, { ...clientOptions, ... })          // @supabase/supabase-js
}
```

`createBrowserClient` (from `@supabase/ssr`) is exactly the client that `forgot-password-pkce-fix.md` found hardcodes `flowType: 'pkce'`, unconditionally overriding `clientOptions.auth.flowType: 'implicit'`. So:

| `useSsrCookies` | QMS "Send Quote to Sailor" | Password reset |
|---|---|---|
| `false` | ❌ 401, no session cookie reaches the server | ✅ implicit flow works as fixed |
| `true` (current) | ✅ works | ⚠️ PKCE re-enabled, silently overriding `flowType: 'implicit'` |

**Why this might not show up in casual testing:** `reset-password.vue` already has a PKCE `?code=` exchange fallback (`exchangeCodeForSession`, lines ~159-168) alongside the implicit-flow hash handler. That exchange succeeds if the link is opened in the *same browser/profile* that requested the reset (the stored PKCE code verifier is still there) — which is exactly how an admin testing on their own machine would normally click the link. It fails the same way the original bug did whenever the link is opened somewhere else: a different browser, a phone's mail app, a corporate link-scanner that "pre-visits" the link before a human clicks it (which also consumes the one-time code).

### Options to resolve (not yet decided — needs a call, not a unilateral fix)

1. **Give the QMS route its own auth path, revert `useSsrCookies` to `false`.** Have the client send its access token explicitly (`Authorization: Bearer <token>`, obtained via `supabase.auth.getSession()`) on the `$fetch('/api/qms/send-quote', ...)` call, and have the server route validate that token manually (a plain `createClient(url, anonKey).auth.getUser(token)`) instead of using `serverSupabaseUser()`. Fully restores the implicit-flow fix; requires a small, contained code change to two files.
2. **Make password reset independent of both PKCE and implicit flow**, using Supabase's `verifyOtp({ token_hash, type: 'recovery' })` path instead — this validates purely against a hash in the URL with no locally-stored verifier needed at all, so it's immune to cross-browser/cross-device link-opening. More correct long-term, but requires customizing the Supabase recovery email template (`{{ .TokenHash }}`) and rewriting `establishRecoverySession()`. Keeps `useSsrCookies: true`, so QMS is untouched.
3. **Do nothing for now, rely on the existing `?code=` fallback**, and just make sure admins always open reset links in the same browser they requested them from. Zero code change, but reintroduces the original bug's failure mode for anyone who doesn't do that (including automated email link-scanners, which some corporate mail security products run automatically).

Option 1 is the more contained fix (isolated to the QMS auth path) and doesn't touch the already-working password-reset code at all. Option 2 is more robust but bigger. This needs a decision before being implemented.
