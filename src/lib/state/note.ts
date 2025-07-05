import { get } from 'svelte/store'
import type { Page, Note } from '../../types'
import {paginator} from './paginator'
import {getSearchParams} from './searchparams'


export async function getNewNotesCount(context: string | null): Promise<number> {
	const paginatorData = get(paginator)
	const searchParams: Page = {
		cursor: paginatorData.cursor ?? 0,
		prev_cursor: 0,
		next_cursor: 0,
		per_page: paginatorData.per_page,
		since: paginatorData.since,
		renew: false,
		context: context ?? "follow"
	}
	let params = getSearchParams(searchParams)

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
	return fetch(`${import.meta.env.VITE_API_LINK}/api/publish`, {
		method: 'POST',
		body: JSON.stringify({ msg: msg, event_id: note ? note.event.id : '' }),
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then((res) => {
		return res.json()
	})
}