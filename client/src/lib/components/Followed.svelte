<script lang="ts">
  // ABOUTME: Followed users feed wrapper — loads notes from followed users.
  // ABOUTME: Passes configuration to Pages as a data object.
  import Pages from "./Pages.svelte";
  let apiUrl = `${import.meta.env.VITE_API_LINK}/api/getnotes`;
  let renewData = false;
  let context  = 'follow';
 </script>

<Pages data={{ apiUrl, renewData, context }} />
