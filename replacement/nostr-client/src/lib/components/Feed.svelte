<script lang="ts">
  // ABOUTME: Global feed wrapper — loads the main note feed from the API.
  // ABOUTME: Passes configuration to Pages as a data object.
  import Pages from "./Pages.svelte";
  let apiUrl = `${import.meta.env.VITE_API_LINK}/api/getnotes`;
  let renewData = false;
  let context = 'global';
 </script>

<Pages data={{ apiUrl, renewData, context }} />
