// ABOUTME: Vite config — registers the Tailwind CSS v4 and SvelteKit plugins.
// ABOUTME: Tailwind v4 uses the Vite plugin directly; no separate PostCSS config is needed.
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()]
});
