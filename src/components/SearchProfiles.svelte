<script lang="ts">
	import { onMount } from 'svelte'
	import { addToast } from './partials/Toast/toast'
	import { writable } from 'svelte/store'
	import type { Profile } from '../types'

	let searchStr: string

	const profiles = writable<Array<Profile>>([])

	/**
	 * @see https://www.thisdot.co/blog/handling-forms-in-svelte
	 * @param e
	 */
	function followProfile(pubkey: string) {
		fetch(`${import.meta.env.VITE_API_LINK}/api/followuser`, {
			method: 'POST',
			body: JSON.stringify({
				pubkey: pubkey
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => {
				return res.json()
			})
			.then((response) => {
				console.log('Json is ', response)

				if (response.status == 'ok') {
					addToast({
						message: 'Profile added!',
						type: 'success',
						dismissible: true,
						timeout: 3000
					})
				}
				if (response.status == 'error') {
					addToast({
						message: 'Profile could not be added: ' + response.message,
						type: 'error',
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

	function searchProfile() {
		const myUrlWithParams = new URL(`${import.meta.env.VITE_API_LINK}/api/searchprofiles`);
		myUrlWithParams.searchParams.append("q", searchStr);
		console.log(myUrlWithParams.href);

		fetch(myUrlWithParams.href, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => {
				return res.json()
			})
			.then((response) => {
				console.log('Json is ', response)
				console.debug('Profile data ', response.data)
				profiles.set(response.data ? response.data : [])
				return response
			})
			.catch((err) => {
				console.error('error', err)
			})

		return null
	}

	onMount(async () => {})
</script>

<div class="xl:w-10/12 lg:w-10/12 md:w-10/12 sm:w-full">
	<div class="block p-6 rounded-lg shadow-lg w-full ml-6 mt-6 bg-blue-200">
		<form on:submit|preventDefault>
			<div class="row">
				<div class="flex justify-end w-full gap-2">
					<div class="justify-items-start w-full flex-col">
						<div class="pb-2">
							<div class="text-gray-700 w-1/12 p-2 font-sans font-semibold text-lg"
								>Name/Displayname/Pubkey/Npub</div>
						</div>
						<div class="w-full flex">
							<input
								type="text"
								class="text"
								bind:value={searchStr}
								id="relay-url"
								aria-describedby="relayUrl"
								placeholder="search profile"
							/>					
								<button type="button" on:click={searchProfile} class="btn ml-2">
									<div class="flex">
										<div class="inline-block mr-2"><i class="fa-solid fa-circle-plus"></i></div>Search
									</div>
								</button>
						</div>
					</div>
				</div>

				<hr class="m-2" />
				{#each $profiles as profile (profile.pubkey)}
					<div class="flex space-x-1 p-2 hover:bg-gray-400 rounded">
						<div class="justify-items-start w-9/12">
							<strong
								>{profile.name} ({profile.pubkey.slice(0, 5)}...{profile.pubkey.slice(
									64 - 5,
									64
								)})</strong
							>
							<small>{profile.display_name}</small>
						</div>
						{#if !profile.followed}
						<div class="w-3/12 flex justify-end">
							<button
								type="button"
								on:click={() => followProfile(profile.pubkey)}
								class="btn"
							>
							<div class="flex">
								<div class="inline-block mr-2">
								<i class="fa-solid fa-circle-plus"></i></div>Follow
								</div>
							</button>
						</div>
						{/if }
					</div>
				{/each}
			</div>
		</form>
	</div>
</div>

<style lang="postcss">
	.text {
		@apply w-full px-3 py-1.5 text-base font-normal
        text-gray-700 bg-white bg-clip-padding border border-solid
        border-gray-300 rounded transition ease-in-out m-0 
		focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none;
	}
	.btn {
		@apply px-2.5 py-2.5 bg-blue-600 text-white font-medium text-xs
          leading-tight uppercase rounded shadow-md hover:bg-blue-700
          hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none
          focus:ring-0 active:bg-blue-800 active:shadow-lg transition
          duration-150 ease-in-out;
	}

	.btn-follow {
		@apply px-6 py-2.5 bg-red-600 text-white font-medium text-xs
          leading-tight uppercase rounded shadow-md hover:bg-red-700
          hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none
          focus:ring-0 active:bg-red-800 active:shadow-lg transition
          duration-150 ease-in-out;
	}
</style>
