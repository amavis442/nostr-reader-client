import { get } from 'svelte/store'
import {paginator} from './paginator'
import { refreshView} from './page'

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
				context: paginatorData.context
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
				context: paginatorData.context
			})
			return response
		})
		.catch((err) => {
			console.error('error', err)
		})
}