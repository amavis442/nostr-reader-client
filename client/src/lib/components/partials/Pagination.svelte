<script lang="ts">
	// ABOUTME: Pagination navigation component driven by the paginator store.
	// ABOUTME: Calls onchange callback with cursor data when previous or next is clicked.
	import { paginator } from '../../state/paginator'

	let {
		onchange,
		newNotesCount = 0
	}: {
		onchange?: (data: { cursor: number, prev_cursor: number, next_cursor: number }) => void
		newNotesCount?: number
	} = $props()

	function changePage(direction: number) {
		if (direction == 1) {
			onchange?.({ cursor: $paginator.previous_cursor, prev_cursor: $paginator.previous_cursor, next_cursor: 0 })
		}
		if (direction == 2) {
			onchange?.({ cursor: $paginator.next_cursor, next_cursor: $paginator.next_cursor, prev_cursor: 0 })
		}
	}

</script>
{#if $paginator.previous_cursor > 0 || $paginator.next_cursor > 0 || newNotesCount > 0}
	<nav class="pagination">
		<ul>
			<li
				class={$paginator.previous_cursor == 0
					? 'disabled'
					: ''}
			>
				<a href={'#'} onclick={() => changePage(1)} aria-label="Previous" class="page-btn">
					<span aria-hidden="true">«</span>
				</a>
			</li>

			<li
				class={$paginator.next_cursor == 0 && newNotesCount < 1
					? 'disabled'
					: ''}
			>
				<a href={'#'} onclick={() => changePage(2)} aria-label="Next" class="page-btn">
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
