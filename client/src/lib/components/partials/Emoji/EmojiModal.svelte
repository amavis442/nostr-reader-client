<script lang="ts">
  // ABOUTME: Emoji picker modal with category selector, search, variant popup and recent emoji tracking.
  // ABOUTME: Calls onAddEmoji callback with the selected emoji string on click.
  import emojiData from './data/emoji.js';
  import EmojiDetail from './EmojiDetail.svelte';
  import VariantPopup from './VariantPopup.svelte';

  let {
    onAddEmoji,
    close,
    maxRecents = 50,
    autoClose = true,
    isOpen
  }: {
    onAddEmoji: Function,
    close: () => void,
    maxRecents?: number,
    autoClose?: boolean,
    isOpen: boolean
  } = $props();

  // ── data ────────────────────────────────────────────────────────────────────

  const categoryOrder = [
    'Smileys & People',
    'Animals & Nature',
    'Food & Drink',
    'Activities',
    'Travel & Places',
    'Objects',
    'Symbols',
    'Flags'
  ];

  const categoryIcons: Record<string, string> = {
    'Smileys & People':  '😀',
    'Animals & Nature':  '🐱',
    'Food & Drink':      '☕',
    'Activities':        '⚽',
    'Travel & Places':   '🏡',
    'Objects':           '💡',
    'Symbols':           '🎵',
    'Flags':             '🚩'
  };

  const emojiCategories: Record<string, any[]> = {};
  emojiData.forEach((emoji: any) => {
    (emojiCategories[emoji.category] ??= []).push(emoji);
  });

  // ── state ───────────────────────────────────────────────────────────────────

  let searchText      = $state('');
  let selectedCat     = $state<string | null>('Smileys & People');
  let hoveredEmoji    = $state<any>(null);
  let variantsVisible = $state(false);
  let variants        = $state<any>(undefined);

  let recentEmojis = $state<any[]>(
    (() => {
      try {
        const s = localStorage.getItem('svelte-emoji-picker-recent');
        return s ? JSON.parse(s) : [];
      } catch { return []; }
    })()
  );

  let searchInput = $state<HTMLInputElement | undefined>(undefined);

  // ── derived ─────────────────────────────────────────────────────────────────

  const visibleEmojis = $derived.by(() => {
    if (searchText) {
      const q = searchText.toLowerCase();
      return emojiData.filter((e: any) => e.names?.some((n: string) => n.includes(q)));
    }
    if (selectedCat === null) return recentEmojis;
    return emojiCategories[selectedCat] ?? [];
  });

  // ── handlers ────────────────────────────────────────────────────────────────

  function selectCategory(cat: string | null) {
    selectedCat = cat;
    searchText  = '';
  }

  function onEmojiClick(emoji: any) {
    if (emoji.variants) {
      variants        = emoji.variants;
      variantsVisible = true;
    } else {
      addEmoji(emoji);
    }
  }

  function addEmoji(emoji: any) {
    saveRecent(emoji);
    onAddEmoji(emoji.emoji);
    if (autoClose) close();
  }

  function saveRecent(emoji: any) {
    recentEmojis = [emoji, ...recentEmojis.filter((r: any) => r.key !== emoji.key)].slice(0, maxRecents);
    try { localStorage.setItem('svelte-emoji-picker-recent', JSON.stringify(recentEmojis)); } catch {}
  }

  function hideVariants() {
    setTimeout(() => { variantsVisible = false; });
  }

  function onVariantClick(emoji: any) {
    addEmoji(emoji);
    hideVariants();
  }

  function clearSearch() {
    searchText = '';
    searchInput?.focus();
  }

  function handleSearchKey(e: KeyboardEvent) {
    if (e.key === 'Escape' && searchText) { clearSearch(); e.stopPropagation(); }
  }
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="picker">

      <!-- Header -->
      <div class="header">
        <span class="title">Emoji</span>
        <button type="button" class="close-btn" onclick={close} aria-label="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Search -->
      <div class="search-wrap">
        <input
          type="text"
          placeholder="Search emojis…"
          bind:value={searchText}
          bind:this={searchInput}
          onkeydown={handleSearchKey}
          class="search-input"
        />
        {#if searchText}
          <button type="button" class="search-clear" onclick={clearSearch} aria-label="Clear">✕</button>
        {:else}
          <span class="search-icon">🔍</span>
        {/if}
      </div>

      <!-- Category tab bar -->
      {#if !searchText}
        <div class="cat-bar" role="tablist">
          <!-- Recent -->
          <button
            type="button"
            role="tab"
            class="cat-btn {selectedCat === null ? 'cat-active' : ''}"
            title="Recently used"
            onclick={() => selectCategory(null)}
          >🕐</button>

          {#each categoryOrder as cat}
            <button
              type="button"
              role="tab"
              class="cat-btn {selectedCat === cat ? 'cat-active' : ''}"
              title={cat}
              onclick={() => selectCategory(cat)}
            >{categoryIcons[cat]}</button>
          {/each}
        </div>
      {/if}

      <!-- Emoji grid -->
      <div class="emoji-grid relative">
        {#if visibleEmojis.length > 0}
          {#each visibleEmojis as emoji (emoji.key ?? emoji.emoji)}
            <button
              type="button"
              class="emoji-btn"
              title={emoji.name}
              onmouseenter={() => hoveredEmoji = emoji}
              onmouseleave={() => hoveredEmoji = null}
              onclick={() => onEmojiClick(emoji)}
            >{emoji.emoji}</button>
          {/each}
        {:else}
          <div class="empty">
            <span>😦</span>
            <p>No emojis found</p>
          </div>
        {/if}

        {#if variantsVisible}
          <VariantPopup {variants} onemojiclick={onVariantClick} onclose={hideVariants} />
        {/if}
      </div>

      <!-- Hover detail -->
      <EmojiDetail emoji={hoveredEmoji} />

    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    z-index: 200;
  }

  .picker {
    --ep-bg:       #16181c;
    --ep-border:   #2f3336;
    --ep-text:     #e7e9ea;
    --ep-muted:    #71767b;
    --ep-hover:    rgba(255,255,255,0.08);
    --ep-selected: #1d9bf0;

    width: 340px;
    background: var(--ep-bg);
    border: 1px solid var(--ep-border);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    pointer-events: auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    overflow: hidden;
  }

  /* header */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--ep-border);
  }
  .title {
    color: var(--ep-text);
    font-weight: 600;
    font-size: 0.875rem;
  }
  .close-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--ep-muted);
    padding: 0.25rem;
    border-radius: 50%;
    line-height: 1;
    transition: color 100ms, background 100ms;
  }
  .close-btn:hover { color: var(--ep-text); background: var(--ep-hover); }

  /* search */
  .search-wrap {
    position: relative;
    padding: 0.5rem 0.5rem 0.25rem;
  }
  .search-input {
    width: 100%;
    background: rgba(255,255,255,0.07);
    border: 1px solid var(--ep-border);
    border-radius: 20px;
    color: var(--ep-text);
    padding: 0.35em 2em 0.35em 0.75em;
    font-size: 0.875em;
    outline: none;
    box-sizing: border-box;
  }
  .search-input::placeholder { color: var(--ep-muted); }
  .search-input:focus { border-color: var(--ep-selected); }
  .search-clear, .search-icon {
    position: absolute;
    right: 0.9em;
    top: 50%;
    transform: translateY(-25%);
    font-size: 0.75em;
    color: var(--ep-muted);
    background: transparent;
    border: none;
    cursor: pointer;
    line-height: 1;
  }
  .search-clear:hover { color: var(--ep-text); }

  /* category tab bar */
  .cat-bar {
    display: flex;
    overflow-x: auto;
    border-bottom: 1px solid var(--ep-border);
    padding: 0 0.25rem;
    scrollbar-width: none;
  }
  .cat-bar::-webkit-scrollbar { display: none; }

  .cat-btn {
    flex-shrink: 0;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 0.3em 0.4em;
    font-size: 1.15em;
    cursor: pointer;
    color: var(--ep-muted);
    transition: color 100ms, border-color 100ms;
    line-height: 1.4;
  }
  .cat-btn:hover { color: var(--ep-text); }
  .cat-active {
    border-bottom-color: var(--ep-selected) !important;
    color: var(--ep-text) !important;
  }

  /* emoji grid */
  .emoji-grid {
    height: 200px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    padding: 0.25rem;
    gap: 1px;
    scrollbar-width: thin;
    scrollbar-color: var(--ep-border) transparent;
  }

  .emoji-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.4em;
    width: 2em;
    height: 2em;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: background 100ms;
    flex-shrink: 0;
  }
  .emoji-btn:hover { background: var(--ep-hover); }

  .empty {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--ep-muted);
    gap: 0.5em;
  }
  .empty span { font-size: 2em; }
  .empty p { margin: 0; font-size: 0.875em; }
</style>
