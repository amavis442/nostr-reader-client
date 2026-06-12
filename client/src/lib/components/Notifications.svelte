<script lang="ts">
  // ABOUTME: Notifications feed wrapper — loads notification events from the API.
  // ABOUTME: Passes configuration to Pages as a data object.
  import Pages from "./Pages.svelte";
  let apiUrl = `${import.meta.env.VITE_API_LINK}/api/getnotifications`;
  let renewData = false;
  let context  = 'notifications';
 </script>

<Pages data={{ apiUrl, renewData, context }} />
