# SvelteKit — Migrating to v2 (breaking changes)

## error() and redirect() are no longer thrown

```js
// v1 (wrong in v2):
throw error(404, 'Not found');
throw redirect(307, '/login');

// v2 (correct):
error(404, 'Not found');
redirect(307, '/login');
```

Do NOT use `redirect()` inside a `try` block — it throws internally and will be caught.

## Top-level promises are no longer awaited automatically

```js
// v1: promises at the top level were auto-awaited
// v2: must await explicitly

// Single promise:
export async function load({ fetch }) {
  const response = await fetch(url).then(r => r.json());
  return { response };
}

// Multiple promises — use Promise.all to avoid waterfall:
export async function load({ fetch }) {
  const [a, b] = await Promise.all([
    fetch(url1).then(r => r.json()),
    fetch(url2).then(r => r.json()),
  ]);
  return { a, b };
}
```

## cookies.set() requires explicit path

```js
// v2: path is required
cookies.set(name, value, { path: '/' });
cookies.delete(name, { path: '/' });
```

## goto() no longer accepts external URLs

```js
// For external navigation:
window.location.href = url;
```

## $app/stores deprecated (v2.12)

Replace `$app/stores` with `$app/state` and remove `$` prefixes:

```svelte
<!-- Before: -->
import { page } from '$app/stores';
{$page.data.title}

<!-- After: -->
import { page } from '$app/state';
{page.data.title}
```

Auto-migrate: `npx sv migrate app-state`

## resolvePath removed → resolveRoute

```js
// v1:
import { resolvePath } from '@sveltejs/kit';
import { base } from '$app/paths';
const path = base + resolvePath('/blog/[slug]', { slug });

// v2:
import { resolveRoute } from '$app/paths';
const path = resolveRoute('/blog/[slug]', { slug });
```

## vitePreprocess no longer re-exported from @sveltejs/kit/vite

```js
// Import directly:
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
```

## Minimum versions (SvelteKit 2.0)

- Node 18.13+
- `svelte@4` (SvelteKit 2) / `svelte@5` (recommended for runes)
- `vite@5`
- `typescript@5`
- `@sveltejs/vite-plugin-svelte@3` (now a peerDependency)
