<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import Pagination from './partials/Pagination.svelte'
	import Feeder from './Feeder.svelte'
	import TextNote from './TextNote.svelte'
	import InfoModal from './partials/Modal/InfoModal.svelte'
	import ProfileInfoModal from './partials/Modal/ProfileInfoModal.svelte'
	import NoteInfoModal from './partials/Modal/NoteInfoModal.svelte'
	import { Icon } from 'svelte-icons-pack'
	import { FaSolidArrowsRotate } from 'svelte-icons-pack/fa'
	import { openModal } from 'svelte-modals'
	import EmojiModal from './partials/Emoji/EmojiModal.svelte'
	import { refreshView, syncPage } from '../lib/state/page'
	import { blockUser, followUser, unfollowUser } from '../lib/state/user'
	import { paginator } from '../lib/state/paginator'
	import { pageData, setApiUrl } from '../lib/state/page'
	import { publish } from '../lib/state/note'
	import { addBookmark, removeBookmark } from '../lib/state/bookmark'
	import type { Note, Profile, NostrEvent } from '../types'
	import { addToast } from './partials/Toast/toast'
	import TextArea from './partials/TextArea.svelte'
	import Button from './partials/Button.svelte'

	export let apiUrl: string = ''
	export let renewData: boolean = false
	export let context: string | null = null

	//let intervalId: any
	let textContent: string = ''

	onMount(async () => {
		setApiUrl(apiUrl)

		pageData.set([])

		$paginator.context = context
		let elm: null | HTMLElement = document.getElementById('realNotesContainer')

		refreshView({
			cursor: 0,
			next_cursor: 0,
			prev_cursor: 0,
			per_page: $paginator.per_page,
			since: $paginator.since,
			renew: renewData,
			context: context
		}).then((resultCode) => {
			if (resultCode == 3) {
				addToast({
					message: 'Request returned empty data set',
					type: 'error',
					dismissible: true,
					timeout: 3000
				})
				return
			}
			if (elm) {
				elm.scrollTo(0, 0)
			}
		})

		//getNewNotesCounter()
		//intervalId = setInterval(getNewNotesCounter, 60 * 1000)
	})

	onDestroy(() => {
		//clearInterval(intervalId)
	})

	/*
	function createReplyTextNote(replyToNote: Note) {
		openModal(CreateNoteModal, {
			note: replyToNote,
			onSendTextNote: (noteText: string) => {
				publish(noteText, replyToNote)
			}
		})
	}
	*/

	async function replyToNote(params: { replyTo: Note; content: string }) {
		let noteText = params.content
		let replyToNote = params.replyTo
		publish(noteText, replyToNote)
			.then((response) => {
				console.debug('Json is ', response, ' and note is ', replyToNote)
				if (response.status == 'ok') {
					console.debug('Refresh after publish: ', replyToNote.event.id)
					refreshView({
						cursor: $paginator.cursor,
						prev_cursor: 0,
						next_cursor: 0,
						per_page: $paginator.per_page,
						since: 0,
						renew: false,
						context: $paginator.context
					})
					addToast({
						message: 'Message published',
						type: 'info',
						dismissible: true,
						timeout: 3000
					})
				}
				return response
			})
			.catch((err) => {
				console.error('error', err)
			})
	}

	async function send() {
		publish(textContent, null)
			.then((response) => {
				if (response.status == 'ok') {
					refreshView({
						cursor: $paginator.cursor,
						prev_cursor: 0,
						next_cursor: 0,
						per_page: $paginator.per_page,
						since: 0,
						renew: true,
						context: $paginator.context
					})
					textContent = ''
					addToast({
						message: 'Message published',
						type: 'info',
						dismissible: true,
						timeout: 3000
					})
				}
				if (response.status != 'ok') {
					addToast({
						message: 'Unable to ppublish message',
						type: 'error',
						dismissible: true,
						timeout: 3000
					})
				}
			})
			.catch((err) => {
				console.error('error', err)
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
		let elm: null | HTMLElement = document.getElementById('content')
		if (elm) {
			elm.scrollTo({
				top: 0,
				left: 0,
				behavior: 'smooth'
			})
		}
	}

	function openEmoji() {
		openModal(EmojiModal, {
			onAddEmoji: (emoji) => {
				textContent += emoji
			}
		})
	}
	/*
	let newNotesCount = 0
	async function getNewNotesCounter() {
		newNotesCount = await getNewNotesCount(context)
	}
	*/
</script>

<main id="whatever">
	<Feeder>
		<slot>
			<div class="flex flex-col bg-white p-2 rounded-lg m-2">
				<div class="flex justify-center mb-2 p-2">
					{#if $paginator.previous_cursor > 0 || $paginator.next_cursor > 0}
						<Pagination
							on:change={async (ev) => {
								refreshView({
									cursor: ev.detail.cursor,
									next_cursor: ev.detail.next_cursor,
									prev_cursor: ev.detail.prev_cursor,
									per_page: $paginator.per_page,
									since: $paginator.since,
									renew: false,
									context: context
								}).then((resultCode) => {
									console.debug('Result code is ', resultCode)
									if (resultCode == 3) {
										addToast({
											message: 'Request returned empty data set',
											type: 'error',
											dismissible: true,
											timeout: 3000
										})
										return
									}
								})
							}}
						></Pagination>
					{/if}

					<div>
						<button
							on:click={() => {
								syncPage().then((resultCode) => {
									console.debug('Result code is ', resultCode)
									if (resultCode == 3) {
										addToast({
											message: 'Request returned empty data set',
											type: 'error',
											dismissible: true,
											timeout: 3000
										})
										return
									}
								})
							}}
							title="sync page"
							class="p-2 text-gray-800 border-2 border-gray-400 bg-slate-400 rounded ml-1 mr-1"
							><Icon src={FaSolidArrowsRotate} size="24" color="white" /></button
						>
					</div>
				</div>
				<div class="flex flex-col w-full">
					<form on:submit|preventDefault>
						<TextArea
							id="create-note"
							placeholder="Create a note"
							cols="15"
							rows="2"
							bind:textContent
						/>

						<div class="flex space-x-1 p-1 justify-center">
							<div class="justify-items-start w-4/12">
								<Button click={send} class="space-x-1"
									><i class="fa-solid fa-paper-plane" />
									<span>Send</span>
								</Button>
							</div>
							<div class="w-4/12 flex justify-center">
								<Button click={openEmoji} class="bg-yellow-500 hover:bg-yellow-700">😀 Emoji</Button
								>
							</div>
						</div>
					</form>
				</div>
			</div>

			<ul class="items-center w-full border-hidden overflow-y-auto" id="content">
				{#each $pageData ? $pageData : [] as note (note.event.id)}
					<TextNote
						{note}
						on:replyToNote={(ev) => replyToNote(ev.detail)}
						on:followUser={(ev) => followUser(ev.detail)}
						on:unfollowUser={(ev) => unfollowUser(ev.detail)}
						on:addBookmark={(ev) => addBookmark(ev.detail)}
						on:removeBookmark={(ev) => removeBookmark(ev.detail)}
						on:blockUser={(ev) => blockUser(ev.detail)}
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
