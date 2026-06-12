# SvelteKit — Page Options

Exported from `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js`.
Child layouts and pages override parent values.

## prerender

```js
export const prerender = true;   // render at build time
export const prerender = false;  // always server-render (default)
export const prerender = 'auto'; // prerender if possible, SSR fallback
```

Pages with form actions cannot be prerendered. Use `adapter-static` for fully static sites.

## ssr

```js
export const ssr = false; // disable server-side rendering → empty shell
```

Setting `ssr = false` in root `+layout.js` turns the entire app into an SPA.
Not recommended unless you use browser-only globals (like `document`) at module level.

## csr

```js
export const csr = false; // no JavaScript shipped to the client
```

Use for purely static pages (no interactivity needed). Disables HMR.

Enable during dev only:
```js
import { dev } from '$app/environment';
export const csr = dev;
```

## trailingSlash

```js
export const trailingSlash = 'never';  // default — /about/ → /about
export const trailingSlash = 'always'; // /about → /about/
export const trailingSlash = 'ignore'; // both work
```

Set in `+layout.js` to apply to all child pages.

## Summary table

| Option | Values | Where to set |
|---|---|---|
| `prerender` | `true` / `false` / `'auto'` | page or layout js |
| `ssr` | `true` / `false` | page or layout js |
| `csr` | `true` / `false` | page or layout js |
| `trailingSlash` | `'never'` / `'always'` / `'ignore'` | layout js |
