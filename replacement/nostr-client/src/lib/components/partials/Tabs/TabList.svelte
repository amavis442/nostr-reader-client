<script lang="ts">
  // ABOUTME: Wrapper rendering the tab button list inside the Tabs component.
  // ABOUTME: No logic — exists solely to provide the correct ARIA tablist role and styling.
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();
</script>

<style>
	.svelte-tabs__tab-list {
    border-bottom: 1px solid var(--ep-border, #2f3336);
    margin: 0;
    padding: 0;
	}
</style>

<ul role="tablist" class="svelte-tabs__tab-list">
  {@render children?.()}
</ul>
