<script lang="ts">
	// ABOUTME: Transparent full-height container that wraps a feed column.
	// ABOUTME: Renders child content via the children snippet prop.
	import type { Snippet } from 'svelte'

	let { children }: { children?: Snippet } = $props()
</script>

<div class="flex flex-col min-h-screen">
	{@render children?.()}
</div>
