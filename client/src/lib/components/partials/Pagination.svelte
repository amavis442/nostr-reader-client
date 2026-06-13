<script lang="ts">
	// ABOUTME: Pagination navigation component for cursor-based navigation.
	// ABOUTME: Receives cursor values as props; calls onchange with cursor data when prev/next is clicked.

	let {
		onchange,
		newNotesCount = 0,
		previousCursor = 0,
		nextCursor = 0
	}: {
		onchange?: (data: { cursor: number, direction: 'next' | 'prev' }) => void
		newNotesCount?: number
		previousCursor?: number
		nextCursor?: number
	} = $props()

	function changePage(direction: 'next' | 'prev') {
		if (direction === 'prev') {
			onchange?.({ cursor: previousCursor, direction: 'prev' })
		}
		if (direction === 'next') {
			onchange?.({ cursor: nextCursor, direction: 'next' })
		}
	}

</script>
{#if previousCursor > 0 || nextCursor > 0 || newNotesCount > 0}
	<nav class="pagination">
		<ul>
			<li
				class={previousCursor == 0
					? 'disabled'
					: ''}
			>
				<a href={'#'} onclick={() => changePage('prev')} aria-label="Previous" class="page-btn">
					<span aria-hidden="true">«</span>
				</a>
			</li>

			<li
				class={nextCursor == 0 && newNotesCount < 1
					? 'disabled'
					: ''}
			>
				<a href={'#'} onclick={() => changePage('next')} aria-label="Next" class="page-btn">
					<span aria-hidden="true">»</span>
				</a>
				{#if newNotesCount > 0}
					<span class="new-badge" title="{newNotesCount} nieuwe notes">{newNotesCount}</span>
				{/if}
			</li>
		</ul>
	</nav>
{/if}

<style lang="postcss">
	@reference "../../../app.css";

	.pagination {
		@apply flex justify-center;
	}
	.pagination ul {
		@apply flex list-none p-0 gap-1;
	}
	.pagination li {
		@apply relative;
	}
	.new-badge {
		@apply absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center
		       rounded-full bg-brand text-black text-xs font-bold pointer-events-none;
	}
	.page-btn {
		@apply flex h-9 w-9 items-center justify-center rounded-full
		       text-brand border border-brand
		       hover:bg-brand hover:text-black
		       transition-colors duration-150 font-bold text-base;
	}
	.pagination li.disabled .page-btn {
		@apply text-muted border-divider pointer-events-none;
	}
</style>
