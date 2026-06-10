# Svelte 5 migration rules

This project is being migrated from Svelte 4 to Svelte 5 runes. All `.svelte` files must use runes — the compiler enforces this globally.

## Pattern reference

| Svelte 4 | Svelte 5 | Notes |
|---|---|---|
| `export let foo = x` | `let { foo = x } = $props()` | |
| `$$props['class']` | `let { class: cls, ...rest } = $props()` | Rename to avoid reserved word |
| `{...$$props}` | `{...rest}` after `$props()` destructuring | |
| `$: val = expr` | `const val = $derived(expr)` | Pure derivation |
| `$: { sideEffect }` | `$effect(() => { sideEffect })` | Side effects only |
| `createEventDispatcher` + `dispatch('x', v)` | callback prop `onx?.(v)` | See callback props below |
| `on:click={h}` | `onclick={h}` | All native DOM events |
| `on:submit\|preventDefault` | `onsubmit={(e) => e.preventDefault()}` | Modifiers are inline |
| `<slot />` | `{@render children?.()}` | Import `Snippet` from `svelte` |
| `<slot name="x" />` | `{@render x?.()}` with `x?: Snippet` prop | |
| `<slot {val}>` | `{@render children?.({ val })}` | Typed as `Snippet<[{ val: T }]>` |
| `let:val` in parent | `{#snippet children({ val })}` | |
| `afterUpdate(fn)` | `$effect(fn)` | |
| `<script context="module">` | `<script module>` | |
| `$app/stores` (`$page`) | `$app/state` (`page`) — no `$` prefix | See sveltekit-state.md |

## What does NOT change

- `bind:value` / `bind:checked` on native `<input>` / `<select>` / `<textarea>` — unchanged
- `bind:this` on DOM elements — unchanged
- `onMount` / `onDestroy` — unchanged
- `getContext` / `setContext` — unchanged
- Svelte stores (`writable`, `$store` shorthand) in `$lib/state/` — do NOT migrate stores to runes

## Callback props

Replace `createEventDispatcher` with callback props. Name them `on<EventName>` in camelCase:

```svelte
<!-- Before -->
const dispatch = createEventDispatcher();
dispatch('followUser', pubkey);

<!-- After -->
let { onfollowUser = undefined } = $props();
onfollowUser?.(pubkey);
```

**Always give optional callbacks a `= undefined` default** so TypeScript treats them as optional, not required.

**Event forwarding** (Svelte 4 `on:event` without a handler) no longer exists. Pass callback props explicitly:

```svelte
<!-- Svelte 4 forwarding -->
<Child on:followUser />

<!-- Svelte 5 explicit -->
<Child onfollowUser={onfollowUser} />
```

## Bindable props

When a parent uses `bind:foo`, the child must declare it with `$bindable()`:

```svelte
let { textContent = $bindable('') } = $props();
```

## Snippets (replacing slots)

```svelte
<!-- Component accepting children -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  let { children }: { children?: Snippet } = $props();
</script>
{@render children?.()}

<!-- Component accepting a typed scoped slot -->
let { children }: { children?: Snippet<[{ intersecting: boolean }]> } = $props();
{@render children?.({ intersecting })}

<!-- Caller side (replaces let:val) -->
<Component>
  {#snippet children({ intersecting })}
    ...
  {/snippet}
</Component>
```

## TypeScript

- Always add `lang="ts"` when the script block contains type annotations.
- Use `$state<Type>(initialValue)` for typed state.
- `getContext(KEY)` returns `unknown` — cast with `as Type` or `as any`.
- Pre-existing type errors unrelated to the migration: use `as any` and move on. Do not fix out-of-scope issues.
- `// @ts-nocheck` is acceptable on complex components with deep pre-existing TS issues (e.g. TextNote).
- The `!` non-null assertion is acceptable when the DOM binding guarantees non-null — add a justification comment.

## File header

Every `.svelte` file must start with a 2-line ABOUTME comment:

```svelte
<script lang="ts">
  // ABOUTME: One sentence describing what this component does.
  // ABOUTME: One sentence about its key props or callbacks.
```
