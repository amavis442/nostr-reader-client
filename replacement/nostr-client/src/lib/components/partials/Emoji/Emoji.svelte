<script>
  // ABOUTME: Single emoji button that fires hover and click callback props.
  // ABOUTME: Replaces Svelte 4 event dispatcher with onemojiclick/onemojihover callback props.
  let {
    emoji,
    onemojiclick = undefined,
    onemojihover = undefined
  } = $props();

  function onClick() { onemojiclick?.(emoji); }
  function onMouseOver() { onemojihover?.(emoji); }
  function onMouseOut() { onemojihover?.(null); }
  function doNothing() {}
</script>

<button
  onmouseover={onMouseOver}
  onfocus={doNothing}
  onblur={doNothing}
  onmouseout={onMouseOut}
  onclick={onClick}
>{emoji.emoji}</button>

<style>
  button {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1.4em;
    width: 1.8em;
    height: 1.8em;
    padding: 0;
    margin: 0;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background 100ms;
  }

  button:hover {
    background: var(--ep-hover, rgba(255,255,255,0.08));
  }
</style>
