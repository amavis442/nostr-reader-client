<script lang="ts">
  // ABOUTME: Modal showing a user profile with follow/unfollow actions.
  // ABOUTME: Receives note and followed state as props; calls onFollowUser/onUnfollowUser callbacks.
  import { onMount } from "svelte";
  import Button from "../Button.svelte";

  let {
    isOpen = false,
    close,
    note = {},
    followed = false,
    onUnfollowUser,
    onFollowUser
  } = $props();

  let user = $state<Record<string, any>>({});

  function follow() {
    onFollowUser();
    close();
  }
  function unfollow() {
    onUnfollowUser();
    close();
  }
  onMount(() => {
    user["name"] = note.pubkey;
    user["picture"] = "profile-placeholder.png";
    user["about"] = "";
    if (note.user && note.user.name) {
      user = note.user;
    }
  });
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <div class="flex justify-left w-full">
        <div class="flex w-16">
          <img
            class="w-16 h-16 rounded-full"
            src={user && user.picture
              ? user.picture
              : "profile-placeholder.png"}
            alt={note.pubkey.slice(0, 5)}
            crossorigin="anonymous"
          />
        </div>
        <div class="w-full pl-6 pb-6">
          <h5 class="text-gray-900 text-xl font-medium mb-2">
            {user && user.name
              ? user.name.slice(0, 20)
              : note.pubkey.slice(0, 10)}
          </h5>
          <p class="text-gray-700 text-base mb-4">
            {user.about}
          </p>
        </div>
      </div>

      <div class="flex w-full space-x-1 p-2">
        <div class="justify-items-start w-6/12">
          {#if !followed}
            <Button click={follow}>Follow</Button>
          {:else}
            <Button click={unfollow}>unFollow</Button>
          {/if}
        </div>
        <div class="w-6/12 flex justify-end">
          <Button click={close}>OK</Button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  .modal {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;

    /* allow click-through to backdrop */
    pointer-events: none;
  }

  .contents {
    min-width: 440px;
    border-radius: 6px;
    padding: 16px;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: auto;
  }
</style>
