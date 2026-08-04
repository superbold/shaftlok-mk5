# Supabase Generated Types

## What This Is

Every table in the `quotes` table detail page, `ProductDetail.vue`, and every other file that calls `supabase.from('some_table')` was, until now, talking to the database **blind** — TypeScript had no idea what columns existed, what their names were, or whether they could be `null`. This document explains what that means, why it's a problem, how it was found, and the two real bugs it caught the moment it was turned on.

---

## Background: What a "Type" Is, With Regard to a Database

A TypeScript **type** is a compile-time description of the shape of a value — what fields it has and what kind of data each field holds. It doesn't exist at runtime; it's checked once, when the code is built, and then erased.

A database table has its own, separate notion of shape: a **schema**. The `products` table, for example, has a real, enforced structure on the Postgres side — a `name` column that's never null, an `image_url` column that *can* be null, a numeric `max_bore_size_mm`, and so on. Postgres enforces this at the database layer no matter what code talks to it.

The problem is that TypeScript and Postgres don't know about each other. When you write:

```ts
const { data } = await supabase.from('products').select('image_url, alt').single()
data.image_url
```

TypeScript has no built-in way to know that `products` even has an `image_url` column, let alone whether it's nullable. Something has to bridge that gap — a **generated type** is that bridge: a `.ts` file, produced directly from the live database schema, that hands TypeScript an accurate description of every table, so `data.image_url` is checked the same way any other typed value would be.

Without that bridge, `supabase.from(...)` calls fall back to some default — and that default is what caused the problem here.

---

## What Was Actually Happening

`nuxt.config.ts` had:

```ts
supabase: {
  types: false,
}
```

`types: false` tells the `@nuxtjs/supabase` module "I have no generated schema file — don't try to type database calls." Tracing through the module's own build step (`node_modules/@nuxtjs/supabase/dist/module.mjs`), when `types` is falsy it writes this into its internal virtual type file instead of real table definitions:

```ts
export type Database = unknown
```

That `Database = unknown` type flows into `useSupabaseClient()`, which flows into `@supabase/supabase-js`'s own `SupabaseClient` generic. Inside `SupabaseClient`'s type parameters, the client tries to look up the shape of the `'public'` schema inside `Database` to figure out what each table's row type is. When `Database` is `unknown` rather than a real schema object, that lookup can't resolve — and the conditional type it's wrapped in falls through to its `never` branch.

The practical result: every `.from('some_table').select(...)` call returned data typed as `never`. Accessing any property on a `never`-typed value is always a TypeScript error — which is why `components/ProductDetail.vue` showed:

```
Property 'image_url' does not exist on type 'never'.
Property 'alt' does not exist on type 'never'.
```

This is compile-time only — Supabase still returns real JSON at runtime, so the page worked fine in the browser. It only meant TypeScript was flying blind on every single database call in the app, silently, with no way to catch a mistake.

---

## How This Was Found

The `never` errors surfaced as IDE diagnostics while making an unrelated change (pointing the "Request Price & Delivery" button at `/quote`). Tracing the error required reading three layers of source, in order:

1. **`@nuxtjs/supabase`'s module code** (`node_modules/@nuxtjs/supabase/dist/module.mjs`) — found the `addTemplate` step that writes `Database = unknown` when `options.types` is falsy.
2. **The module's `useSupabaseClient` type declaration** (`.../composables/useSupabaseClient.d.ts`) — confirmed it's generic over that same `Database` type.
3. **`@supabase/supabase-js`'s `SupabaseClient` class** (`node_modules/.pnpm/@supabase+supabase-js@.../src/SupabaseClient.ts`) — found the specific generic (`Schema extends ... ? ... : never`) that collapses to `never` when the `Database` type can't be resolved.

Confirming the fix required generating real types from the live schema and running a full project typecheck (there was no `typecheck` script in `package.json` — this may have been the first time the whole project was ever typechecked at once).

---

## The Fix

### 1. Generate real types from the live database

```
npx supabase login
npx supabase gen types typescript --project-id biwrvsshuqfgeyfogqos --schema public > types/supabase.ts
```

This produces `types/supabase.ts`, containing a real `Database` type with every table, every column, and its actual nullability — e.g.:

```ts
products: {
  Row: {
    image_url: string | null
    alt: string | null
    // ...
  }
}
```

### 2. Point the module at it

```ts
// nuxt.config.ts
supabase: {
  types: '~~/types/supabase.ts',
}
```

