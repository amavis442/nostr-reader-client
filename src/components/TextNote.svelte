<script lang="ts">
	// @ts-nocheck

	import { createEventDispatcher } from 'svelte'
	import NoteContent from './partials/NoteContent.svelte'
	import placeholder from '../assets/profile-picture.jpg'
	import { Icon } from 'svelte-icons-pack'
	import { FaSolidCircleInfo } from 'svelte-icons-pack/fa'
	import { FaSolidUserMinus } from 'svelte-icons-pack/fa'
	import { FaSolidUserPlus } from 'svelte-icons-pack/fa'
	import { FaBookmark } from 'svelte-icons-pack/fa'
	import { FaSolidBookmark } from 'svelte-icons-pack/fa'
	import { FaFolder } from 'svelte-icons-pack/fa'
	import { FaFolderOpen } from 'svelte-icons-pack/fa'
	import { FaSolidBan } from 'svelte-icons-pack/fa'
	import { FaCommentDots } from 'svelte-icons-pack/fa'
	import { FaSolidArrowsRotate } from 'svelte-icons-pack/fa'
	import { FaSolidUpLong } from 'svelte-icons-pack/fa'
	import type { Note, Profile } from '../types'
	import TextArea from './partials/TextArea.svelte'
	import Button from './partials/Button.svelte'
	import { openModal } from 'svelte-modals'
	import EmojiModal from './partials/Emoji/EmojiModal.svelte'
	import { closeModal } from 'svelte-modals'

	const dispatch = createEventDispatcher()
	export let note: Note

	function followUser(pubkey: string) {
		dispatch('followUser', pubkey)
		note.profile.followed = true
	}

	function unfollowUser(pubkey: string) {
		dispatch('unfollowUser', pubkey)
		note.profile.followed = false
	}

	function addBookmark(eventID: string) {
		dispatch('addBookmark', eventID)
		note.bookmark = true
	}

	function removeBookmark(eventID: string) {
		dispatch('removeBookmark', eventID)
		note.bookmark = false
	}

	function blockUser(pubkey: string) {
		if (confirm('Block user?') == true) {
			dispatch('blockUser', pubkey)
		}
	}

	function info(note: Note) {
		dispatch('info', note)
	}

	function showProfile(note: Note) {
		dispatch('show_profile', note.profile)
	}

	function syncnote(note: Note) {
		dispatch('syncNote', note)
	}

	function gotoTopOfPage(note: Note) {
		dispatch('topPage', note)
	}

	let repliesExpanded = false
	function toggleReplies() {
		repliesExpanded = !repliesExpanded
	}

	function normalizeName(profile: Profile): string {
		if (profile == undefined) {
			console.debug('No profile available')
			return note.event.pubkey
		}
		console.debug(profile)
		return (profile ? (profile.name ? profile.name : note.event.pubkey) : note.event.pubkey).slice(
			0,
			profile.name != undefined && profile.name.length < 50 ? profile.name.length : 20
		)
	}

	// For tailwind to recognise all the colors to include
	let borderColor = 'border-blue-100'
	switch (note.tree) {
		case 0:
			borderColor = 'border-blue-200'
			break
		case 1:
			borderColor = 'border-blue-300'
			break
		case 2:
			borderColor = 'border-blue-400'
			break
		case 3:
			borderColor = 'border-blue-500'
			break
		default:
			borderColor = 'border-blue-100'
	}

	function align() {
		if (note.tree == 0) return ''
	}

	function firstBlock() {
		if (note.tree === 0) {
			return 'border-l-4 border-t-2 ' + borderColor
		}
		return ''
	}

	function childBlock() {
		if (note.tree > 0) {
			return 'border-l-4 border-t-2 ' + borderColor
		}

		return ''
	}

	function openEmoji() {
		openModal(EmojiModal, {
			onAddEmoji: (emoji) => {
				textContent += emoji
			}
		})
	}

	function sendReply() {
		dispatch('replyToNote', {'replyTo': note, 'content': textContent})
		hideReplyForm()
	}

	let formStatus = "closed"
	function showReplyForm(note: Note) {
		let id = 'reply_' + note.event.id
		console.debug(id)
		let elm = document.getElementById(id)
		
		if (formStatus == "closed") {
			elm.classList.remove('hidden')
			elm.classList.add('visible')
			formStatus = "open"
			return
		}
		
		if (formStatus == "open") {
			elm.classList.remove('visible')
			elm.classList.add('hidden')
			formStatus = "closed"
			return
		}

		//dispatch('reply', note)
	}

	function hideReplyForm() {
		let id = 'reply_' + note.event.id
		console.debug(id)
		let elm = document.getElementById(id)
		elm.classList.remove('visible')
		elm.classList.add('hidden')
		textContent = ''
		//onSendTextNote(textContent)
	}

	let textContent: string = ''

	$: followed = note.profile.followed
	$: bookmarked = note.bookmark
