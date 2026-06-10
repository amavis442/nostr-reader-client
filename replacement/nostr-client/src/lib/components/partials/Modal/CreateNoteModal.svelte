<script lang="ts">
	import Button from '../Button.svelte'
	import TextArea from '../TextArea.svelte'
	import { modals } from 'svelte-modals'
	import EmojiModal from '../Emoji/EmojiModal.svelte'
	import type { Note } from '../../../types'

	// ABOUTME: Modal for composing and sending a new note or reply with optional emoji support.
	// ABOUTME: Uses $bindable textContent on TextArea and calls onSendTextNote on submit.
	let {
		isOpen,
		close,
		note,
		onSendTextNote
	}: {
		isOpen: boolean,
		close: () => void,
		note: Note | null,
		onSendTextNote: Function
	} = $props()

	let textContent = $state('')

	function openEmoji() {
		modals.open(EmojiModal as any, {
			onAddEmoji: (emoji: string) => {
				textContent += emoji
			}
		})
	}

	function send() {
		close()
		onSendTextNote(textContent)
	}
</script>

{#if isOpen}
	<div role="dialog" class="modal">
		<div class="contents">
			<form onsubmit={(e) => e.preventDefault()}>
				{#if note}
					<h5 class="text-gray-900 text-xl font-medium mb-2">
						Re: {note.event.content.slice(0, 30)}<br />
						<small>{note.event.id.slice(0, 5)}...{note.event.id.slice(-5)}</small>
					</h5>
					<TextArea
						id="reply{note.event.id}"
						placeholder="Add reply"
						cols="30"
						rows="5"
						bind:textContent
					/>
				{:else}
					<h5 class="text-gray-900 text-xl font-medium mb-2">Create a new note</h5>
					<TextArea
						id="create-note"
						placeholder="Create a note"
						cols="30"
						rows="5"
						bind:textContent
					/>
				{/if}

				<div class="flex space-x-1 p-2">
					<div class="justify-items-start w-4/12">
						<Button click={send} class="space-x-1"
							><i class="fa-solid fa-paper-plane"></i>
							<span>Send</span>
						</Button>
					</div>
					<div class="w-4/12 flex justify-center">
						<Button click={openEmoji} class="bg-yellow-500 hover:bg-yellow-700">😀 Emoji</Button>
					</div>
					<div class="w-4/12 flex justify-end">
						<Button click={close} class="bg-red-500 hover:bg-red-700">Cancel</Button>
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
