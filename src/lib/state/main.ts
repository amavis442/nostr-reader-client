import { writable, get } from 'svelte/store'
import type { Note, Page, Paginator } from '../../types'

export const pageData = writable([])

let apiUrl: string

export const paginator = writable<Paginator>({
	cursor: 0,
	previous_cursor: 0,
	next_cursor: 0,
	per_page: 30,
	total: 0,
	start_id: 0,
	end_id: 0,
	since: 0,
	context: "",
})

export const persistentPerPagePaginator = writable({
	cursor: 1,
	per_page: 30,
	total: 0,
	max_id: 0,
})

export function setApiUrl(url: string) {
	apiUrl = url
}

const elm: null | HTMLElement = document.getElementById('content')

export async function refreshView(page: Page) {
	let params = new URLSearchParams(page).toString()
	
	return await fetch(apiUrl + "?" + params, {
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

			let end_id = 0
			end_id = page.end_id

			if (page.renew || page.end_id == 0) {
				end_id = response.end_id
			}

			paginator.set({
				cursor: response.data.paging.cursor,
				previous_cursor: response.data.paging.previous_cursor,
				next_cursor: response.data.paging.next_cursor,
				start_id: response.data.paging.start_id,
				end_id: end_id,
				per_page: response.data.paging.per_page,
				total: response.data.paging.total,
				since: response.data.paging.since,
				context: page.context
			})
			pageData.set(response.data.events)
		})
		.then(() => {
			//const elm: null|HTMLElement = document.getElementById("content")
			if (elm) {
				elm.scrollTo(0, 0)
			}
		})
		.catch((err) => {
			console.error('error', err)
		})
}

export async function refresh() {
	fetch(`${import.meta.env.VITE_API_LINK}/api/sync`)
		.then((res) => {
			return res.json()
		})
		.then((response) => {
			console.log('Json is ', response)
			const paginatorData = get(paginator)
			refreshView({
				cursor: paginatorData.cursor,
				prev_cursor: paginatorData.previous_cursor,
				next_cursor: paginatorData.next_cursor,
				start_id: paginatorData.start_id,
				per_page: paginatorData.per_page,
				since: paginatorData.since,
				renew: true,
				end_id: 0,
				context: paginatorData.context
			})
			return response
		})
		.then(() => {
			//const elm: null|HTMLElement = document.getElementById("content")
			if (elm) {
				elm.scrollTo(0, 0)
			}
		})
		.catch((err) => {
			console.error('error', err)
		})
}

