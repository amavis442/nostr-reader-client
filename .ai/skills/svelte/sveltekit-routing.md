# SvelteKit — Routing

At the heart of SvelteKit is a filesystem-based router. Routes are directories under `src/routes`:

- `src/routes` → `/`
- `src/routes/about` → `/about`
- `src/routes/blog/[slug]` → `/blog/hello-world` (dynamic parameter)

Route files use a `+` prefix. Rules:
- All files can run on the server
- All files run on the client except `+server` files
- `+layout` and `+error` files apply to subdirectories as well as their own directory

## +page.svelte

Defines a page. Rendered on the server (SSR) for first visit, then CSR for navigation.

Pages receive data from `load` functions via the `data` prop:

```svelte
<!-- src/routes/blog/[slug]/+page.svelte -->
<script>
  /** @type {import('./$types').PageProps} */
  let { data } = $props();
</script>

<h1>{data.title}</h1>
```

> In Svelte 4 you used `export let data`. In Svelte 5 use `let { data } = $props()`.
> `PageProps` was added in SvelteKit 2.16. Before that, type `data` manually as `PageData`.

## +page.js

Exports a `load` function that runs on both server and browser:

```js
// src/routes/blog/[slug]/+page.js
/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  return { title: `Title for ${params.slug}` };
}
```

Can also export page options: `prerender`, `ssr`, `csr`.

## +page.server.js

Like `+page.js` but only runs on the server (use for DB access, private env vars). Change type from `PageLoad` to `PageServerLoad`.

## +error.svelte

Rendered when `load` throws. Uses `page` from `$app/state`:

```svelte
<script>
  import { page } from '$app/state';
</script>

<h1>{page.status}: {page.error.message}</h1>
```

SvelteKit walks up the tree to find the nearest `+error.svelte`.

## +layout.svelte

Wraps all pages in the same directory and below. Must render children:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  let { children } = $props();
</script>

<nav>...</nav>
{@render children()}
```

Nested layouts receive `data` and `children`:

```svelte
<!-- src/routes/settings/+layout.svelte -->
<script>
  /** @type {import('./$types').LayoutProps} */
  let { data, children } = $props();
</script>

{@render children()}
```

> `LayoutProps` was added in 2.16. Before that: `/** @type {{ data: import('./$types').LayoutData, children: Snippet }} */`

## +layout.js / +layout.server.js

Like `+page.js`/`+page.server.js` but for layouts. Data is available to all child pages and layouts.

Use `LayoutLoad` / `LayoutServerLoad` as the type.

## +server.js

API endpoint. Exports HTTP verb handlers (`GET`, `POST`, etc.):

```js
// src/routes/api/random/+server.js
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET() {
  return json(Math.random());
}
```

## $types

SvelteKit generates `$types.d.ts` for type safety:
- `PageProps` — typed props for `+page.svelte`
- `LayoutProps` — typed props for `+layout.svelte`
- `PageLoad` / `PageServerLoad` — typed load functions
- `LayoutLoad` / `LayoutServerLoad` — typed layout load functions

```svelte
<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
</script>
```

## Other files

Any file in a route directory that doesn't start with `+` is ignored by SvelteKit. Colocate components and utilities freely. For shared code across multiple routes, use `$lib`.
