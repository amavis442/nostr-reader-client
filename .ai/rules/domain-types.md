# Domain types

Defined in `src/lib/types.d.ts`. Import as: `import type { Note, Profile, NostrEvent } from '$lib/types'` (or from the relative path `'../../types'` inside `$lib`).

## Core types

### Note

The primary data structure. Represents a rendered Nostr note with context.

```ts
type Note = {
  bookmark: boolean;
  children: Note[] | null;   // nested reply tree
  content: string;
  event: NostrEvent;
  garbage: boolean;
  profile: Profile;
  refs: {
    event: NostrEvent[] | null;   // referenced events (quoted notes)
    profile: Profile[] | null;    // referenced profiles (mentions)
  };
  tree: number;              // nesting depth (0 = root)
};
```

### NostrEvent

Raw Nostr protocol event.

```ts
type NostrEvent = {
  id: string;
  content: string;
  pubkey: string;
  kind: number;
  tags: string[][];
  sig: string;
  created_at: number;        // Unix timestamp
};
```

### Profile

User profile data fetched from relays.

```ts
type Profile = {
  pubkey: string;
  name: string;
  about: string;
  picture: string;
  website: string;
  nip05: string;
  lud16: string;
  display_name: string;
  followed: boolean;
  created_at: Date | null | undefined;
  updated_at: Date | null | undefined;
};
```

### Page (pagination request)

```ts
type Page = {
  cursor: number;
  next_cursor: number;
  prev_cursor: number;
  per_page: number;
  since: number;
  renew: boolean;
  context?: string | null;
};
```

### Paginator (pagination state store)

```ts
interface Paginator {
  cursor: number;
  previous_cursor: number;
  next_cursor: number;
  per_page: number;
  since: number;
  context: string;
}
```

## Known type gaps

- `NostrEvent.kind` and `NostrNote.kind` are typed as `int` in the `.d.ts` — this is a bug (TypeScript has no `int`). In practice these are `number`. Use `as any` if TypeScript complains.
- `pageData` store is typed as `writable([])` without a generic → inferred as `never[]`. Accessing `note.event.id` on items causes `Property 'event' does not exist on type 'never'`. Pre-existing; use `as any` or add a type cast when iterating.
