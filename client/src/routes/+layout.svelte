<script lang="ts">
	// ABOUTME: Root layout — sticky sidebar navigation, toast notifications, and modal overlay.
	// ABOUTME: Twitter/X-inspired: black background, collapsible left nav with FA icons, center feed.
	import type { Snippet } from 'svelte'
	import { page } from '$app/state'
	import Toasts from '$lib/components/partials/Toast/Toasts.svelte'
	import { Modals } from 'svelte-modals'
	import favicon from '$lib/assets/favicon.svg'
	import '../app.css'
	import '@fortawesome/fontawesome-free/css/fontawesome.css'
	import '@fortawesome/fontawesome-free/css/solid.css'
	import '@fortawesome/fontawesome-free/css/regular.css'

	let { children }: { children: Snippet } = $props()

	function isActive(path: string): boolean {
		return page.url.pathname === path
	}

	const navItems = [
		{ href: '/',               icon: 'fa-house',            label: 'Home',          title: 'Your followed feed' },
		{ href: '/global',         icon: 'fa-globe',            label: 'Global',        title: 'Global feed' },
		{ href: '/inbox',          icon: 'fa-envelope',         label: 'Replies',       title: 'Your own replies' },
		{ href: '/notifications',  icon: 'fa-bell',             label: 'Notifications', title: 'Replies to your notes' },
		{ href: '/bookmark',       icon: 'fa-bookmark',         label: 'Bookmarks',     title: 'Saved notes' },
		{ href: '/account',        icon: 'fa-user',             label: 'Account',       title: 'Your account' },
		{ href: '/relay',          icon: 'fa-tower-broadcast',  label: 'Relays',        title: 'Your relays' },
		{ href: '/searchprofiles', icon: 'fa-magnifying-glass', label: 'Search',        title: 'Find profiles' },
		{ href: '/profiles',       icon: 'fa-users',            label: 'Following',     title: 'Followed profiles' },
	]
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toasts />

<div class="min-h-screen bg-black text-[#e7e9ea]">
<div class="flex mx-auto max-w-[1280px]">

	<!-- Left sidebar -->
	<aside class="hidden sm:flex flex-col sticky top-0 h-screen shrink-0
	              w-[68px] xl:w-[260px]
	              border-r border-divider px-2 xl:px-4 py-3 overflow-y-auto">

		<!-- Logo -->
		<div class="mb-3 flex items-center px-3 py-2 h-12">
			<i class="fa-solid fa-bolt text-brand text-2xl xl:hidden"></i>
			<span class="hidden xl:block text-white text-2xl font-black tracking-tight">nostr</span>
		</div>

		<nav class="flex flex-col gap-1">
			{#each navItems as item}
				<a href={item.href} title={item.title} class="nav-link {isActive(item.href) ? 'nav-active' : ''}">
					<i class="fa-solid {item.icon} text-[1.25rem] w-6 text-center shrink-0"></i>
					<span class="hidden xl:inline text-[1.0625rem]">{item.label}</span>
				</a>
			{/each}
		</nav>
	</aside>

	<!-- Feed column -->
	<main class="flex-1 min-w-0 sm:max-w-[600px] border-r border-divider">
		{@render children()}
	</main>

	<!-- Right column spacer -->
	<div class="hidden xl:block flex-1 max-w-[390px] px-6 py-4">
		<!-- Future: trending topics, who to follow -->
	</div>
</div>
</div>

<!-- Mobile bottom tab bar -->
<nav class="sm:hidden fixed bottom-0 inset-x-0 bg-black border-t border-divider
            flex justify-around items-center py-3 z-50">
	{#each navItems.slice(0, 5) as item}
		<a href={item.href} title={item.title}
		   class="p-2 rounded-full transition-colors hover:bg-surface
		          {isActive(item.href) ? 'text-white' : 'text-muted'}">
			<i class="fa-solid {item.icon} text-xl"></i>
		</a>
	{/each}
</nav>

<Modals>
	{#snippet backdrop({ close })}
		<div
			class="fixed inset-0 bg-black/60 z-40"
			onclick={() => close()}
			onkeyup={() => close()}
			role="none"
		></div>
	{/snippet}
</Modals>

<style lang="postcss">
	@reference "../app.css";

	.nav-link {
		@apply flex items-center gap-4 px-3 py-3 rounded-full
		       text-[#e7e9ea] font-medium
		       hover:bg-zinc-900 transition-colors duration-150 cursor-pointer;
	}
	.nav-active {
		@apply font-bold text-white;
	}
</style>
