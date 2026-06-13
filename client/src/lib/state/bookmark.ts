import { get } from "svelte/store";
import type { Page } from "../types";
import { paginator } from "./paginator";
import { refreshView } from "./page";

export function addBookmark(eventID: string) {
  fetch(`${import.meta.env.VITE_API_LINK}/api/bookmark`, {
    method: "POST",
    body: JSON.stringify({ event_id: eventID }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log("Json is ", data);
      const paginatorData = get(paginator);
      const params: Page = {
        cursor: paginatorData.cursor,
        direction: null,
        per_page: paginatorData.per_page,
        since: paginatorData.since,
        context: "follow",
        renew: false,
      };
      refreshView(params);
      return data;
    })
    .catch((err) => {
      console.error("error", err);
    });
}

export function removeBookmark(eventID: string) {
  fetch(`${import.meta.env.VITE_API_LINK}/api/removebookmark`, {
    method: "POST",
    body: JSON.stringify({ event_id: eventID }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log("Json is ", data);
      const paginatorData = get(paginator);
      refreshView({
        cursor: paginatorData.cursor,
        direction: null,
        per_page: paginatorData.per_page,
        since: paginatorData.since,
        context: "bookmark",
        renew: false,
      });
      return data;
    })
    .catch((err) => {
      console.error("error", err);
    });
}
