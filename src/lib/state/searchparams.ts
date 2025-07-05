import type {  Page  } from '../../types'

export function getSearchParams(page: Page): string {
	const searchParams: Record<string, any> = new URLSearchParams()

	if (!!page.cursor) {
		searchParams.append('cursor', page.cursor.toString())
	}
	if (!!page.context) {
		searchParams.append('context', page.context)
	}
	if (!!page.next_cursor) {
		searchParams.append('next_cursor', page.next_cursor.toString())
	}
	if (!!page.prev_cursor) {
		searchParams.append('prev_cursor', page.prev_cursor.toString())
	}
	if (!!page.per_page) {
		searchParams.append('per_page', page.per_page.toString())
	}
	if (!!page.since) {
		searchParams.append('since', page.since.toString())
	}
	if (!!page.renew) {
		searchParams.append('renew', page.renew.toString())
	}

	let params = searchParams.toString()

	return params
}