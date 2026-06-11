import { get, writable } from "svelte/store";
import type { Note, Page } from "../types";
import { paginator } from "./paginator";
import { getSearchParams } from "./searchparams";

let apiUrl: string;

function scrollContentToTop() {
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }
}

export const pageData = writable<Note[]>([]);

export function setApiUrl(url: string) {
  apiUrl = url;
}

export async function refreshView(page: Page): Promise<void | number> {
  let params = getSearchParams(page);

  return fetch(apiUrl + "?" + params, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((response) => {
      console.log("Json is ", response);
      if (response.status != "empty") {
        let paging = response.data.paging;
        paginator.set({
          cursor: paging.cursor,
          previous_cursor: paging.previous_cursor,
          next_cursor: paging.next_cursor,
          per_page: paging.per_page,
          since: paging.since,
          context: page.context ?? '',
        });
        pageData.set(response.data.events);
        console.debug(paginator);
        return 1;
      } else {
        return 3;
      }
    })
    .then((resultCode) => {
      if (resultCode == 1) {
        scrollContentToTop();
      }

      console.debug("Resultcode is ", resultCode);
      return resultCode;
    })
    .catch((err) => {
      console.error("error", err);
    });
}

export async function refresh() {
  fetch(`${import.meta.env.VITE_API_LINK}/api/sync`)
    .then((res) => {
      return res.json();
    })
    .then((response) => {
      console.log("Json is ", response);
      const paginatorData = get(paginator);
      refreshView({
        cursor: paginatorData.cursor,
        prev_cursor: paginatorData.previous_cursor,
        next_cursor: paginatorData.next_cursor,
        per_page: paginatorData.per_page,
        since: paginatorData.since,
        renew: true,
        context: paginatorData.context,
      });
      return response;
    })
    .then(() => {
      scrollContentToTop();
    })
    .catch((err) => {
      console.error("error", err);
    });
}

export async function syncPage(): Promise<void | number> {
  const paginatorData = get(paginator);

  return refreshView({
    cursor: paginatorData.cursor,
    prev_cursor: 0,
    next_cursor: 0,
    per_page: paginatorData.per_page,
    since: paginatorData.since,
    renew: false,
    context: "refresh",
  });
}
