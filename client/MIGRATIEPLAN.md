# Migratieplan: Svelte 4 → Svelte 5 runes

## Terugkerende patronen (overal van toepassing)

| Svelte 4 | Svelte 5 | Opmerking |
|---|---|---|
| `export let foo = x` | `let { foo = x } = $props()` | Props declaratie |
| `$$props['class']` | `let { class: cls, ...rest } = $props()` | Rest props |
| `{...$$props}` | `{...rest}` na destructuring via `$props()` | |
| `$: val = expr` | `const val = $derived(expr)` | Afgeleide waarde |
| `$: { effect }` | `$effect(() => { effect })` | Bijwerking |
| `createEventDispatcher` + `dispatch('x', v)` | callback prop `onx`, aanroepen als `onx?.(v)` | |
| `on:click={h}` | `onclick={h}` | Native events |
| `on:submit\|preventDefault` | `onsubmit={(e) => { e.preventDefault(); h(e) }}` | Modifiers worden inline |
| `<slot />` | `{@render children?.()}` | Default slot |
| `<slot name="x" />` | `{@render x?.()}` | Named slot |
| `<slot {val}>` | `{@render children?.({ val })}` | Slot met prop |
| `let:val` bij parent | `{#snippet children({ val })}` | Slot prop ontvangst |
| `afterUpdate(fn)` | `$effect(fn)` | Lifecycle |

---

## Fase 1 — Leaf-componenten (geen child-componenten met events/slots)

**Bestanden:**
- `Button.svelte` — `export let`, `$$props['class']`, `on:click`
- `Link.svelte` — `export let`, `$$props['class']`, `<slot />`
- `Text.svelte` — `export let`, `$$props['class']`, `bind:value` (native, blijft)
- `TextArea.svelte` — `export let`, `{...$$props}`, `bind:value={textContent}` → prop moet `$bindable()`
- `Image.svelte` — `export let`, `bind:this` (blijft)
- `Toast.svelte` — `export let`, `createEventDispatcher`, `<slot />`, `on:click`
- `Emoji.svelte` — `export let`, `createEventDispatcher`, `on:` events

**Aandachtspunt `TextArea`:** omdat `bind:textContent` gebruikt wordt vanuit parent, moet de prop gedeclareerd worden als:
```ts
let { textContent = $bindable('') } = $props();
```

---

## Fase 2 — Emoji-subcomponenten

**Bestanden:**
- `EmojiDetail.svelte` — `export let`
- `EmojiList.svelte` — `export let`, event forwarding (`on:emojihover`, `on:emojiclick` zonder handler) → callback props doorgeven
- `EmojiSearch.svelte` — `export let searchText = $bindable('')` (want parent doet `bind:searchText`), `on:keydown`
- `EmojiSearchResults.svelte` — `export let`, `createEventDispatcher`, `$:` reactief, event forwarding
- `VariantPopup.svelte` — `export let`, `createEventDispatcher`, `on:` events

**Aandachtspunt event forwarding:** Svelte 5 heeft geen automatische event forwarding meer. `on:emojihover` zonder handler werd in Svelte 4 automatisch doorgestuurd. In Svelte 5 moet je de callback props expliciet doorgeven:
```svelte
<!-- Svelte 4 -->
<EmojiList on:emojihover on:emojiclick />

<!-- Svelte 5 -->
<EmojiList onemojihover={onemojihover} onemojiclick={onemojiclick} />
```

---

## Fase 3 — IntersectionObserver + ImageLoader

**Bestanden:**
- `IntersectionObserver.svelte` — `export let`, `<slot {intersecting}>`, `bind:this` (blijft)
- `ImageLoader.svelte` — gebruikt `let:intersecting` van IntersectionObserver → wordt snippet

```svelte
<!-- Svelte 4 (ImageLoader) -->
<IntersectionObserver once={true} let:intersecting>
  {#if intersecting}<Image ... />{/if}
</IntersectionObserver>

<!-- Svelte 5 -->
<IntersectionObserver once={true}>
  {#snippet children({ intersecting })}
    {#if intersecting}<Image ... />{/if}
  {/snippet}
</IntersectionObserver>
```

---

## Fase 4 — Modal-familie + Preview + ReadMore

