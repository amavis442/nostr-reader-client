# Component conventions

## File header

Every `.svelte` file starts with a 2-line ABOUTME comment inside the script block:

```svelte
<script lang="ts">
  // ABOUTME: Short description of what this component renders.
  // ABOUTME: Key props, callbacks, or behaviour worth knowing.
```

## Props

Destructure all props from `$props()` in one declaration at the top of the script:

```svelte
let {
  note,
  class: cls = '',        // rename 'class' — reserved keyword
  onreplyToNote = undefined,
  ...rest                 // only when spreading onto a DOM element
}: { ... } = $props();
```

- `class` → always renamed to `cls`
- optional callbacks → always `= undefined` default
- rest props (`...rest`) → only when the component spreads onto a DOM element (e.g. a native input)

## Callback prop naming

`on` + camelCase event name, matching the original Svelte 4 event name:

| Svelte 4 event | Svelte 5 callback prop |
|---|---|
| `dispatch('followUser', pubkey)` | `onfollowUser?.(pubkey)` |
| `dispatch('profileInfo', { profile })` | `onprofileInfo?.({ profile })` |
| `dispatch('replyToNote', { replyTo, content })` | `onreplyToNote?.({ replyTo, content })` |

Always call with optional chaining: `onx?.(value)` — never assume the callback is provided.

## TypeScript in components

- Always use `lang="ts"` on script blocks that contain type annotations.
- Type the full `$props()` destructure inline or as an interface above it.
- For pre-existing type errors outside migration scope: use `as any`.
- `getContext(KEY)` → cast `as any` (returns `unknown`).

## Snippet typing

```svelte
import type { Snippet } from 'svelte';

// Default children slot:
let { children }: { children?: Snippet } = $props();

// Scoped slot with parameters:
let { children }: { children?: Snippet<[{ intersecting: boolean }]> } = $props();
```

Always use `{@render children?.()}` (optional chaining) unless the snippet is required.

## Tailwind

Use Tailwind utility classes inline on elements. Do not add a `<style>` block unless absolutely necessary. Match surrounding class patterns rather than inventing new colour or spacing combinations.

## Self-closing tags

Do not self-close non-void HTML elements — SvelteKit warns about this:

```svelte
<!-- Wrong -->
<div class="foo" />

<!-- Correct -->
<div class="foo"></div>
```

Void elements (`<input>`, `<img>`, `<br>`, etc.) may be self-closed.

## svelte-modals

Modal components are opened with `openModal` from `svelte-modals`. The type signature is incompatible with Svelte 5's `Component` type — these errors are pre-existing and acceptable. Do not change `openModal` call sites to fix this.

```svelte
import { openModal } from 'svelte-modals';
openModal(MyModal, { propA: value });
```

## svelte:self

`<svelte:self>` is deprecated in Svelte 5 but still works. It is used in `TextNote.svelte` for recursive child notes. Leave it in place — replacing it with a named self-import is Phase 11+ scope.
