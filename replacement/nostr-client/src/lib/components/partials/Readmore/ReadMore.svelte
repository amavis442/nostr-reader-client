<script lang="ts">
	/**
	 * https://github.com/saideepesh000/svelte-read-more mixed with https://www.npmjs.com/package/read-smore and 
     * some small fixes to make it work with svelte
	 */
	import {
		getMaxCharacters,
		getMaxWords,
		isFullText,
		getWordCount,
		getCharCount,
		trimSpaces
	} from './utils'
	// ABOUTME: Truncates long text to a word limit with an expandable read-more/read-less toggle.
	// ABOUTME: All derived display values are computed reactively from textContent and isOpen state.
	let {
		textContent,
		readMoreLabel = 'Read more',
		readLessLabel = 'Read less',
		//maxChars,
		maxWords,
		dotDotDot = '...'
	}: {
		textContent: string,
		readMoreLabel?: string,
		readLessLabel?: string,
		maxWords: number,
		dotDotDot?: string
	} = $props()

	let text: string | undefined
	let isOpen = $state(false)

	const ellipse = (str: string, max: number, isChars: boolean = false): string => {
		const trimmedSpaces = trimSpaces(str)

		if (isChars) {
			return trimmedSpaces.slice(0, max - 1)
		}

		const words = trimmedSpaces.split(/\s+/)
		return words.slice(0, max - 1).join(' ')
	}

	const originalContentCount = $derived(getWordCount(textContent))
	const truncateContent = $derived(ellipse(textContent, maxWords, false))

	const cleanText = $derived(textContent.replace(/\s+/g, ' ').trim())

	const finalLabel = $derived(isOpen ? readLessLabel : readMoreLabel)
	//const maxCharsText = $derived(getMaxCharacters(maxChars, isOpen, textContent, text))
	const finalText = $derived(isOpen ? cleanText : truncateContent) //getMaxWords(maxWords, isOpen, maxCharsText, text)
	const finalSymbol = $derived(isOpen ? '' : dotDotDot)
	const showButton = $derived(!isOpen && isFullText(finalText, cleanText) ? false : true)

	const handleClick = () => {
		isOpen = !isOpen
	}
</script>

<div data-testid="wrapper">
	{@html finalText}


	<span data-testid="button-wrapper" data-visible={`${showButton}`} class="button-wrapper">
		{!isOpen ? finalSymbol : ''}
        <br/>
		<button data-testid="button" onclick={handleClick} class="button">
			{finalLabel}
		</button>
	</span>
</div>

<style>
	/* custom styles */
	.button-wrapper {
		margin-top: 1em;
        display: block;
	}
	span[data-visible='false'] {
		visibility: hidden;
	}
	.button {
		border: 0;
		background-color: transparent;
		text-decoration: underline;
		cursor: pointer;
	}
	.button::first-letter {
		text-transform: uppercase;
	}
	.button:hover {
		text-decoration: none;
	}
</style>
