<script lang="ts">
    // ABOUTME: Reusable button component — renders a pill-shaped button with brand styling.
    // ABOUTME: Accepts type (button/submit/reset), click callback, class override, and children snippet.
    import type { Snippet } from 'svelte';

    const buttonTypes = { button: 'button', submit: 'submit', reset: 'reset' } as const

    let {
        type = buttonTypes.button,
        click = () => {},
        class: cls = '',
        children
    }: {
        type?: string,
        click?: () => void,
        class?: string,
        children?: Snippet
    } = $props();
</script>

{#if type == buttonTypes.button}
<button type="button" onclick={click} class="btn {cls}">
    {@render children?.()}
</button>
{/if}

{#if type == buttonTypes.reset}
<button type="reset" onclick={click} class="btn {cls}">
    {@render children?.()}
</button>
{/if}

{#if type == buttonTypes.submit}
<button type="submit" class="btn {cls}">
    {@render children?.()}
</button>
{/if}

<style lang="postcss">
    @reference "../../../app.css";

    .btn {
        @apply inline-flex items-center justify-center gap-1
               px-4 py-1.5 rounded-full
               bg-brand text-white font-bold text-sm
               hover:bg-brand-dark
               transition-colors duration-150
               focus:outline-none focus:ring-2 focus:ring-brand/40;
    }
</style>
