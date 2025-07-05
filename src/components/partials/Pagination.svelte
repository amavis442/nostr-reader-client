<script>
	import { paginator } from '../../lib/state/paginator'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	function changePage(direction) {
		if (direction == 1) {
			dispatch('change', {cursor: $paginator.previous_cursor, prev_cursor:$paginator.previous_cursor, next_cursor: 0 })
		}
		if (direction == 2) {
			dispatch('change', {cursor: $paginator.next_cursor, next_cursor:$paginator.next_cursor, prev_cursor: 0 })
		}		
	}

	console.debug($paginator)

</script>
{#if $paginator.previous_cursor > 0 || $paginator.next_cursor > 0}
	<nav class="pagination">
		<ul>
			<li
				class={$paginator.previous_cursor == 0
					? 'disabled'
					: ''}
			>
				<a
					href={'#'}
					on:click={() => changePage(1)}
					aria-label="Previous"
					class="mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-light-300"
				>
					<span aria-hidden="true">«</span>
				</a>
			</li>
	
			<li
				class={$paginator.next_cursor == 0 
					? 'disabled'
					: ''}
			>
				<a
					href={'#'}
					on:click={() => changePage(2)}
					aria-label="Next"
					class="mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-light-300"
				>
					<span aria-hidden="true">»</span>
				</a>
			</li>
		</ul>
	</nav>
{/if}

<style lang="postcss">
	.pagination {
		display: flex;
		justify-content: center;
	}
	.pagination ul {
		display: flex;
		padding-left: 0;
		list-style: none;
	}
	.pagination li a {
		position: relative;
		display: block;
		padding: 0.5rem 0.75rem;
		margin-left: -1px;
		line-height: 1.25;
		background-color: #fff;
		border: 1px solid #dee2e6;
	}
	.pagination li.active a {
		color: #fff;
		background-color: #007bff;
		border-color: #007bff;
	}
	.pagination li.disabled a {
		color: #6c757d;
		pointer-events: none;
		cursor: auto;
		border-color: #dee2e6;
	}
</style>
