<script lang="ts">
  // ABOUTME: Toast notification component for success, error and info messages.
  // ABOUTME: Calls ondismiss callback when the close button is clicked.
  import { fade } from 'svelte/transition'
  import type { Snippet } from 'svelte';

  let {
    type = 'error',
    dismissible = true,
    ondismiss,
    children
  }: {
    type?: string,
    dismissible?: boolean,
    ondismiss?: () => void,
    children?: Snippet
  } = $props();
</script>

<article class="toast toast--{type}" role="alert" transition:fade>
  {#if type === 'success'}
    <i class="fa-regular fa-circle-check text-lg"></i>
  {:else if type === 'error'}
    <i class="fa-regular fa-circle-exclamation text-lg"></i>
  {:else}
    <i class="fa-regular fa-circle-info text-lg"></i>
  {/if}

  <span class="flex-1 text-sm font-medium">
    {@render children?.()}
  </span>

  {#if dismissible}
    <button class="ml-2 p-1 rounded-full opacity-70 hover:opacity-100 transition-opacity" aria-label="dismiss" onclick={() => ondismiss?.()}>
      <i class="fa-regular fa-circle-xmark text-base"></i>
    </button>
  {/if}
</article>

<style lang="postcss">
  @reference "../../../../app.css";

  .toast {
    @apply flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl
           mx-auto mb-2 w-[340px] max-w-[90vw]
           text-white font-sans text-sm;
  }
  .toast--error   { @apply bg-danger; }
  .toast--success { @apply bg-success; }
  .toast--info    { @apply bg-brand; }
</style>
