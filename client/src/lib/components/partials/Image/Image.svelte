<script lang="ts">
	// ABOUTME: Lazy-loading image component with fade-in on load.
	// ABOUTME: Uses bind:this and onMount to detect image load completion.
	import { onMount } from 'svelte'

	let { src, alt } = $props();

	let loaded = $state(false)
	let thisImage = $state<HTMLImageElement | null>(null)

	onMount(() => {
		thisImage!.onload = () => {
			loaded = true
		}
	})
</script>

<img {src} {alt} class:loaded bind:this={thisImage} loading="lazy" />

<style>
	img {
		height: 200px;
		opacity: 0;
		transition: opacity 1200ms ease-out;
	}
	img.loaded {
		opacity: 1;
	}
</style>
