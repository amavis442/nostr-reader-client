<script lang="ts">
	// ABOUTME: Renders note text content with ref substitution, read-more truncation and link previews.
	// ABOUTME: Fires onprofileInfo and onnoteInfo callbacks when embedded profile/note refs are clicked.
	import { onMount } from 'svelte'
	import { toHtml, findLink } from '../../util/html'
	import { translateContent } from '../../state/translate'
	import Preview from './Preview/Preview.svelte'

	import ReadMore from './Readmore/ReadMore.svelte';
	import type { Note, Profile } from '../../types'

	let {
		note,
		onprofileInfo,
		onnoteInfo
	}: {
		note: Note,
		onprofileInfo?: (data: { profile: Profile }) => void,
		onnoteInfo?: (data: { note: any }) => void
	} = $props()

	let imgUrls = $state<string | any[]>([])
	let hasImgUrls = $state(false)
	let content = $state('')
	let translatedContent = $state('')

	onMount(() => {
		imgUrls = findLink(note.event.content)

		if (imgUrls && imgUrls.length > 0) {
			hasImgUrls = true
		}

		content = processRefs(note)
		content = toHtml(content)
	})

	async function tranlate() {
		translatedContent = await translateContent(note.event.content)
	}
	function doNothing() {}

	function processRefs(note: Note): string {
		const eventPrefix =
			"<div class='rounded-2xl border border-solid border-brand/30 bg-brand/10 text-brand overflow-hidden p-1 m-2' id='noteid'> <i class='fa-regular fa-note-sticky'></i> "
		const eventAffix = '</div>'
		const profilePrefix =
			"<span class='rounded-2xl border border-solid border-brand/30 bg-brand/10 text-brand overflow-hidden p-1' id='profileid'><i class='fa-solid fa-user'></i> "
		const profileAffix = '</span>'
		let content: string = note.content

		if (Object.keys(note.refs.event as any ?? {}).length == 0 && Object.keys(note.refs.profile as any ?? {}).length == 0) {
			// The leftovers without present data to replace them
			content = note.content
			content = content.replaceAll('[~[', profilePrefix.replace("id='profileid'", ''))
			content = content.replaceAll(']~]', profileAffix)
			content = content.replaceAll('[~~[', eventPrefix.replace("id='profileid'", ''))
			content = content.replaceAll(']~~]', eventAffix)

			return content
		}



		if (Object.keys(note.refs.event as any ?? {}).length > 0) {
			const eventKeys = Object.keys(note.refs.event as any)
			for (let i = 0; i < eventKeys.length; i++) {
				let ref = (note.refs.event as any)[eventKeys[i]]
				content = content.replaceAll(
					'[~~[' + eventKeys[i] + ']~~]',
					eventPrefix.replace('noteid', 'note_' + ref.id) +
						ref.content.substring(0, 100) +
						' (.....)' +
						eventAffix
				)
			}
		}
		if (Object.keys(note.refs.profile as any ?? {}).length > 0) {
			const profileKeys = Object.keys(note.refs.profile as any)

			for (let i = 0; i < profileKeys.length; i++) {
				let ref = (note.refs.profile as any)[profileKeys[i]]
				content = content.replaceAll(
					'[~[' + profileKeys[i] + ']~]',
					profilePrefix.replace('profileid', 'profile_' + ref.pubkey) + ref.name + profileAffix
				)
			}
		}

		// The leftovers without present data to replace them
		content = content.replaceAll('[~[', profilePrefix.replace("id='profileid'", ''))
		content = content.replaceAll(']~]', profileAffix)
		content = content.replaceAll('[~~[', eventPrefix.replace("id='profileid'", ''))
		content = content.replaceAll(']~~]', eventAffix)


		return content
	}

	function textEvent(event: MouseEvent) {
		let id = (<HTMLElement>event.target).id

		if (id) {
			if (id.indexOf('profile_', 0) != -1) {
				let profileId: string = id.replace('profile_', '')
				let profile: Profile = (note.refs.profile as any)?.[profileId]
				onprofileInfo?.({ profile: profile })
			}

			if (id.indexOf('note_', 0) != -1) {
				let eventId: string = id.replace('note_', '')
				console.debug('Got an id: ' + eventId)
				let noteRef: Event = (note.refs.event as any)?.[eventId]
				console.debug(noteRef)
				onnoteInfo?.({ note: noteRef })
			}
		}
	}
</script>

<span class="text-[#e7e9ea] text-sm font-normal break-words">
	<p onclick={textEvent} role="none">
		<ReadMore textContent={content} maxWords={30} />
	</p>
	{#if import.meta.env.VITE_APP_TRANSLATE_URL && import.meta.env.VITE_APP_TRANSLATE_LANG}
		<button onclick={tranlate} class="p-1 m-2" title="Translate"
			>Translate to ({import.meta.env.VITE_APP_TRANSLATE_LANG})</button
		>
		{#if translatedContent != ''}
			<div
				id="translateContent_{note.event.id}"
				class="rounded-2xl border border-solid border-divider bg-surface p-4 mt-2 mb-2"
			>
				{translatedContent}
			</div>
		{/if}
	{/if}
</span>
{#if hasImgUrls}
	{#each imgUrls as s, outerIndex}
		{#if outerIndex % 3 === 0}
			<div
				class="mt-4 flex flex-cols-2 gap-4 bg-bg_color"
				onclick={(e) => e.stopPropagation()}
				onkeyup={doNothing}
				role="button"
				tabindex="0"
			>
				{#each imgUrls as imgUrl, i}
					{#if i >= outerIndex && i < outerIndex + 3}
						<Preview endpoint={`${import.meta.env.VITE_API_LINK}/api/preview/link`} url={imgUrl} />
					{/if}
				{/each}
			</div>
		{/if}
	{/each}
{/if}