export function blockUser(pubkey: string) {
	fetch(`${import.meta.env.VITE_API_LINK}/api/blockuser`, {
		method: 'POST',
		body: JSON.stringify({ pubkey: pubkey }),
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((res) => {
			return res.json()
		})
		.then((response) => {
			const paginatorData = get(paginator)
			refreshView({
				cursor: paginatorData.cursor,
				prev_cursor: 0,
				next_cursor: 0,
				per_page: paginatorData.per_page,
				since: paginatorData.since,
				renew: false,
				start_id: paginatorData.start_id,
				end_id: paginatorData.end_id,
				context: paginatorData.context
			})
			return response
		})
		.catch((err) => {
			console.error('error', err)
		})
}

export function followUser(pubkey: string) {
	fetch(`${import.meta.env.VITE_API_LINK}/api/followuser`, {
		method: 'POST',
		body: JSON.stringify({ pubkey: pubkey }),
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((res) => {
			return res.json()
		})
		.then((response) => {
			const paginatorData = get(paginator)
			refreshView({
				cursor: paginatorData.cursor,
				prev_cursor: 0,
				next_cursor: 0,
				per_page: paginatorData.per_page,
				since: paginatorData.since,
				renew: false,
				start_id: paginatorData.start_id,
				end_id: paginatorData.end_id,
				context:  paginatorData.context
			})
			return response
		})
		.catch((err) => {
			console.error('error', err)
		})
}

export function unfollowUser(pubkey: string) {
	fetch(`${import.meta.env.VITE_API_LINK}/api/unfollowuser`, {
		method: 'POST',
		body: JSON.stringify({ pubkey: pubkey }),
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((res) => {
			return res.json()
		})
		.then((response) => {
			const paginatorData = get(paginator)
			refreshView({
				cursor: paginatorData.cursor,
				prev_cursor: 0,
				next_cursor: 0,
				per_page: paginatorData.per_page,
				since: paginatorData.since,
				renew: false,
				start_id: paginatorData.start_id,
				end_id: paginatorData.end_id,
				context: paginatorData.context
			})
			return response
		})
		.catch((err) => {
			console.error('error', err)
		})
}

export async function getNewNotesCount(context: string | null): Promise<number> {
	const paginatorData = get(paginator)
	const params = {
		cursor: paginatorData.cursor ?? 0,
		prev_cursor: 0,
		next_cursor: 0,
		per_page: paginatorData.per_page,
		since: paginatorData.since,
		renew: false,
		start_id: paginatorData.start_id,
		end_id: paginatorData.end_id,
		context: context ?? "follow"
		}

	const data = await fetch(`${import.meta.env.VITE_API_LINK}/api/getnewnotescount?` + new URLSearchParams(params).toString(), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((res) => {
			return res.json()
		})
		.then((response) => {
			console.log(response)
			return response.data
		})
		.catch((err) => {
			console.error('error', err)
		})

	return typeof data === 'object' ? 0 : Number(data)
}

export async function getLastSeenId(): Promise<number> {
	const data = await fetch(`${import.meta.env.VITE_API_LINK}/api/getlastseenid`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((res) => {
			return res.json()
		})
		.then((response) => {
			return response.data
		})
		.catch((err) => {
			console.error('error', err)
		})

	return typeof data === 'object' ? 0 : Number(data)
}

//Todo: needs same fix as sync note so only a portion of the view is updated and not the complete view.
export async function publish(msg: string, note: Note | null) {
	await fetch(`${import.meta.env.VITE_API_LINK}/api/publish`, {
		method: 'POST',
		body: JSON.stringify({ msg: msg, event_id: note ? note.event.id : '' }),
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((res) => {
			return res.json()
		})
		.then((response) => {
			console.debug('Json is ', response, ' and note is ', note)
			const paginatorData = get(paginator)
			if (response.status == 'ok' && note == null) {
				refreshView({
					cursor: paginatorData.cursor,
					prev_cursor: 0,
					next_cursor: 0,
					per_page: paginatorData.per_page,
					since: paginatorData.since,
					renew: true,
					start_id: paginatorData.start_id,
					end_id: paginatorData.end_id,
					context: paginatorData.context
				})
			}

			if (response.status == 'ok' && note != null) {
				console.debug('Refresh after publish: ', note.event.id)
				refreshView({
					cursor: paginatorData.cursor,
					prev_cursor: 0,
					next_cursor: 0,
					per_page: paginatorData.per_page,
					since: paginatorData.since,
					renew: false,
					start_id: paginatorData.start_id,
					end_id: paginatorData.end_id,
					context: paginatorData.context
				})
			}
			return response
		})
		.catch((err) => {
			console.error('error', err)
		})
}

export async function syncNote() {
	const paginatorData = get(paginator)
	const currentPageData = get(pageData)
	let ids: Array<string> = [];

	currentPageData.forEach((note) => {
		ids.push(note.event.id)
	})
	//JSON.stringify(ids)

	await refreshView({
		cursor: paginatorData.cursor,
		prev_cursor: 0,
		next_cursor: 0,
		per_page: paginatorData.per_page,
		since: paginatorData.since,
		renew: false,
		start_id: paginatorData.start_id,
		end_id: paginatorData.end_id,
		context: "page.refresh",
		ids: ids,
		total: paginatorData.total
	})
}

export async function tranlateContent(text: string) {
	const translateUrl = import.meta.env.VITE_APP_TRANSLATE_URL
	if (translateUrl == '') {
		return 'Translate url not set'
	}
	return await fetch(import.meta.env.VITE_APP_TRANSLATE_URL, {
		method: 'POST',
		body: JSON.stringify({
			q: text,
			source: 'auto',
			target: import.meta.env.VITE_APP_TRANSLATE_LANG,
			format: 'text',
			api_key: ''
		}),
		headers: { 'Content-Type': 'application/json' }
	})
		.then((res) => {
			return res.json()
		})
		.then((response) => {
			return response.translatedText
		})
		.catch((err) => {
			console.error(err)
		})
}
