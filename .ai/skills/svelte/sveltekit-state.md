# SvelteKit — State Management & $app/state

## $app/state (SvelteKit 2.12+)

Replaces the deprecated `$app/stores`. Import reactive state objects directly — no `$` prefix needed in the template.

```svelte
<script>
  import { page, navigating, updated } from '$app/state';
</script>

<!-- No $ prefix — these are runes-based reactive state, not stores -->
<p>{page.url.pathname}</p>
{#if navigating.to}
  <p>Navigating to {navigating.to.url.pathname}...</p>
{/if}
```

### Migrating from $app/stores

```svelte
<!-- Before (deprecated): -->
<script>
  import { page } from '$app/stores';
</script>
{$page.data.title}

<!-- After: -->
<script>
  import { page } from '$app/state';
</script>
{page.data.title}
```

Run `npx sv migrate app-state` to auto-migrate most usages.

### page object

| Property | Type | Description |
|---|---|---|
| `page.url` | `URL` | Current URL |
| `page.params` | `Record<string, string>` | Route params |
| `page.route` | `{ id: string \| null }` | Current route |
| `page.status` | `number` | HTTP status |
| `page.error` | `App.Error \| null` | Error if any |
| `page.data` | `App.PageData` | Data from all load functions |
| `page.state` | `App.PageState` | Shallow routing state |
| `page.form` | `any` | Form action result |

`page.data` is fine-grained — updates to `page.state` won't invalidate `page.data` and vice versa (improvement over `$app/stores`).

### navigating object

`null` when not navigating, otherwise:

```ts
{
  from: { url: URL, params: Record<string, string>, route: { id: string | null } },
  to:   { url: URL, params: Record<string, string>, route: { id: string | null } },
  type: 'link' | 'popstate' | 'goto' | ...
}
```

### updated object

```js
updated.current // true if a new version of the app has been deployed
await updated.check() // manually check for new version
```

## Avoid shared server state

Never write to module-level variables in server files — they are shared across all users:

```js
// NEVER DO THIS in +page.server.js:
let user; // shared by all visitors!
```

Use `cookies`, databases, or context instead.

## No side-effects in load

Do not write to stores or globals inside `load` — just return the data:

```js
// BAD:
user.set(await response.json());

// GOOD:
return { user: await response.json() };
```

## Context API for cross-component state (SSR-safe)

```svelte
<!-- +layout.svelte -->
<script>
  import { setContext } from 'svelte';
  let { data } = $props();
  setContext('user', () => data.user); // pass getter for reactivity
</script>
```

```svelte
<!-- any child component -->
<script>
  import { getContext } from 'svelte';
  const user = getContext('user');
</script>
<p>Welcome {user().name}</p>
```

If not using SSR, you can safely keep state in shared modules without context.
