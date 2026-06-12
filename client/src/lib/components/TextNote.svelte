<script lang="ts">
	// @ts-nocheck
	// ABOUTME: Renders a single Nostr text note as a tweet-card with actions, reply form, and recursive child notes.
	// ABOUTME: All parent communication uses callback props; self-imported for recursive child rendering.

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
	import { modals } from 'svelte-modals'
	import EmojiModal from './partials/Emoji/EmojiModal.svelte'
	import TextNote from './TextNote.svelte'

	let {
		note,
		class: cls = '',
		onfollowUser = undefined,
		onunfollowUser = undefined,
		onaddBookmark = undefined,
		onremoveBookmark = undefined,
		onblockUser = undefined,
		oninfo = undefined,
		onshow_profile = undefined,
		onsyncNote = undefined,
		ontopPage = undefined,
		onreplyToNote = undefined,
		onprofileInfo = undefined,
		onnoteInfo = undefined
	} = $props()

	function followUser(pubkey: string) {
		onfollowUser?.(pubkey)
		note.profile.followed = true
	}

	function unfollowUser(pubkey: string) {
		onunfollowUser?.(pubkey)
		note.profile.followed = false
	}

	function addBookmark(eventID: string) {
		onaddBookmark?.(eventID)
		note.bookmark = true
	}

	function removeBookmark(eventID: string) {
		onremoveBookmark?.(eventID)
		note.bookmark = false
	}

	function blockUser(pubkey: string) {
		if (confirm('Block user?') == true) {
			onblockUser?.(pubkey)
		}
	}

	function info(note: Note) {
		oninfo?.(note)
	}

	function showProfile(note: Note) {
		onshow_profile?.(note.profile)
	}

	function gotoTopOfPage(note: Note) {
		ontopPage?.(note)
	}

	let repliesExpanded = $state(false)
	function toggleReplies() {
		repliesExpanded = !repliesExpanded
	}

	function normalizeName(profile: Profile): string {
		if (profile == undefined) return note.event.pubkey.slice(0, 10)
		return (profile.name ? profile.name : note.event.pubkey).slice(
			0,
			profile.name != undefined && profile.name.length < 50 ? profile.name.length : 20
		)
	}

	function formatTime(unixTs: number): string {
		const d = new Date(unixTs * 1000)
		const now = Date.now()
		const diffMs = now - d.getTime()
		const diffMin = Math.floor(diffMs / 60000)
		if (diffMin < 1) return 'now'
		if (diffMin < 60) return `${diffMin}m`
		const diffH = Math.floor(diffMin / 60)
		if (diffH < 24) return `${diffH}h`
		return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
	}

	// Thread depth colour for left border on child notes
	let borderColor = $derived(
		note.tree === 2 ? 'border-red-700' :
		note.tree === 3 ? 'border-pink-700' :
		'border-brand'
	)

	let formStatus = $state("closed")
	function showReplyForm(note: Note) {
		const id = 'reply_' + note.event.id
		const elm = document.getElementById(id)
		if (!elm) return
		if (formStatus == "closed") {
			elm.classList.remove('hidden')
			formStatus = "open"
		} else {
			elm.classList.add('hidden')
			formStatus = "closed"
		}
	}

	function hideReplyForm() {
		const id = 'reply_' + note.event.id
		const elm = document.getElementById(id)
		if (elm) elm.classList.add('hidden')
		textContent = ''
		formStatus = "closed"
	}

	function sendReply() {
		onreplyToNote?.({ replyTo: note, content: textContent })
		hideReplyForm()
	}

	function openEmoji() {
		modals.open(EmojiModal as any, {
			onAddEmoji: (emoji: string) => { textContent += emoji }
		})
	}

	let textContent = $state('')

	const followed = $derived(note.profile.followed)
	const bookmarked = $derived(note.bookmark)
	const childCount = $derived(note.children ? Object.keys(note.children).length : 0)
</script>

