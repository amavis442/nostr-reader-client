<script lang="ts">
  // ABOUTME: Overlay popup showing emoji skin-tone variants.
  // ABOUTME: Calls onclose and forwards onemojiclick to each Emoji child.
  import Emoji from './Emoji.svelte';

  let {
    variants,
    onclose,
    onemojiclick
  }: {
    variants: { [key: string]: unknown },
    onclose?: () => void,
    onemojiclick?: (emoji: unknown) => void
  } = $props();

  function doNothing() {}
</script>

<div class="overlay" onclick={onclose} onkeyup={doNothing} role="button" tabindex="0">
  <div class="popup" onclick={(e) => e.stopPropagation()} onkeyup={doNothing} role="none">
    <div class="variants">
      {#each Object.keys(variants) as variant}
        <Emoji emoji={(variants as any)[variant]} {onemojiclick} />
      {/each}
    </div>
    <button type="button" class="close-btn" onclick={onclose} aria-label="Close variants">
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>
</div>

<style>
  .overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    z-index: 10;
  }

  .popup {
    background: var(--ep-bg, #16181c);
    border: 1px solid var(--ep-border, #2f3336);
    border-radius: 10px;
    padding: 0.75em 0.75em 0.5em;
    text-align: center;
    position: relative;
    min-width: 180px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
  }

  .variants {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2px;
  }

  .close-btn {
    margin-top: 0.5em;
    background: transparent;
    border: none;
    color: var(--ep-muted, #71767b);
    cursor: pointer;
    font-size: 0.875em;
    padding: 0.25em 0.5em;
    border-radius: 4px;
  }

  .close-btn:hover {
    color: var(--ep-text, #e7e9ea);
    background: var(--ep-hover, rgba(255,255,255,0.08));
  }
</style>
