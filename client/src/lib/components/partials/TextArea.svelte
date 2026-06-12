<script lang="ts">
    // ABOUTME: Multi-line textarea with dark-theme styling for the Nostr client.
    // ABOUTME: Supports bind:textContent from parent via $bindable and spreads rest props onto the element.
    let {
        id = Math.random().toString().slice(2),
        placeholder = 'Placeholder',
        describedby = '',
        textContent = $bindable(''),
        ...rest
    }: {
        id?: string,
        placeholder?: string,
        describedby?: string,
        textContent?: string,
        [key: string]: unknown
    } = $props();
</script>

<textarea
    class="w-full bg-transparent text-[#e7e9ea] placeholder-muted
           text-base leading-relaxed resize-none
           border-0 outline-none focus:outline-none focus:ring-0
           py-1"
    id="{id}"
    name="{id}"
    aria-describedby="{describedby}"
    placeholder="{placeholder}"
    {...rest}
    bind:value={textContent}
></textarea>
