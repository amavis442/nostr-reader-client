<script lang="ts">
  // ABOUTME: Individual tab button that registers itself with the parent Tabs context on mount.
  // ABOUTME: Tracks selected state reactively via the shared selectedTab store from context.
  import { getContext, onMount, tick } from 'svelte';
  import type { Snippet } from 'svelte';

  import getId from './id';
  import { TABS } from './Tabs.svelte';

  let { children }: { children?: Snippet } = $props();

  let tabEl = $state<HTMLLIElement | null>(null);

  const tab = { id: getId() };
  const { registerTab, registerTabElement, selectTab, selectedTab, controls } = getContext(TABS) as any;

  const isSelected = $derived($selectedTab === tab);

  registerTab(tab);

  onMount(async () => {
    await tick();
    registerTabElement(tabEl);
  });

  function doNothing() {}
</script>

<style>
	.svelte-tabs__tab {
		border: none;
		border-bottom: 2px solid transparent;
		background: transparent;
		color: var(--ep-muted, #71767b);
    cursor: pointer;
    list-style: none;
    display: inline-block;
    padding: 0.4em 0.6em;
    font-size: 1.1em;
    transition: color 100ms;
	}

  .svelte-tabs__tab:hover {
    color: var(--ep-text, #e7e9ea);
  }

  .svelte-tabs__tab:focus {
    outline: none;
  }

	.svelte-tabs__selected {
		border-bottom: 2px solid var(--ep-selected, #1d9bf0);
    color: var(--ep-text, #e7e9ea);
	}
</style>

<li
  bind:this={tabEl}
  role="tab"
  id={tab.id}
  aria-controls={$controls[tab.id]}
  aria-selected={isSelected}
  tabindex="{isSelected ? 0 : -1}"
  class:svelte-tabs__selected={isSelected}
  class="svelte-tabs__tab"
  onclick={() => selectTab(tab)}
  onkeyup={doNothing}>
  {@render children?.()}
</li>
