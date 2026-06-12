import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// vitePreprocess lets Vite (and the Tailwind v4 plugin) process <style lang="postcss"> blocks.
	preprocess: vitePreprocess(),
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		// SPA build: the app fetches all data client-side from the Go API, so it is served as
		// static files. Output lands in the repo-root ./public dir that the Go server serves.
		adapter: adapter({
			pages: '../public',
			assets: '../public',
			fallback: 'index.html',
			precompress: false,
			strict: false
		})
	}
};

export default config;