**Bestanden:**
- `Modal.svelte` — `export let`, `$:` effect (dialog open/close), `on:`, `<slot name="header">`, `<slot />`
- `UserModal.svelte` — `export let` incl. callback props (`onUnfollowUser`, `onFollowUser`)
- `CreateNoteModal.svelte` — `export let`, `bind:textContent` → TextArea heeft al `$bindable` na fase 1
- `InfoModal.svelte` — `export let`
- `NoteInfoModal.svelte` — `export let`
- `ProfileInfoModal.svelte` — `export let`
- `Preview.svelte` — `export let`
- `ReadMore.svelte` — `export let`, meerdere `$:` → `$derived`

**Aandachtspunt `Modal`:** de `$:` statements voor `dialog.showModal()` worden `$effect`:
```ts
// Svelte 4
$: if (dialog && showModal) dialog.showModal();

// Svelte 5
$effect(() => {
  if (dialog && showModal) dialog.showModal();
  else if (!showModal && dialog) dialog.close();
});
```

---

## Fase 5 — Tabs-systeem

**Bestanden:**
- `Tabs.svelte` — `export let`, `createEventDispatcher`, `afterUpdate`, `$:` reactief, `on:`, `setContext`
- `Tab.svelte` — `getContext`, `bind:this` (blijft)
- `TabList.svelte` — `<slot />`
- `TabPanel.svelte` — `getContext`
- `index.js` — geen wijziging

**Aandachtspunt:** `afterUpdate` → `$effect`. `setContext`/`getContext` werkt ongewijzigd in Svelte 5.

---

## Fase 6 — EmojiModal

**Bestand:** `EmojiModal.svelte`
- `export let`, `createEventDispatcher`, `bind:searchText` (EmojiSearch heeft na fase 2 `$bindable`), event forwarding van Emoji-subcomponenten

---

## Fase 7 — NoteContent + Pagination

**Bestanden:**
- `NoteContent.svelte` — `export let`, `createEventDispatcher`, `on:click`, `on:keyup`
- `Pagination.svelte` — `createEventDispatcher`, `on:click`

---

## Fase 8 — TextNote

**Bestand:** `TextNote.svelte`
- Zwaarste component: `export let`, `$$props['class']`, `createEventDispatcher` (10+ events), `$:` reactief, `<svelte:self>`

**Aandachtspunt `<svelte:self>`:** blijft werken in Svelte 5, maar alle `on:event` die erbij staan moeten worden omgezet naar callback props:
```svelte
<!-- Svelte 4 -->
<svelte:self {note} on:followUser on:unfollowUser />

<!-- Svelte 5 -->
<svelte:self {note} onfollowUser={onfollowUser} onunfollowUser={onunfollowUser} />
```

---

## Fase 9 — Pages + Feed/Bookmark/Followed/Inbox/Notifications

**Bestanden:**
- `Pages.svelte` — alle events van TextNote ontvangen en doorsturen, `bind:textContent`, `<slot>`
- `Feeder.svelte` — `<slot />`
- `Feed.svelte`, `Bookmark.svelte`, `Followed.svelte`, `Inbox.svelte`, `Notifications.svelte` — relatief eenvoudig, geen props

---

## Fase 10 — Settings + SearchProfiles + Profiles

**Bestanden:**
- `Account.svelte` — `export let`, `bind:value` (native, blijft), `on:submit|preventDefault`
- `Relay.svelte` — zelfde patroon
- `Profiles.svelte` — zelfde patroon
- `SearchProfiles.svelte` — zelfde patroon

---

## Fase 11 — Routes

**Bestanden:**
- `routes/+page.svelte` — al gefixed met `$lib`; controleer of er extra layout-props zijn
- `routes/settings/+page.svelte` — controleren
- `routes/+layout.svelte` — controleren; `<slot />` → `{@render children()}`

---

## Wat géén wijziging nodig heeft

- `bind:value` / `bind:checked` op native `<input>` / `<select>` / `<textarea>` — werkt ongewijzigd
- `bind:this` op DOM-elementen — werkt ongewijzigd
- `onMount` — werkt ongewijzigd
- `getContext`/`setContext` — werkt ongewijzigd
- Svelte stores (`writable`, `$store` shorthand) — werkt ongewijzigd
- `src/lib/state/*.ts` bestanden — geen Svelte 5-specifieke patronen
