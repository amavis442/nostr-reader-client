# .ai Index

This directory contains rules and skills for AI assistants working on this project.

## Directory structure

```
.ai/
  INDEX.md          ← this file
  rules/            ← project conventions (not yet populated)
  skills/
    svelte/         ← Svelte 5 + SvelteKit reference material
```

---

## Skills

### Svelte 5

| File | Size | Read when... |
|---|---|---|
| [`skills/svelte/svelte-small.md`](skills/svelte/svelte-small.md) | 51 KB | You need Svelte 5 rune syntax or an abridged SvelteKit overview |
| [`skills/svelte/svelte-full.md`](skills/svelte/svelte-full.md) | 1132 KB | ⚠ Only if svelte-small.md doesn't cover the topic — read in sections with offset/limit |

### SvelteKit (focused sub-skills — prefer these over the large files)

| File | Size | Read when... |
|---|---|---|
| [`skills/svelte/sveltekit-routing.md`](skills/svelte/sveltekit-routing.md) | 3.3 KB | Working with `+page.svelte`, `+layout.svelte`, `+error.svelte`, `+server.js`, `$types` |
| [`skills/svelte/sveltekit-loading.md`](skills/svelte/sveltekit-loading.md) | 4.5 KB | Writing `load` functions, the `data` prop, fetch, redirects, streaming, invalidation |
| [`skills/svelte/sveltekit-state.md`](skills/svelte/sveltekit-state.md) | 2.7 KB | Using `$app/state` (`page`, `navigating`), migrating from `$app/stores`, context API |
| [`skills/svelte/sveltekit-page-options.md`](skills/svelte/sveltekit-page-options.md) | 1.5 KB | Setting `prerender`, `ssr`, `csr`, `trailingSlash` |
| [`skills/svelte/sveltekit-migration-v2.md`](skills/svelte/sveltekit-migration-v2.md) | 2.1 KB | Breaking changes when migrating to SvelteKit v2 |
| [`skills/svelte/svelte-kit-small.md`](skills/svelte/svelte-kit-small.md) | 564 KB | ⚠ Source of truth for all SvelteKit docs — only read in sections, never in full |

### Quick lookup

| Question | File |
|---|---|
| How do I declare props / state / effects in Svelte 5? | `svelte-small.md` |
| How do slots / children / snippets work? | `svelte-small.md` |
| How do I set up a route or layout? | `sveltekit-routing.md` |
| How does the `data` prop work in a page? | `sveltekit-routing.md` + `sveltekit-loading.md` |
| How do I read current URL / params in a component? | `sveltekit-state.md` |
| What changed between SvelteKit v1 and v2? | `sveltekit-migration-v2.md` |
| When should I use `ssr = false`? | `sveltekit-page-options.md` |

---

## Rules

Read the relevant rule file before starting any task in this project.

| File | Read when... |
|---|---|
| [`rules/project-overview.md`](rules/project-overview.md) | First time in this project, or when unsure about architecture |
| [`rules/svelte5-migration.md`](rules/svelte5-migration.md) | Migrating any `.svelte` file from Svelte 4 to Svelte 5 runes |
| [`rules/component-conventions.md`](rules/component-conventions.md) | Creating or editing any `.svelte` component |
| [`rules/state-management.md`](rules/state-management.md) | Touching stores, API calls, or data flow between components |
| [`rules/domain-types.md`](rules/domain-types.md) | Working with `Note`, `Profile`, `NostrEvent`, `Paginator` types |
