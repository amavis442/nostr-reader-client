<script lang="ts">
  // ABOUTME: Displays filtered emoji search results or a no-results placeholder.
  // ABOUTME: Forwards onemojihover and onemojiclick callbacks to the EmojiList child.
  import EmojiList from './EmojiList.svelte';
  import emojiData from './data/emoji.js';

  let {
    searchText = '',
    onemojihover,
    onemojiclick
  } = $props();

  const searchResults = $derived(
    emojiData.filter((emoji: { names: string[] }) =>
      emoji.names.find(name => name.indexOf(searchText) >= 0)
    )
  );

  function doNothing() {}
</script>

<div class="results">
  {#if searchResults.length}
    <EmojiList emojis={searchResults} withTabs={false} {onemojihover} {onemojiclick} />
  {:else}
    <div class="no-results" onmouseover={() => onemojihover?.(null)} onfocus={doNothing} role="none">
      <span class="icon">😦</span>
      <p>No emojis found</p>
    </div>
  {/if}
</div>

<style>
  .results {
    padding: 0.25em;
    height: 15rem;
  }

  .no-results {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    color: var(--ep-muted, #71767b);
  }

  .icon {
    font-size: 2.5em;
  }

  p {
    margin: 0;
    font-size: 0.875em;
  }
</style>
