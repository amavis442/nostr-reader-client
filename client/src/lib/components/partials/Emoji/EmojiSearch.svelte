<script lang="ts">
  // ABOUTME: Search input for the emoji picker with clear and keyboard support.
  // ABOUTME: searchText is bindable so the parent can track the current query.
  import { onMount } from 'svelte';

  let { searchText = $bindable('') } = $props();

  let searchField = $state<HTMLInputElement | undefined>(undefined);

  onMount(() => {
    searchField!.focus();
  });

  function clearSearchText() {
    searchText = '';
    searchField!.focus();
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && searchText) {
      clearSearchText();
      event.stopPropagation();
    }
  }

  function doNothing() {}
</script>

<div class="search-wrap">
  <input
    type="text"
    placeholder="Search emojis…"
    bind:value={searchText}
    bind:this={searchField}
    onkeydown={handleKeyDown}
  />
  {#if searchText}
    <span class="icon clear" role="button" tabindex="0"
      onclick={(e) => { e.stopPropagation(); clearSearchText(); }}
      onkeyup={doNothing}>✕</span>
  {:else}
    <span class="icon">🔍</span>
  {/if}
</div>

<style>
  .search-wrap {
    position: relative;
    padding: 0.25em;
  }

  input {
    width: 100%;
    background: rgba(255,255,255,0.08);
    border: 1px solid var(--ep-border, #2f3336);
    border-radius: 20px;
    color: var(--ep-text, #e7e9ea);
    padding: 0.35em 2em 0.35em 0.75em;
    font-size: 0.875em;
    outline: none;
  }

  input::placeholder {
    color: var(--ep-muted, #71767b);
  }

  input:focus {
    border-color: var(--ep-selected, #1d9bf0);
  }

  .icon {
    position: absolute;
    right: 0.75em;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.8em;
    color: var(--ep-muted, #71767b);
    line-height: 1;
  }

  .icon.clear {
    cursor: pointer;
    color: var(--ep-muted, #71767b);
  }
  .icon.clear:hover {
    color: var(--ep-text, #e7e9ea);
  }
</style>
