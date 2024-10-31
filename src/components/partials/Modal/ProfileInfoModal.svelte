<script lang="ts">
	import { closeModal } from 'svelte-modals'
	import Button from '../Button.svelte'
	import type { Profile } from '../../../types'

	// provided by <Modals />
	export let isOpen: boolean
	export let profile: Profile
</script>

{#if isOpen}
	<div role="dialog" class="modal">
		<div class="contents w-1/2">
			<form>
				<h5 class="text-gray-900 text-xl font-medium mb-2">
					Metadata for profile: <strong>{profile.name}</strong>
				</h5>
				<div class="flex flex-col p-2 w-full">
					<p><span style="font-weight:bold">Pubkey:</span> {profile.pubkey}</p>
					<p><span style="font-weight:bold">Name:</span> {profile.name ? profile.name : '-'}</p>
					<p><span style="font-weight:bold">About:</span> {profile.about ? profile.about : '-'}</p>
					<p>
						<span style="font-weight:bold">Picture:</span>
						{profile.picture ? profile.picture : '-'}
					</p>
					<p>
						<span style="font-weight:bold">Website:</span>
						{profile.website ? profile.website : '-'}
					</p>
					<p>
						<span style="font-weight:bold">Display name:</span>
						{profile.display_name ? profile.display_name : '-'}
					</p>
					<p><span style="font-weight:bold">Nip05:</span> {profile.nip05 ? profile.nip05 : '-'}</p>
					<p><span style="font-weight:bold">Lud 16:</span> {profile.lud16 ? profile.lud16 : '-'}</p>
				</div>
				<div class="flex space-x-1 p-2">
					<div class="w-6/12 flex justify-end">
						<Button click={closeModal} class="bg-red-500 hover:bg-red-700">Close</Button>
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
