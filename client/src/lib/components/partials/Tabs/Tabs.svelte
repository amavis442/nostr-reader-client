<script module>
  export const TABS = {};
</script>

<script lang="ts">
  // ABOUTME: Root tabs container managing registration of Tab and TabPanel children via context.
  // ABOUTME: Tracks selected tab state with writable stores shared via setContext.
  import { setContext, onDestroy, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import type { Snippet } from 'svelte';

  let {
    selectedTabIndex = $bindable(0),
    children
  }: {
    selectedTabIndex?: number,
    children?: Snippet
  } = $props();

  let tabElements = $state<any[]>([]);
  let tabs = $state<any[]>([]);
  let panels = $state<any[]>([]);

  const controls = writable({});
  const labeledBy = writable({});

  const selectedTab = writable(null);
  const selectedPanel = writable(null);

  function removeAndUpdateSelected(arr: any[], item: any, selectedStore: any) {
    const index = arr.indexOf(item);
    arr.splice(index, 1);
    selectedStore.update((selected: any) => selected === item ? (arr[index] || arr[arr.length - 1]) : selected);
  }

  function registerItem(arr: any[], item: any, selectedStore: any) {
    arr.push(item);
    selectedStore.update((selected: any) => selected || item);
    onDestroy(() => removeAndUpdateSelected(arr, item, selectedStore));
  }

  function selectTab(tab: any) {
    selectedTabIndex = tabs.indexOf(tab);
    selectedTab.set(tab);
    selectedPanel.set(panels[selectedTabIndex]);
  }

  setContext(TABS, {
    registerTab(tab: any) {
      registerItem(tabs, tab, selectedTab);
    },

    registerTabElement(tabElement: any) {
      tabElements.push(tabElement);
    },

    registerPanel(panel: any) {
      registerItem(panels, panel, selectedPanel);
    },

    selectTab,

    selectedTab,
    selectedPanel,

    controls,
    labeledBy
  });

  onMount(() => {
    selectTab(tabs[selectedTabIndex]);
  });

  $effect(() => {
    for (let i = 0; i < tabs.length; i++) {
      controls.update(controlsData => ({...controlsData, [tabs[i].id]: panels[i].id}));
      labeledBy.update(labeledByData => ({...labeledByData, [panels[i].id]: tabs[i].id}));
    }
  });

  $effect(() => {
    // Track selectedTabIndex changes — preserves original no-op reactive statement behaviour
    void selectedTabIndex;
  });

  async function handleKeyDown(event: KeyboardEvent) {
    if ((event.target as HTMLElement).classList.contains('svelte-tabs__tab')) {
      let selectedIndex = tabs.indexOf($selectedTab);

      switch (event.key) {
        case 'ArrowRight':
          selectedIndex += 1;
          if (selectedIndex > tabs.length - 1) {
            selectedIndex = 0;
          }
          selectTab(tabs[selectedIndex]);
          tabElements[selectedIndex].focus();
          break;

        case 'ArrowLeft':
          selectedIndex -= 1;
          if (selectedIndex < 0) {
            selectedIndex = tabs.length - 1;
          }
          selectTab(tabs[selectedIndex]);
          tabElements[selectedIndex].focus();
      }
    }
  }
</script>

<div class="svelte-tabs" onkeydown={handleKeyDown} role="button" tabindex="0">
  {@render children?.()}
</div>
