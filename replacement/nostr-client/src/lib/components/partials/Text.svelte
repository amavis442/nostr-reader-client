<script lang="ts">
    // ABOUTME: Single-line text input component with default styling.
    // ABOUTME: Supports bind:value from parent via $bindable.
    let {
        id = Math.random().toString().slice(2),
        placeholder = 'Placeholder',
        describedby = '',
        value = $bindable(''),
        class: cls = ''
    }: {
        id?: string,
        placeholder?: string,
        describedby?: string,
        value?: string,
        class?: string
    } = $props();
</script>
<input
        type="text"
        class="form-control block w-full px-3 py-1.5 text-base font-normal
        text-gray-700 bg-white bg-clip-padding border border-solid
        border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700
        focus:bg-white focus:border-blue-600 focus:outline-none {cls}"
        id='{id}'
        name='{id}'
        bind:value
        aria-describedby="{describedby}"
        placeholder="{placeholder}" />
