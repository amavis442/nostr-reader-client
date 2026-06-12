<script lang="ts">
    // ABOUTME: Anchor link component that opens in a new tab.
    // ABOUTME: Accepts href and optional class override via props.
    import type { Snippet } from 'svelte';

    let {
        href,
        class: cls = '',
        children
    }: {
        href: string,
        class?: string,
        children?: Snippet
    } = $props();
</script>

<a
  href={href}
  class="text-blue-600 visited:text-purple-600 {cls}"
  target="_blank"
  rel="noreferrer">
  {@render children?.()}
</a>
