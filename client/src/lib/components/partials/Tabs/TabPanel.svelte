<script lang="ts">
  // ABOUTME: Tab panel that registers itself with the parent Tabs context and renders when selected.
  // ABOUTME: Visibility is driven by the shared selectedPanel store from context.
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';

  import getId from './id';
  import { TABS } from './Tabs.svelte';

  let { children }: { children?: Snippet } = $props();

  const panel = { id: getId() };
  const { registerPanel, selectedPanel, labeledBy } = getContext(TABS) as any;

  registerPanel(panel);
</script>

<style>
  .svelte-tabs__tab-panel {
    margin-top: 0.5em;
  }
</style>

<div 
  id={panel.id}
  aria-labelledby={$labeledBy[panel.id]}
  class="svelte-tabs__tab-panel"
  role="tabpanel">
  {#if $selectedPanel === panel}
    {@render children?.()}
  {/if}
</div>
