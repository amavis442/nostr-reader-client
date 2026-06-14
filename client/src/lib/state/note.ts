import type { Note } from "../types";

export async function getNewNotesCount(
  context: string | null,
): Promise<number> {
  const params = new URLSearchParams({ context: context ?? "follow" });
  const data = await fetch(
    `${import.meta.env.VITE_API_LINK}/api/getnewnotescount?${params}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  )
    .then((res) => res.json())
    .then((response) => response.data)
    .catch((err) => { console.error("getNewNotesCount error", err); });

  return typeof data === "object" ? 0 : Number(data);
}

export async function markCaughtUp(context: string): Promise<void> {
  const params = new URLSearchParams({ context });
  await fetch(
    `${import.meta.env.VITE_API_LINK}/api/notes/caught-up?${params}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
  ).catch((err) => { console.error("markCaughtUp error", err); });
}

//Todo: needs same fix as sync note so only a portion of the view is updated and not the complete view.
export async function publish(msg: string, note: Note | null) {
  return fetch(`${import.meta.env.VITE_API_LINK}/api/publish`, {
    method: "POST",
    body: JSON.stringify({ msg: msg, event_id: note ? note.event.id : "" }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    });
}
