<script lang="ts">
  import Pages from "./Pages.svelte";
  let apiUrl = `${import.meta.env.VITE_API_LINK}/api/getnotifications`;
  let renewData = false;
  let context  = 'notifications';
 </script>

<Pages {apiUrl} {renewData} {context}/>
