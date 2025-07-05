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
