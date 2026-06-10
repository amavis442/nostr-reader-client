<script lang="ts">
  // ABOUTME: Native <dialog> modal wrapper with open/close lifecycle managed via $effect.
  // ABOUTME: Accepts header and default content as named snippet props.
  import type { Snippet } from 'svelte'

  let {
    showModal = $bindable(false),
    header,
    children
  }: {
    showModal?: boolean,
    header?: Snippet,
    children?: Snippet
  } = $props()

  let dialog = $state<HTMLDialogElement | null>(null)

  $effect(() => {
    if (dialog && showModal) dialog.showModal()
    else if (!showModal && dialog) dialog.close()
  })
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
<dialog
  bind:this={dialog}
  onclose={() => (showModal = false)}
  onclick={(e) => { if (e.target === e.currentTarget) dialog!.close() }}
>
  <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
  <div onclick={(e) => e.stopPropagation()}>
    {@render header?.()}
    <hr />
    {@render children?.()}
    <hr />
    <!-- svelte-ignore a11y_autofocus -->
    <button autofocus onclick={() => dialog!.close()}>close modal</button>
  </div>
</dialog>

<style lang="postcss">
  @reference "tailwindcss";

  button {
    @apply p-1 bg-slate-400 rounded ml-1 mr-1 text-white;
  }

  dialog {
    max-width: 32em;
    border-radius: 0.2em;
    border: none;
    padding: 0;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
  dialog > div {
    padding: 1em;
  }
  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  button {
    display: block;
  }
</style>
