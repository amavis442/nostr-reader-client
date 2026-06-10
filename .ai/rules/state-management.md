# State management

## Svelte stores (do NOT migrate)

All application state lives in `$lib/state/` as Svelte `writable` stores. These are **not being migrated** to Svelte 5 runes — they stay as stores.

| Store / file | Purpose |
|---|---|
| `paginator` (paginator.ts) | Pagination cursors, per_page, context |
| `pageData` (paginator.ts) | Current page's array of `Note` objects |
| `page.ts` | `refreshView`, `syncPage`, `setApiUrl` — wraps all fetch calls |
| `bookmark.ts` | Add / remove bookmarks |
| `note.ts` | Publish notes |
| `user.ts` | Follow / unfollow / block users |
| `translate.ts` | Translate note content |

## Store usage in components

Import stores with `$` prefix in templates. The `$store` shorthand works unchanged in Svelte 5.

```svelte
<script lang="ts">
  import { paginator, pageData } from '$lib/state/paginator';
</script>

{#each $pageData as note}...{/each}
{#if $paginator.next_cursor > 0}...{/if}
```

## API call pattern

Components call state functions, never `fetch` directly:

```svelte
<!-- CORRECT -->
import { refreshView } from '$lib/state/page';
await refreshView({ cursor: 0, ... });

<!-- WRONG — no direct fetch in components -->
const res = await fetch(`${import.meta.env.VITE_API_LINK}/api/getnotes`);
```

## Data flows down, events go up

- Parent passes data to children as props
- Children notify parents via callback props (`onfollowUser`, `onreplyToNote`, etc.)
- Children never import stores directly — only `Pages.svelte` and above interact with stores

## Context API

`Tabs.svelte` uses `setContext(TABS, ...)` to share tab state with `Tab.svelte` and `TabPanel.svelte`. The TABS key is exported from `<script module>` in `Tabs.svelte`. `getContext` calls are cast `as any` to work around the `unknown` return type.
