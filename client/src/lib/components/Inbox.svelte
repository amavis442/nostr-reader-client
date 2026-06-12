<script lang="ts">
  // ABOUTME: Inbox feed wrapper — loads incoming messages from the API.
  // ABOUTME: Passes configuration to Pages as a data object.
  import Pages from "./Pages.svelte";
  let apiUrl = `${import.meta.env.VITE_API_LINK}/api/getinbox`;
  let renewData = false;
  let context  = 'inbox';
 </script>

<Pages data={{ apiUrl, renewData, context }} />
