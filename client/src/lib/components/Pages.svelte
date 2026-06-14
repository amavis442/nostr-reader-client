<script lang="ts">
	// ABOUTME: Main page component that loads and displays a paginated feed of Nostr notes.
	// ABOUTME: Handles note creation, replies, bookmarks, follow/block actions and info modals.
	import { onMount } from 'svelte'
	import Pagination from './partials/Pagination.svelte'
	import Feeder from './Feeder.svelte'
	import TextNote from './TextNote.svelte'
	import InfoModal from './partials/Modal/InfoModal.svelte'
	import ProfileInfoModal from './partials/Modal/ProfileInfoModal.svelte'
	import NoteInfoModal from './partials/Modal/NoteInfoModal.svelte'
	import { Icon } from 'svelte-icons-pack'
	import { FaSolidArrowsRotate } from 'svelte-icons-pack/fa'
	import { modals } from 'svelte-modals'
	import EmojiModal from './partials/Emoji/EmojiModal.svelte'
	import { pageData, setApiUrl,refreshView, syncPage } from '../state/page'
	import { blockUser, followUser, unfollowUser } from '../state/user'
	import { paginator } from '../state/paginator'
	import { publish, getNewNotesCount, markCaughtUp } from '../state/note'
	import { addBookmark, removeBookmark } from '../state/bookmark'
	import type { Note, Profile, NostrEvent } from '../types'
	import { addToast } from './partials/Toast/toast'
	import TextArea from './partials/TextArea.svelte'
	import Button from './partials/Button.svelte'

	let { data } = $props();
	const apiUrl   = $derived<string>(data.apiUrl   ?? '');
	const renewData = $derived<boolean>(data.renewData ?? false);
	const context  = $derived<string | null>(data.context ?? null);

	let textContent: string = $state('')

	// Number of new notes waiting on the relay while the user is caught up.
	let newNotesCount = $state(0)

	onMount(() => {
		setApiUrl(apiUrl)
		pageData.set([])
		$paginator.context = context ?? ''

		refreshView({
			cursor: 0,
			direction: null,
			per_page: $paginator.per_page,
			since: $paginator.since,
			renew: renewData,
			context: context
		}).then((resultCode) => {
			if (resultCode == 3) {
				addToast({ message: 'Request returned empty data set', type: 'error', dismissible: true, timeout: 3000 })
			}
		})

		const checkNewNotes = async () => {
			newNotesCount = await getNewNotesCount(context ?? '')
		}
		checkNewNotes()
		const intervalId = setInterval(checkNewNotes, 60000)
		return () => clearInterval(intervalId)
	})

	async function replyToNote(params: { replyTo: Note; content: string }) {
		publish(params.content, params.replyTo)
			.then((response) => {
				if (response.status == 'ok') {
					refreshView({
						cursor: $paginator.cursor,
						direction: null,
						per_page: $paginator.per_page,
						since: 0,
						renew: false,
						context: $paginator.context
					})
					addToast({ message: 'Message published', type: 'info', dismissible: true, timeout: 3000 })
				}
			})
			.catch((err) => console.error('error', err))
	}

	async function send() {
		publish(textContent, null)
			.then((response) => {
				if (response.status == 'ok') {
					refreshView({
						cursor: $paginator.cursor,
						direction: null,
						per_page: $paginator.per_page,
						since: 0,
						renew: true,
						context: $paginator.context
					})
					textContent = ''
					addToast({ message: 'Message published', type: 'info', dismissible: true, timeout: 3000 })
				} else {
					addToast({ message: 'Unable to publish message', type: 'error', dismissible: true, timeout: 3000 })
				}
			})
			.catch((err) => console.error('error', err))
	}

	function createInfoModal(note: Note) {
		modals.open(InfoModal as any, { note })
	}
	function createProfileInfoModal(profile: Profile) {
		modals.open(ProfileInfoModal as any, { profile })
	}
	function createNoteInfoModal(note: NostrEvent) {
		modals.open(NoteInfoModal as any, { note })
	}

	function topOfPage(_ev: any) {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
	}

	function openEmoji() {
		modals.open(EmojiModal as any, {
			onAddEmoji: (emoji: string) => { textContent += emoji }
		})
	}
