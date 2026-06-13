# Forgot Password — PKCE Fix

## The Problem

The "Forgot Password" email reset flow was broken. Clicking the reset link in the email opened `/reset-password` but instead of showing the new-password form, it displayed:

> **"Link Invalid or Expired"**

With the following console error:

> *PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.*

The full reset flow is implemented across three files:

- `pages/adminaccess.vue` — "Forgot password?" button calls `supabase.auth.resetPasswordForEmail()`
- `plugins/recovery-redirect.client.ts` — redirects any recovery link that lands outside `/reset-password` to that page
- `pages/reset-password.vue` — verifies the recovery session and shows the new-password form

---

## Root Cause

`@nuxtjs/supabase` v2 is built on `@supabase/ssr`, which uses **PKCE (Proof Key for Code Exchange)** as its auth flow.

With PKCE, when `resetPasswordForEmail()` is called, the SDK generates a `code_verifier` and stores it locally. Supabase then emails a link that, when clicked, redirects back to the site with a `?code=...` query parameter. The app must then call `exchangeCodeForSession(code)`, which looks up the stored `code_verifier` to complete the exchange.

The problem: the email link typically opens in a **new tab** (or a mail app's in-app browser), which is a different browser context from where the reset was requested. The `code_verifier` stored by the original tab/device is not available there, so the exchange fails.

---

## What We Tried First — `flowType: 'implicit'` via `clientOptions`

The logical fix was to switch the Supabase client from PKCE to **implicit flow**, which returns tokens directly in the URL hash (`#access_token=...&type=recovery`) with no stored verifier needed. `pages/reset-password.vue` already had code to handle this hash-based path.

We added this to `nuxt.config.ts`:

```ts
supabase: {
  clientOptions: {
    auth: {
      flowType: 'implicit'
    }
  }
}
```

**This did not work.** Inspecting the installed source at:

```
node_modules/.pnpm/@supabase+ssr@0.10.3/node_modules/@supabase/ssr/dist/main/createBrowserClient.js
```

revealed the problem — `@supabase/ssr` **hardcodes** `flowType: 'pkce'` and places it *after* the options spread, so any `flowType` we pass in is unconditionally overridden:

```js
auth: {
  ...options?.auth,   // our flowType: 'implicit' lands here...
  flowType: "pkce",  // ...then gets overridden here, always
}
```

There is no way to override this through `clientOptions` while `@supabase/ssr` is in use.

---

## The Fix

Setting `useSsrCookies: false` in `nuxt.config.ts` causes `@nuxtjs/supabase` to bypass `@supabase/ssr`'s `createBrowserClient` entirely and fall back to plain `createClient` from `@supabase/supabase-js`, which does not hardcode the flow type.

```ts
// nuxt.config.ts
supabase: {
  redirect: false,
  useSsrCookies: false,       // bypass @supabase/ssr's locked-down createBrowserClient
  redirectOptions: { ... },
  clientOptions: {
    auth: {
      flowType: 'implicit'    // now respected by the plain createClient
    }
  }
}
```

With implicit flow active:

1. `resetPasswordForEmail()` no longer generates a PKCE code challenge.
2. Supabase's default email template redirects back to `/reset-password` with `#access_token=...&refresh_token=...&type=recovery` in the URL hash.
3. `pages/reset-password.vue`'s existing `establishRecoverySession()` function detects the hash, calls `supabase.auth.setSession()`, and shows the new-password form.
4. No stored verifier is needed — the entire flow works in a single tab, across tabs, or across devices.

### Why `useSsrCookies: false` is safe here

The app uses client-side-only auth checks (`redirect: false`, route middleware uses `useSupabaseUser()` which is a reactive client-side ref). No page relies on the server reading a session cookie to pre-render protected content, so removing SSR cookie handling has no effect on the user experience.

---

## The Role of `plugins/recovery-redirect.client.ts`

This plugin pre-dates this fix (added in `be517ec`, the commit that introduced the "Forgot password?" feature). It catches a recovery link (`#...&type=recovery` or `?type=recovery`/`?code=`) that lands on any page **other than** `/reset-password`, and redirects to `/reset-password` with that hash/query intact.

In normal operation it's a no-op: `resetPasswordForEmail()` sets `redirectTo` to `window.location.origin + '/reset-password'` ([adminaccess.vue:174](../pages/adminaccess.vue#L174)), and Supabase's verify endpoint redirects straight there with the result appended to the hash — so the user already lands on `/reset-password` and the plugin's path check (`pathname !== '/reset-password'`) is `false`.

It earns its keep as a safety net for origins **not** in Supabase's redirect-URL allowlist (e.g. a Vercel preview/branch deployment). In that case Supabase falls back to the project's Site URL and appends the recovery hash there instead — typically the homepage `/`. Without this plugin, that hash would sit on `/` unprocessed and the reset would silently fail. We decided to keep it for this reason.

---

## Bonus Fix: `otp_expired` Error Handling

While testing, a reset link that sat unused too long produced this URL on `/reset-password`:

```
https://www.superbold.io/reset-password#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired&sb=
```

This *appeared* to work — the new-password form showed and the password update succeeded. But it wasn't actually validating the link. In `establishRecoverySession()` ([reset-password.vue](../pages/reset-password.vue#L123-L160)):

1. `params.get('type') === 'recovery'` → `false` (the hash has `error`/`error_code`, no `type`). Skipped.
2. `route.query.code` → `undefined`. Skipped.
3. Falls through to `supabase.auth.getSession()` — which returned a session because the browser already had an **active admin login** from earlier testing. `sessionReady` became `true` purely because of that pre-existing session, not because the expired link was valid.

Had the browser been logged out, this same expired link would have correctly shown "Link Invalid or Expired" — but with an active session present, an expired/dead link silently "succeeds" via unrelated session state, which is misleading.

### Fix

Added an explicit check for the `error` hash param at the top of `establishRecoverySession()`, before the `type=recovery` and session-fallback checks:

```js
if (params.get('error')) {
  const errorCode = params.get('error_code')
  history.replaceState(null, '', window.location.pathname)

  if (errorCode === 'otp_expired') {
    throw new Error('This reset link has expired. Please request a new one.')
  }

  throw new Error(params.get('error_description') || 'This reset link is invalid. Please request a new one.')
}
```

Now any `error` param in the recovery hash always shows the "Link Invalid or Expired" screen with an appropriate message, regardless of whether an unrelated session happens to be active in the browser.