{#if note && note.event.kind == 1}
	<li class="tweet-card {note.tree > 0 ? 'border-l-2 ' + borderColor + ' ml-12' : ''} {cls}">
		<div class="flex gap-3 px-4 py-3">

			<!-- Avatar column -->
			<div class="shrink-0">
				<button
					type="button"
					class="block rounded-full ring-2 ring-transparent hover:ring-brand/40 transition-all"
					onclick={() => showProfile(note)}
				>
					<img
						class="w-11 h-11 rounded-full object-cover"
						src={note.profile.picture || placeholder}
						title={note.profile.about ?? ''}
						alt={note.event.pubkey.slice(0, 8)}
					/>
				</button>
			</div>

			<!-- Content column -->
			<div class="flex-1 min-w-0">

				<!-- Header row: name · handle · time -->
				<div class="flex items-baseline gap-1.5 flex-wrap">
					<span class="font-bold text-white text-sm leading-tight">
						{normalizeName(note.profile)}
					</span>
					{#if bookmarked}
						<i class="fa-solid fa-bookmark text-brand text-xs"></i>
					{/if}
					<span class="text-muted text-sm">·</span>
					<span class="text-muted text-sm">{formatTime(note.event.created_at)}</span>
					<span class="text-muted text-xs ml-auto truncate max-w-[120px]" title={note.event.pubkey}>
						{note.event.pubkey.slice(0, 8)}…
					</span>
				</div>

				<!-- Note content -->
				<div class="mt-1 text-[#e7e9ea] text-sm leading-relaxed break-words">
					<NoteContent {note} onprofileInfo={onprofileInfo} onnoteInfo={onnoteInfo} />
				</div>

				<!-- Action bar -->
				<div class="flex items-center mt-3 -ml-1 gap-1">

					<!-- Reply toggle -->
					<button
						type="button"
						class="action-btn"
						title="Reply"
						onclick={() => showReplyForm(note)}
					>
						<Icon src={FaCommentDots} size="16" color="currentColor" />
					</button>

					<!-- Expand/collapse thread replies -->
					{#if childCount > 0}
						<button
							type="button"
							class="action-btn text-xs gap-1"
							title="{repliesExpanded ? 'Collapse' : 'Expand'} {childCount} replies"
							onclick={toggleReplies}
						>
							{#if repliesExpanded}
								<Icon src={FaFolderOpen} size="16" color="currentColor" />
							{:else}
								<Icon src={FaFolder} size="16" color="currentColor" />
							{/if}
							<span class="text-xs">{childCount}</span>
						</button>
					{/if}

					<!-- Follow / Unfollow -->
					{#if followed}
						<button type="button" class="action-btn action-btn--danger" title="Unfollow" onclick={() => unfollowUser(note.event.pubkey)}>
							<Icon src={FaSolidUserMinus} size="16" color="currentColor" />
						</button>
					{:else}
						<button type="button" class="action-btn action-btn--green" title="Follow" onclick={() => followUser(note.event.pubkey)}>
							<Icon src={FaSolidUserPlus} size="16" color="currentColor" />
						</button>
					{/if}

					<!-- Bookmark -->
					{#if bookmarked}
						<button type="button" class="action-btn text-brand" title="Remove bookmark" onclick={() => removeBookmark(note.event.id)}>
							<Icon src={FaSolidBookmark} size="16" color="currentColor" />
						</button>
					{:else}
						<button type="button" class="action-btn" title="Bookmark" onclick={() => addBookmark(note.event.id)}>
							<Icon src={FaBookmark} size="16" color="currentColor" />
						</button>
					{/if}

					<!-- Info -->
					<button type="button" class="action-btn" title="Note info" onclick={() => info(note)}>
						<Icon src={FaSolidCircleInfo} size="16" color="currentColor" />
					</button>

					<!-- Block -->
					<button type="button" class="action-btn action-btn--danger" title="Block user" onclick={() => blockUser(note.event.pubkey)}>
						<Icon src={FaSolidBan} size="16" color="currentColor" />
					</button>

					<!-- Scroll to top -->
					<button type="button" class="action-btn ml-auto" title="Back to top" onclick={() => gotoTopOfPage(note)}>
						<Icon src={FaSolidUpLong} size="16" color="currentColor" />
					</button>
				</div>

				<!-- Inline reply form -->
				<div id="reply_{note.event.id}" class="hidden mt-3 border border-divider rounded-xl p-3">
					<TextArea
						id="reply{note.event.id}"
						placeholder="Post your reply…"
						cols="30"
						rows="3"
						bind:textContent
					/>
					<div class="flex items-center justify-between mt-2">
						<button
							type="button"
							onclick={openEmoji}
							class="text-brand hover:text-brand-dark transition-colors text-base p-1 rounded-full hover:bg-brand/10"
							title="Add emoji"
						>
							<i class="fa-regular fa-face-smile"></i>
						</button>
						<div class="flex gap-2">
							<Button click={sendReply}>
								<i class="fa-solid fa-paper-plane mr-1"></i>
								Reply
							</Button>
							<Button click={hideReplyForm} class="bg-zinc-700 hover:bg-zinc-600">Cancel</Button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Child notes (replies) -->
		{#if repliesExpanded && childCount > 0}
			<ul class="border-t border-divider">
				{#each Object.values(note.children) as child (child.event.id)}
					<TextNote
						note={child}
						onfollowUser={onfollowUser}
						onunfollowUser={onunfollowUser}
						onblockUser={onblockUser}
						onreplyToNote={onreplyToNote}
						oninfo={oninfo}
						ontopPage={ontopPage}
						onprofileInfo={onprofileInfo}
						onnoteInfo={onnoteInfo}
					/>
				{/each}
			</ul>
		{/if}
	</li>
{/if}

<style lang="postcss">
	@reference "../../app.css";

	.tweet-card {
		@apply border-b border-divider hover:bg-white/[0.02] transition-colors duration-100;
	}

	.action-btn {
		@apply flex items-center justify-center gap-1 p-2 rounded-full
		       text-muted hover:text-brand hover:bg-brand/10
		       transition-colors duration-150 cursor-pointer;
	}
	.action-btn--danger {
		@apply hover:text-danger hover:bg-danger/10;
	}
	.action-btn--green {
		@apply hover:text-success hover:bg-success/10;
	}

	/* Keep tailwind from purging the dynamic border-color classes */
	:global(.border-brand)    { border-color: #1d9bf0; }
	:global(.border-red-700)  { border-color: rgb(185 28 28); }
	:global(.border-pink-700) { border-color: rgb(190 24 93); }
</style>