</script>

<Feeder>
	<!-- Page header -->
	<div class="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-divider px-4 py-3">
		<h1 class="text-white font-bold text-xl">Feed</h1>
	</div>

	<!-- Composer -->
	<div class="border-b border-divider px-4 py-3">
		<form onsubmit={(e) => e.preventDefault()}>
			<TextArea
				id="create-note"
				placeholder="What's happening?"
				cols="15"
				rows="3"
				bind:textContent
			/>
			<div class="flex items-center justify-between mt-3">
				<button
					type="button"
					onclick={openEmoji}
					class="text-brand hover:text-brand-dark transition-colors text-lg p-1 rounded-full hover:bg-brand/10"
					title="Add emoji"
				>
					<i class="fa-regular fa-face-smile"></i>
				</button>
				<div class="flex items-center gap-2">
					<Button click={send}>
						<i class="fa-solid fa-paper-plane mr-1"></i>
						Post
					</Button>
				</div>
			</div>
		</form>
	</div>

	<!-- Pagination + sync row -->
		<div class="flex items-center justify-between px-4 py-2 border-b border-divider">
			<Pagination
				{newNotesCount}
				cursor={$paginator.cursor}
				hasPrev={$paginator.has_prev}
				hasNext={$paginator.has_next}
				onchange={async (data) => {
					// For "next": use the highest event_created_at on the current page as cursor
					// so the API returns notes newer than what is currently visible.
					// For "prev": use the paginator cursor (minTS returned by the API).
					const cursor = data.direction === 'next'
						? Math.max(...$pageData.map(n => n.event.created_at))
						: $paginator.cursor
					refreshView({
						cursor,
						direction: data.direction,
						per_page: $paginator.per_page,
						since: $paginator.since,
						renew: false,
						context: context
					}, true).then(async (resultCode) => {
						if (resultCode == 3) {
							if (data.direction === 'next') {
								await markCaughtUp(context ?? 'follow')
								addToast({ message: "You're all caught up", type: 'info', dismissible: true, timeout: 3000 })
							} else {
								addToast({ message: 'No more notes', type: 'info', dismissible: true, timeout: 3000 })
							}
						}
					})
				}}
			></Pagination>

			<button
				onclick={() => {
					syncPage().then((resultCode) => {
						if (resultCode == 3) {
							addToast({ message: 'Request returned empty data set', type: 'error', dismissible: true, timeout: 3000 })
						}
					})
				}}
				title="Sync page"
				class="action-icon-btn"
			>
				<Icon src={FaSolidArrowsRotate} size="18" color="currentColor" />
			</button>
		</div>


	<!-- Notes list -->
	<ul class="divide-y divide-divider">
		{#each $pageData ? $pageData : [] as note (note.event.id)}
			<TextNote
				{note}
				onreplyToNote={(data: any) => replyToNote(data)}
				onfollowUser={(pubkey: any) => followUser(pubkey)}
				onunfollowUser={(pubkey: any) => unfollowUser(pubkey)}
				onaddBookmark={(eventId: any) => addBookmark(eventId)}
				onremoveBookmark={(eventId: any) => removeBookmark(eventId)}
				onblockUser={(pubkey: any) => blockUser(pubkey)}
				oninfo={(n: any) => createInfoModal(n)}
				onshow_profile={(profile: any) => createProfileInfoModal(profile)}
				onsyncNote={(_n: any) => {}}
				ontopPage={() => topOfPage(null)}
				onprofileInfo={(data: any) => createProfileInfoModal(data.profile)}
				onnoteInfo={(data: any) => createNoteInfoModal(data.note)}
			></TextNote>
		{/each}
	</ul>
</Feeder>

<style lang="postcss">
	@reference "../../app.css";

	.action-icon-btn {
		@apply p-2 rounded-full text-muted hover:text-brand hover:bg-brand/10 transition-colors;
	}
</style>