</script>

{#if note && note.event.kind == 1}
	<li>
		<div class="flex flex-col items-top p-2 w-full overflow-hidden mb-2">
			<div
				class="flex flex-col overflow-y-auto bg-slate-600 rounded-lg p-1 {firstBlock()} {$$props[
					'class'
				]
					? $$props['class']
					: ''}"
			>
				<div
					id={note.id}
					class="flex flex-col w-full min-h-full {align()} items-top gap-2 mb-2 overflow-y-auto bg-slate-200 rounded-lg p-1 {childBlock()}"
				>
					<div class="flex p-2">
						<div
							on:keyup={() => console.log('keyup')}
							class="w-16 mr-2 max-w-min min-w-fit"
							tabindex="0"
							role="button"
							on:click={showProfile(note)}
						>
							<img
								class="w-14 h-14 rounded-full {followed ? 'border-2 border-green-800' : ''}"
								src={note.profile.picture != '' && note.profile.picture != undefined
									? note.profile.picture
									: placeholder}
								title={note.profile.about ? note.profile.about : ''}
								alt={note.event.pubkey.slice(0, 10)}
							/>
						</div>

						<div class="flex flex-col w-full">
							<div class="px-2">
								<div class="flex w-full border-b border-gray-400">
									<div class="text-left order-first w-full">
										<strong class="text-black text-sm font-medium">
											<span title={note.event.pubkey}>{normalizeName(note.profile)}</span>
											{#if bookmarked}
												<i class="fa-solid fa-bookmark" />
											{/if}
											<small class="text-gray"
												>{new Date(note.event.created_at * 1000).toLocaleString('nl-NL')}</small
											>
										</strong>
									</div>
								</div>
							</div>

							<div class="p-2 w-11/12">
								<div class="text-left w-full max-w-max break-words items-top">
									<NoteContent {note} on:profileInfo on:noteInfo></NoteContent>
								</div>
							</div>

							<div class="w-full">
								<p class="mt-4 flex space-x-8 w-full p-1">
									<span>
										{#if note.children && Object.keys(note.children).length > 0}
											<button type="button" on:click={toggleReplies}>
												{#if repliesExpanded}
													<Icon src={FaFolderOpen} size="24" className="inline" />
												{:else}
													<Icon src={FaFolder} size="24" className="inline" />
												{/if}
												<small>({Object.keys(note.children).length})</small>
											</button>
										{/if}
									</span>
								</p>
							</div>
						</div>
					</div>
					<div class="flex w-full p-2">
						<div class="text-right md:w-full border-t border-gray-400 p-2">
							<div class="text-right">
								<div class="flex content-normal justify-center gap-4">
									<div>
										{#if followed}
											<button on:click={unfollowUser(note.event.pubkey)} title="unfollow"
												><Icon src={FaSolidUserMinus} size="24" color="white" /></button
											>
										{:else}
											<button on:click={followUser(note.event.pubkey)} title="follow"
												><Icon src={FaSolidUserPlus} size="24" color="white" /></button
											>
										{/if}
									</div>

									<div>
										{#if bookmarked}
											<button on:click={removeBookmark(note.event.id)} title="remove bookmark"
												><Icon src={FaSolidBookmark} size="24" color="white" /></button
											>
										{:else}
											<button on:click={addBookmark(note.event.id)} title="add bookmark"
												><Icon src={FaBookmark} size="24" color="white" /></button
											>
										{/if}
									</div>

									<div>
										<button on:click={showReplyForm(note)} title="reply"
											><Icon src={FaCommentDots} size="24" color="white" /></button
										>
									</div>
									<div>
										<button on:click={info(note)} title="info"
											><Icon src={FaSolidCircleInfo} size="24" color="white" /></button
										>
									</div>

									<div>
										<button on:click={blockUser(note.event.pubkey)} title="block"
											><Icon src={FaSolidBan} size="24" color="white" /></button
										>
									</div>
									<div>
										<button on:click={gotoTopOfPage(note)} title="block"
											><Icon src={FaSolidUpLong} size="24" color="white" /></button
										>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="flex flex-col w-full p-2">
						<form on:submit|preventDefault id="reply_{note.event.id}" class="hidden">
							<TextArea
								id="reply{note.event.id}"
								placeholder="Add reply"
								cols="30"
								rows="5"
								bind:textContent
							/>
							<div class="flex space-x-1 p-2">
								<div class="justify-items-start w-4/12">
									<Button click={sendReply} class="space-x-1"
										><i class="fa-solid fa-paper-plane" />
										<span>Reply</span>
									</Button>
								</div>
								<div class="w-4/12 flex justify-center">
									<Button click={openEmoji} class="bg-yellow-500 hover:bg-yellow-700"
										>😀 Emoji</Button
									>
								</div>
								<div class="w-4/12 flex justify-end">
									<Button click={hideReplyForm} class="bg-red-500 hover:bg-red-700">Cancel</Button>
								</div>
							</div>
						</form>
					</div>
				</div>
				{#if repliesExpanded}
					{#if note.children && Object.keys(note.children).length > 0}
						<ul>
							{#each Object.values(note.children) as note (note.event.id)}
								<li>
									<!--on:blockUser is required here so that the event is forwarded-->
									<!--https://dev.to/mohamadharith/workaround-for-bubbling-custom-events-in-svelte-3khk-->
									<svelte:self
										{note}
										on:followUser
										on:unfollowUser
										on:blockUser
										on:reply
										on:info
										on:topPage
										on:profileInfo
										on:noteInfo
									/>
								</li>
							{/each}
						</ul>
					{/if}
				{/if}
			</div>
		</div>
	</li>
{/if}

<style lang="postcss">
	.border-indigo-100 {
		border-color: rgb(224 231 255);
	}
	.border-indigo-200 {
		border-color: rgb(199 210 254);
	}
	.border-indigo-300 {
		border-color: rgb(165 180 252);
	}
	.border-indigo-400 {
		border-color: rgb(129 140 248);
	}
	.border-indigo-500 {
		border-color: rgb(99 102 241);
	}
	.border-indigo-600 {
		border-color: rgb(79 70 229);
	}
	.border-indigo-700 {
		border-color: rgb(67 56 202);
	}
	.border-indigo-800 {
		border-color: rgb(55 48 163);
	}
	.border-indigo-900 {
		border-color: rgb(49 46 129);
	}

	button {
		@apply p-2 text-gray-800 border-2 border-gray-400 bg-slate-400 rounded ml-1 mr-1;
	}

	include-color-blue-100 {
		@apply border-blue-100;
	}

	include-color-blue-200 {
		@apply border-blue-200;
	}

	include-color-blue-300 {
		@apply border-blue-300;
	}

	include-color-blue-400 {
		@apply border-blue-400;
	}

	include-color-blue-500 {
		@apply border-blue-500;
	}

	include-color-blue-600 {
		@apply border-blue-600;
	}
</style>
