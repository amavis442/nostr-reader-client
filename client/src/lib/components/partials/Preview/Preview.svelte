<script lang="ts">
  import { onMount } from "svelte";
  import Link from "../Link.svelte";
  import ImageLoader from '../Image/ImageLoader.svelte';

  // ABOUTME: Fetches and renders a link preview card with image, title, and description.
  // ABOUTME: Calls the endpoint API on mount to retrieve Open Graph metadata for the given url.
  let {
    url = '',
    endpoint
  }: {
    url?: string,
    endpoint: string
  } = $props()

  let preview = $state<{ images: any[]; description: any; mediaType: string; url: any; title: any; } | undefined>(undefined)

  onMount(async () => {
    const json = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ url: url }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data != undefined && data != null) {
          return data.data;
        } else {
          return null
        }
      })
      .catch((err) => {
        console.debug("error", err);
      });

    if (json) {
      preview = json;
    }
  });
</script>

{#if preview}
    <div
      class="rounded-2xl max-w-96 border border-solid border-divider bg-surface overflow-hidden"
    >
      <Link href={url}>
        {#if preview.images}
          <ImageLoader src={preview.images[0]} alt={preview.description}></ImageLoader>
          <div class="h-px bg-divider"></div>
        {/if}
        {#if preview.mediaType == "image"}
          <ImageLoader src={preview.url} alt={preview.url}/>
          <div class="h-px bg-divider"></div>
        {/if}

        {#if preview.title}
          <div class="px-4 py-2 text-[#e7e9ea] flex flex-col bg-surface">
            <strong class="whitespace-nowrap text-ellipsis overflow-hidden"
              >{preview.title}</strong
            >
            {#if preview.description}
              <small>{preview.description}</small>
            {/if}
          </div>
        {/if}
      </Link>
    </div>
{/if}
