<script lang="ts">
	// ABOUTME: Simple tab navigation — renders a tab list from an items array and tracks the active tab.
	// ABOUTME: Uses onchangeTab callback prop instead of event dispatch.
	import { onMount } from 'svelte'

	type TabItem = { value: string; label: string }

	let {
		items = [] as TabItem[],
		activeTabValue = $bindable<string | undefined>(undefined),
		onchangeTab = undefined as ((value: string) => void) | undefined
	}: {
		items?: TabItem[];
		activeTabValue?: string;
		onchangeTab?: (value: string) => void;
	} = $props()

	onMount(() => {
		if (Array.isArray(items) && items.length && items[0].value) {
			activeTabValue = items[0].value
		}
	})

	const handleClick = (tabValue: string) => () => {
		activeTabValue = tabValue
		onchangeTab?.(tabValue)
	}

	function doNothing() {}
</script>

<ul>
	{#if Array.isArray(items)}
		{#each items as item}
			<li class={activeTabValue === item.value ? 'active' : ''}>
				<span onclick={handleClick(item.value)} onkeyup={doNothing} role="none">{item.label}</span>
			</li>
		{/each}
	{/if}
</ul>

<style lang="postcss">
	ul {
		display: flex;
		flex-wrap: wrap;
		padding-left: 0;
		margin-bottom: 0;
		list-style: none;
		border-bottom: 1px solid #dee2e6;
	}

	span {
		border: 1px solid transparent;
		border-top-left-radius: 0.25rem;
		border-top-right-radius: 0.25rem;
		display: block;
		padding: 0.5rem 1rem;
		cursor: pointer;
	}

	span:hover {
		border-color: #e9ecef #e9ecef #dee2e6;
	}

	li.active > span {
		color: #495057;
		background-color: #fff;
		border-color: #dee2e6 #dee2e6 #fff;
	}
</style>
