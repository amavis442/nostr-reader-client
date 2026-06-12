<script lang="ts">
  import Button from "../Button.svelte";
	import type { NostrEvent } from "../../../types"

  // ABOUTME: Modal displaying Nostr event content and metadata for a single note.
  // ABOUTME: Receives a NostrEvent via props; provided by svelte-modals.
  let {
    isOpen,
    close,
    note
  }: {
    isOpen: boolean,
    close: () => void,
    note: NostrEvent
  } = $props()
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents w-1/2">
      <form>
        <h5 class="text-[#e7e9ea] text-xl font-medium mb-2">
          Metadata for note: {note.id}
        </h5>
        <div class="flex flex-col p-2 w-full">
          <div  class="text-wrap"><strong>Created at: </strong>{new Date(note.created_at * 1000).toLocaleString(
            "nl-NL"
          )}</div>

          <div><strong>Note: </strong><p class="break-all">{note.content}</p></div>

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
    background: #16181c;
    color: #e7e9ea;
    border: 1px solid #2f3336;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: auto;
  }
</style>
