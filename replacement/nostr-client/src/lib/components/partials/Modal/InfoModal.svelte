<script lang="ts">
  import Button from "../Button.svelte";
	import type { Note } from "../../../types"

  // ABOUTME: Modal displaying raw note metadata as JSON for debugging purposes.
  // ABOUTME: Receives note via props; provided by svelte-modals.
  let {
    isOpen,
    close,
    note
  }: {
    isOpen: boolean,
    close: () => void,
    note: Note
  } = $props()
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents w-1/2">
      <form>
        <h5 class="text-gray-900 text-xl font-medium mb-2">
          Metadata for note
        </h5>
        <div class="flex flex-col p-2 w-full">
          <div><strong>Event:</strong><p class="break-all">{JSON.stringify(note.event)}</p></div>
          <div  class="text-wrap"><strong>Created at:</strong><p class="break-all">{new Date(note.event.created_at * 1000).toLocaleString(
            "nl-NL"
          )}</p></div>
          <div  class="text-wrap"><strong>Profile:</strong><p class="break-all">{JSON.stringify(note.profile)}</p></div>

        </div>
        <div class="flex space-x-1 p-2">
          <div class="w-6/12 flex justify-end">
            <Button click={close} class="bg-red-500 hover:bg-red-700"
              >Close</Button
            >
          </div>
        </div>
      </form>
    </div>
  </div>
{/if}

<style lang="postcss">
  .modal {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;

    /* allow click-through to backdrop */
    pointer-events: none;
  }

  .contents {
    min-width: 460px;
    border-radius: 6px;
    padding: 16px;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: auto;
  }
</style>
