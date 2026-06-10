# SvelteKit — Loading Data

`load` functions run before a page or layout renders and provide the `data` prop.

## Page data

```js
// src/routes/blog/[slug]/+page.js
/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  return { post: { title: `Title for ${params.slug}`, content: '...' } };
}
```

```svelte
<!-- +page.svelte -->
<script>
  /** @type {import('./$types').PageProps} */
  let { data } = $props();
</script>

<h1>{data.post.title}</h1>
```

## Layout data

Layout `load` functions return data available to the layout AND all child pages:

```js
// src/routes/settings/+layout.js
/** @type {import('./$types').LayoutLoad} */
export function load() {
  return { sections: [{ slug: 'profile', title: 'Profile' }] };
}
```

Child pages receive layout data merged into their own `data`:

```js
// src/routes/settings/profile/+page.js
// data.sections is available here — it came from the parent layout
```

If multiple `load` functions return the same key, the last one wins.

## page.data

A parent layout can read child page data via `page.data` from `$app/state`:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { page } from '$app/state';
</script>

<svelte:head>
  <title>{page.data.title}</title>
</svelte:head>
```

> Legacy: `$app/state` added in SvelteKit 2.12. Before that: `import { page } from '$app/stores'` and use `$page.data.title`.

## Universal vs server load

| | `+page.js` / `+layout.js` | `+page.server.js` / `+layout.server.js` |
|---|---|---|
| Runs on | server + browser | server only |
| Return type | anything (including components) | must be devalue-serializable |
| Use for | external APIs, no private creds needed | DB access, private env vars |
| Type | `PageLoad` / `LayoutLoad` | `PageServerLoad` / `LayoutServerLoad` |

When both exist for a route, server `load` runs first and its result becomes the `data` property of the universal `load`'s argument.

## Input: params, url, route

```js
export function load({ params, url, route }) {
  // params: { slug: 'hello-world' }
  // url: URL instance — url.pathname, url.searchParams, etc.
  // route: { id: '/blog/[slug]' }
}
```

## fetch in load

Use the provided `fetch`, not the global — it handles credentials, relative URLs, and SSR inlining:

```js
export async function load({ fetch, params }) {
  const res = await fetch(`/api/items/${params.id}`);
  return { item: await res.json() };
}
```

## Parent data

```js
// +page.js
export async function load({ parent }) {
  const { a } = await parent(); // data from parent layout load
  return { b: a + 1 };
}
```

Call `getData()` before `await parent()` to avoid waterfalls.

## Errors and redirects

```js
import { error, redirect } from '@sveltejs/kit';

// Expected error (shows +error.svelte):
error(404, 'Not found');

// Redirect:
redirect(307, '/login');
```

> SvelteKit 2: do NOT `throw error(...)` or `throw redirect(...)` — just call them directly.
> Do NOT use `redirect()` inside a `try` block.

## Streaming with promises (server load only)

Return un-awaited promises to stream data progressively:

```js
export async function load({ params }) {
  return {
    post: await loadPost(params.slug),  // blocks render
    comments: loadComments(params.slug) // streamed after
  };
}
```

```svelte
{#await data.comments}
  Loading...
{:then comments}
  {#each comments as c}<p>{c.content}</p>{/each}
{/await}
```

## Rerunning load functions

A `load` function reruns when:
- A referenced `params` property changes
- A referenced `url` property changes
- `await parent()` reruns
- `invalidate(url)` or `invalidateAll()` is called

Rerunning updates the `data` prop without recreating the component — keep derived values reactive with `$derived`.

### Manual invalidation

```js
import { invalidate, invalidateAll } from '$app/navigation';

invalidate('app:custom-key');   // reruns loads that called depends('app:custom-key')
invalidateAll();                 // reruns all active loads
```

```js
// in load:
depends('app:custom-key');
```

## Component/page state is preserved on navigation

SvelteKit reuses components — `onMount` does NOT rerun. Use `$derived` for values that depend on `data`:

```svelte
<script>
  let { data } = $props();
  // BAD: const wordCount = data.content.split(' ').length;
  let wordCount = $derived(data.content.split(' ').length);
</script>
```

Use `afterNavigate` / `beforeNavigate` from `$app/navigation` if lifecycle hooks must rerun.

To force full remount on navigation:
```svelte
<script>
  import { page } from '$app/state';
</script>
{#key page.url.pathname}
  <MyComponent />
{/key}
```
