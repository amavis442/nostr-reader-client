<script lang="ts">
  // ABOUTME: Bookmark feed wrapper — loads bookmarked notes from the API.
  // ABOUTME: Passes configuration to Pages as a data object.
  import Pages from "./Pages.svelte";
  let apiUrl = `${import.meta.env.VITE_API_LINK}/api/getbookmarked`;
  let renewData = false;
  let context = 'bookmark';
 </script>

<Pages data={{ apiUrl, renewData, context }} />
