import { writable } from 'svelte/store'
import type { Paginator } from '../../types'

export const pageData = writable([])

export const paginator = writable<Paginator>({
	cursor: 0,
	previous_cursor: 0,
	next_cursor: 0,
	per_page: 30,
	since: 0,
	context: "",
})

export const persistentPerPagePaginator = writable({
	cursor: 1,
	per_page: 30,
	total: 0,
	max_id: 0,
})