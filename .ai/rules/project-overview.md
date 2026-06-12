# Project overview

## What this is

A Nostr social-protocol client — a web front-end that reads and posts notes (messages) to Nostr relays via a separate Go backend API.

## Stack

| Tool | Version | Notes |
|---|---|---|
| Svelte | 5.x | Runes mode enforced globally via `svelte.config.js` |
| SvelteKit | 2.x | Routes in `src/routes/` |
| TypeScript | 6.x | Strict mode; `lang="ts"` required on all typed script blocks |
| Tailwind CSS | 4.x | Utility classes inline; no component CSS unless Tailwind can't cover it |
| Vite | 8.x | Dev + build tool |

## Architecture

**No SSR.** The app is a client-side SPA — all data is fetched in the browser via the Go backend. There are no `+page.server.js` or `+layout.server.js` files and none should be added.

**Routing is thin.** Route files (`+page.svelte`) are one-liners that render a feature component. All logic lives in `$lib/components/` and `$lib/state/`.

**API access pattern:** components call functions from `$lib/state/` which call `fetch()` against `import.meta.env.VITE_API_LINK`. Components never call `fetch` directly.

## Directory structure

```
src/
  lib/
    assets/           ← images, favicon
    components/
      partials/       ← reusable UI (Button, Modal, Tabs, Emoji, Pagination, …)
      *.svelte        ← feature components (TextNote, Pages, Feed, Followed, …)
    state/            ← Svelte stores + API call functions
    util/             ← pure helpers (html, time)
    types.d.ts        ← shared domain types (Note, Profile, NostrEvent, …)
  routes/
    +layout.svelte    ← sets favicon, renders children
    +page.svelte      ← renders <Followed /> (default feed)
    settings/
      +page.svelte    ← settings page
```

## Environment variables

All accessed via `import.meta.env.*` (Vite static):

| Variable | Purpose |
|---|---|
| `VITE_API_LINK` | Base URL of the Go backend |
| `VITE_APP_TRANSLATE_URL` | Optional translation service |
| `VITE_APP_TRANSLATE_LANG` | Target language for translation |
