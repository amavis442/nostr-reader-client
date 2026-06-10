<script>
  // ABOUTME: Renders a scrollable grid of Emoji buttons for a single category.
  // ABOUTME: Forwards onemojihover and onemojiclick callbacks to each Emoji child.
  import Emoji from './Emoji.svelte';

  let {
    name = '',
    withTabs = true,
    emojis,
    onemojihover,
    onemojiclick
  } = $props();
</script>

<h3>{name}</h3>

<div class="emoji-list" class:tall={!withTabs}>
  {#each emojis as emoji}
    <Emoji emoji={emoji} {onemojihover} {onemojiclick} />
  {/each}
</div>

<style>
  h3 {
    margin: 0.25em 0.25em 0.1em;
    font-size: 0.75em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--ep-muted, #71767b);
  }

  .emoji-list {
    height: 11rem;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--ep-border, #2f3336) transparent;
  }

  .emoji-list.tall {
    height: 14.9rem;
  }
</style>