Note: a plain relative path (`'./types/supabase.ts'`) does **not** work here. `@nuxtjs/supabase` resolves that option using a resolver anchored to *its own package directory* (`createResolver(import.meta.url)`), not the project root — so a relative path silently resolves to a nonexistent path inside `node_modules`. The `~~` alias forces resolution against the Nuxt project root instead.

### 3. Regenerate Nuxt's internal types and verify

```
npx nuxi prepare
npx nuxi typecheck
```

---

## The Benefit (Beyond Removing Red Squiggles)

Real schema types turn a category of runtime bug into a build-time error:

- **Typos in column/table names** — `.select('image_urll')` or `.from('qoutes')` fails to compile instead of silently returning `undefined` that's only noticed in production.
- **Renamed or dropped columns** — a migration that renames a column immediately lights up every call site still using the old name, instead of the page quietly breaking. (This is exactly the shape of the "product image on summary page did not match the image on product details page" bug fixed in commit `9c62912`.)
- **Autocomplete** — the editor suggests real table/column names instead of guessing or checking the Supabase dashboard.
- **`.insert()` / `.update()` payload validation** — a missing required column or wrong type is caught at build time, not as a Postgrest 400 a user hits first.
- **CI enforcement** — once a `typecheck` script exists, schema drift can block a merge instead of shipping.

---

## Two Real Bugs This Caught Immediately

Turning on real types didn't just clear the `never` errors — it surfaced two genuine, previously-invisible type mismatches the moment `npx nuxi typecheck` was run for (likely) the first time on this project.

### Bug 1 — `ProductDetail.vue` treated `null` and `undefined` as the same thing

```ts
// before
const image = computed(() => productImage.value?.image_url)
const imageAlt = computed(() => productImage.value?.alt)
```

The real schema says `image_url` and `alt` are `string | null` — a deliberate, valid database state for a product with no image yet. But the component's `<img :src>` / `:alt>` bindings expect `string | undefined`. `null` and `undefined` are not interchangeable to TypeScript, and only the schema-accurate type revealed that this component had never actually accounted for the "no image set" case in a type-safe way.

**Fix:**

```ts
const image = computed(() => productImage.value?.image_url ?? undefined)
const imageAlt = computed(() => productImage.value?.alt ?? undefined)
```

### Bug 2 — `send-quote.post.ts` assumed the logged-in admin's email always exists

```ts
// before
const senderEmail = ADMIN_EMAILS.includes(user.email) ? user.email : ADMIN_EMAILS[0]
```

`user` comes from Supabase's own auth types, where `email` is typed `string | undefined` (an auth provider is not guaranteed to supply one). This line — which decides who the "Reply-To" is on the quote email sent to a sailor — had always silently assumed `user.email` would be present. It happened to work in practice because every admin so far has an email, but nothing enforced it.

**Fix:**

```ts
const senderEmail = ADMIN_EMAILS.includes(user.email ?? '') ? user.email! : ADMIN_EMAILS[0]
```

### A third, related issue (not a DB-types bug, but caught by the same typecheck run)

`server/utils/escapeHtml.ts` indexed into a lookup object (`HTML_ESCAPES[char]`) in a way that TypeScript's strict indexing rules type as possibly `undefined`, which didn't match the function's expected return type. Unrelated to the Supabase schema, but only visible once a full-project typecheck was actually run:

```ts
// before
return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char])

// after
return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char)
```

---

## Files Touched

- `nuxt.config.ts` — `types: false` → `types: '~~/types/supabase.ts'`
- `types/supabase.ts` — new, generated from the live schema (not hand-written; regenerate with the command above whenever the schema changes)
- `components/ProductDetail.vue` — nullish-coalesce `image_url` / `alt` to `undefined`
- `server/api/qms/send-quote.post.ts` — guard against `user.email` being `undefined`
- `server/utils/escapeHtml.ts` — guard against the lookup table returning `undefined`

## Keeping This Current

`types/supabase.ts` is a snapshot of the schema at generation time — it does **not** update automatically when the database changes. Re-run the generation command after any migration:

```
npx supabase login
npx supabase gen types typescript --project-id biwrvsshuqfgeyfogqos --schema public > types/supabase.ts
```

The CLI login token used to generate this file is not kept around (it was revoked from the Supabase dashboard after the initial setup) — `supabase login` will need to be run again first, which opens a browser device-auth flow and mints a fresh token. No manual token-pasting is required for this.
