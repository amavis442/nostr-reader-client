<script>
  // ABOUTME: Displays the name of the currently hovered emoji.
  // ABOUTME: Shows a non-breaking space when no emoji is active.
  let { emoji } = $props();
</script>

<div class="detail">
  {#if emoji}
    {emoji.name}
  {:else}
    &nbsp;
  {/if}
</div>

<style>
  .detail {
    border-top: 1px solid var(--ep-border, #2f3336);
    padding: 0.35em 0.75em;
    font-size: 0.75em;
    font-weight: 500;
    color: var(--ep-muted, #71767b);
    min-height: 2em;
    line-height: 2em;
    text-align: center;
    text-transform: capitalize;
  }
</style>
