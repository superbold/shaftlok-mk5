# Password Reset: Switch to token_hash / verifyOtp (Option 2)

This is the resolution to the regression documented in [`forgot-password-smtp.md`](./forgot-password-smtp.md) under "Known Regression: `useSsrCookies` Conflicts With the PKCE Fix." See that doc for the full history — this one covers the fix that was decided on and implemented.

## Context

Fixing the QMS "Send Quote to Sailor" 401 bug required setting `useSsrCookies: true` in `nuxt.config.ts`, which switches the browser Supabase client to `@supabase/ssr`'s `createBrowserClient` — and that client hardcodes `flowType: 'pkce'`, silently overriding the `flowType: 'implicit'` config that an earlier session ([`forgot-password-pkce-fix.md`](./forgot-password-pkce-fix.md)) had put in place specifically to fix a different bug ("Link Invalid or Expired" when a reset link opens in a different browser context than the one that requested it).

Both `useSsrCookies: true` (QMS) and `useSsrCookies: false` (password reset) are needed by different features, and the module only exposes one global switch — so one of the two fixes had to come from somewhere other than that flag.

**Decision: make password reset independent of both PKCE and implicit flow entirely**, using Supabase's `verifyOtp({ token_hash, type: 'recovery' })` API. This validates purely against a hash embedded in the email link — no locally-stored PKCE code verifier, no reliance on which flow the client is configured for — so it works regardless of `useSsrCookies`, and regardless of which browser/device/tab opens the link.

This requires no Supabase plan upgrade — email template customization and `verifyOtp` are both Free-tier Auth features, not Pro-gated.

## What Didn't Need to Change

- `pages/adminaccess.vue` — `handleForgotPassword()` already calls `resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password' })`. `redirectTo` is exactly the value the new email template builds on via `{{ .RedirectTo }}`.
- `plugins/recovery-redirect.client.ts` — already has a query-string fallback (`searchParams.get('type') === 'recovery'`) that redirects any non-`/reset-password` page carrying `?type=recovery` back to `/reset-password` with the query string intact. A `?token_hash=...&type=recovery` link satisfies this same check.
- `nuxt.config.ts` — `useSsrCookies: true` stays as-is. This is the whole point of this fix: resolving the conflict without picking a side.

## What Changed

### 1. Supabase Dashboard — Reset Password email template

Dashboard → **Authentication → Emails → Email Templates → "Reset Password"**. The default link (`{{ .ConfirmationURL }}`, the thing producing PKCE/implicit tokens) was replaced with one built from `{{ .RedirectTo }}` and `{{ .TokenHash }}`:

```html
<h2>Reset Password</h2>
<p>Follow this link to reset the password for your account:</p>
<p><a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery">Reset Password</a></p>
```

`{{ .RedirectTo }}` resolves to whatever was passed as `redirectTo` in the `resetPasswordForEmail()` call — already `.../reset-password` in both dev and prod, so this works on localhost without any template branching.

### 2. `pages/reset-password.vue` — `establishRecoverySession()` rewritten

The old function branched three ways: hash-based implicit tokens (`#access_token=...&type=recovery`, including an `error`/`otp_expired` hash-param check), a PKCE `?code=` exchange via `exchangeCodeForSession`, and a `getSession()` fallback. All three became dead code once the email template stopped producing hash tokens or a `code` param, so they were replaced rather than layering a fourth branch on top:

```js
const establishRecoverySession = async () => {
  const tokenHash = route.query.token_hash
  const type = route.query.type

  if (typeof tokenHash === 'string' && type === 'recovery') {
    const { error: verifyError } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' })
    if (verifyError) throw verifyError

    await router.replace({ path: '/reset-password', query: {} })
    return true
  }

  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}
```

- `verifyOtp` both validates the token **and** establishes the session in one call — no separate `setSession` needed.
- Errors (expired/invalid token_hash) are thrown and caught by the existing `onMounted` try/catch, which sets the error message and leaves `sessionReady` false — same "Link Invalid or Expired" screen as before, no UI changes needed.
- The `getSession()` fallback is kept for the case where the query has already been cleared (e.g. a manual page refresh after the token was consumed).

## Explicitly Out of Scope

- No fallback for old-style reset links already in someone's inbox from before the template change — those still use `{{ .ConfirmationURL }}` and will fail against the new page logic. Given this is a low-traffic, 2-admin internal tool and reset links are meant to be used immediately, a stale link just fails and the admin requests a new one.
- QMS/`send-quote.post.ts` is untouched — this fix doesn't go anywhere near it, by design.

## Verification

1. Apply the email template change in the Supabase dashboard.
2. `pnpm dev`, go to `/adminaccess` → "Forgot password?" → submit.
3. Confirm the email arrives and its link is shaped like `.../reset-password?token_hash=...&type=recovery`.
4. Click the link **in a different browser than the one used to request it** (the actual scenario this fixes) — confirm it lands on the "New Password" form, not "Link Invalid or Expired".
5. Set a new password, confirm sign-in works with it afterward.
6. Re-verify the QMS "Send Quote to Sailor" flow still works unaffected.
7. `npx nuxi typecheck` — sanity check, though `reset-password.vue` has no `lang="ts"` so this is a light check.
