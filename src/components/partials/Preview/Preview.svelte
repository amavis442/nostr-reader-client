<script lang="ts">
  import { onMount } from "svelte";
  import Link from "../Link.svelte";
  import ImageLoader from '../Image/ImageLoader.svelte';

  export let url: string = "";
  export let endpoint: string;
  let preview: { images: any[]; description: any; mediaType: string; url: any; title: any; };

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
      class="rounded-2xl max-w-96 border border-solid border-medium bg-white overflow-hidden"
    >
      <Link href={url}>
        {#if preview.images}
          <ImageLoader src={preview.images[0]} alt={preview.description}></ImageLoader>
          <div class="h-px bg-medium" />
        {/if}
        {#if preview.mediaType == "image"}
          <ImageLoader src={preview.url} alt={preview.url}/>
          <div class="h-px bg-medium" />
        {/if}

        {#if preview.title}
          <div class="px-4 py-2 text-black flex flex-col bg-white">
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
