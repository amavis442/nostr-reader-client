<script lang="ts">
	// ABOUTME: Lazy-loads an image by deferring render until the element enters the viewport.
	// ABOUTME: Uses IntersectionObserver with a snippet to conditionally mount the Image component.
	import IntersectionObserver from './IntersectionObserver.svelte'
	import Image from './Image.svelte'

	let { src, alt }: { src: string, alt: string } = $props()

	let nativeLoading = false

	// Determine whether to bypass our intersecting check
	// onMount(() => {
	//   if ('loading' in HTMLImageElement.prototype) {
	//     nativeLoading = true
	//   }
	// })
</script>

<IntersectionObserver once={true}>
	{#snippet children({ intersecting })}
		{#if intersecting || nativeLoading}
			<Image {alt} {src} />
		{/if}
	{/snippet}
</IntersectionObserver>
