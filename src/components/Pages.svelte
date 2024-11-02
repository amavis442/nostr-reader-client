<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte'
	import Pagination from './partials/Pagination.svelte'
	import Feeder from './Feeder.svelte'
	import TextNote from './TextNote.svelte'
	import CreateNoteModal from './partials/Modal/CreateNoteModal.svelte'
	import InfoModal from './partials/Modal/InfoModal.svelte'
	import ProfileInfoModal from './partials/Modal/ProfileInfoModal.svelte'
	import NoteInfoModal from './partials/Modal/NoteInfoModal.svelte'
	import Icon from 'svelte-icons-pack/Icon.svelte'
	import FaSolidSync from 'svelte-icons-pack/fa/FaSolidSync'
	import { openModal } from 'svelte-modals'
	import {
		refreshView,
		blockUser,
		followUser,
		unfollowUser,
		publish,
		pageData,
		setApiUrl,
		paginator,
		syncPage,
		getNewNotesCount
	} from '../lib/state/main'
	import { addBookmark, removeBookmark } from '../lib/state/bookmark'
	import type { Note, Profile, NostrEvent } from '../types'

	export let apiUrl: string = ''
	export let renewData: boolean = false
	export let context: string | null = null

	let intervalId: any

	onMount(async () => {
		setApiUrl(apiUrl)

		pageData.set([])

		$paginator.context = context

		await refreshView({
			cursor: 0,
			next_cursor: 0,
			prev_cursor: 0,
			per_page: $paginator.per_page,
			since: $paginator.since,
			renew: renewData,
			context: context
		})
		getNewNotesCounter()
		intervalId = setInterval(getNewNotesCounter, 60 * 1000)
		let elm: null | HTMLElement = document.getElementById('realNotesContainer')
		if (elm) {
			elm.scrollTo(0, 0)
		}
	})

	onDestroy(() => {
		clearInterval(intervalId)
	})

	function createReplyTextNote(replyToNote: Note) {
		openModal(CreateNoteModal, {
			note: replyToNote,
			onSendTextNote: (noteText: string) => {
				publish(noteText, replyToNote)
			}
		})
	}

	function createInfoModal(note: Note) {
		openModal(InfoModal, {
			note: note
		})
	}

	function createProfileInfoModal(profile: Profile) {
		openModal(ProfileInfoModal, {
			profile: profile
		})
	}
	function createNoteInfoModal(note: NostrEvent) {
		openModal(NoteInfoModal, {
			note: note
		})
	}

	function topOfPage(ev: any) {
		let elm: null | HTMLElement = document.getElementById('realNotesContainer')
		if (elm) {
			elm.scrollTo(0, 0)
		}
	}

	let newNotesCount = 0
	async function getNewNotesCounter() {
		newNotesCount = await getNewNotesCount(context)
	}
</script>

<main id="whatever">
	<Feeder>
		<slot>
			<div class="flex flex-col bg-white p-2 rounded-lg m-2">
				<div class="w-full text-center">
				({newNotesCount} waiting notes)
				</div>
			
				{#if $paginator.previous_cursor > 0 || $paginator.next_cursor > 0}
					<Pagination
						on:change={async (ev) => {
							await refreshView({
								cursor: ev.detail.cursor,
								next_cursor: ev.detail.next_cursor,
								prev_cursor: ev.detail.prev_cursor,
								per_page: $paginator.per_page,
								since: $paginator.since,
								renew: false,
								context: context
							})
						}}
					></Pagination>
				{/if}

				<div class="flex w-full justify-center mt-4 mb-4">
					<button on:click={()=> syncPage()} title="sync page" class="p-2 text-gray-800 border-2 border-gray-400 bg-slate-400 rounded ml-1 mr-1"
						><Icon src={FaSolidSync} size="24" color="white" /></button
					>
				</div>
			</div>

			<ul class="items-center w-full border-hidden" id="content">
				{#each $pageData ? $pageData : [] as note (note.event.id)}
					<TextNote
						{note}
						on:followUser={(ev) => followUser(ev.detail)}
						on:unfollowUser={(ev) => unfollowUser(ev.detail)}
						on:addBookmark={(ev) => addBookmark(ev.detail)}
						on:removeBookmark={(ev) => removeBookmark(ev.detail)}
						on:blockUser={(ev) => blockUser(ev.detail)}
						on:reply={(ev) => {
							createReplyTextNote(ev.detail)
						}}
						on:info={(ev) => {
							createInfoModal(ev.detail)
						}}
						on:show_profile={(ev) => {
							createProfileInfoModal(ev.detail)
						}}
						on:topPage={(ev) => topOfPage(ev)}
						on:profileInfo={(ev) => createProfileInfoModal(ev.detail.profile)}
						on:noteInfo={(ev) => createNoteInfoModal(ev.detail.note)}
					></TextNote>
				{/each}
			</ul>
		</slot>
	</Feeder>
</main>

<style lang="postcss">
	.btn {
		@apply font-bold py-2 px-4 rounded;
	}
	.btn-blue {
		@apply bg-blue-500 text-white;
	}
	.btn-blue:hover {
		@apply bg-blue-700;
	}
</style>
