import type { Page } from "../types";

export function getSearchParams(page: Page): string {
  const searchParams = new URLSearchParams();

  if (!!page.cursor) {
    searchParams.append("cursor", page.cursor.toString());
  }
  if (!!page.context) {
    searchParams.append("context", page.context);
  }
  if (page.direction) {
    searchParams.append("direction", page.direction);
  }
  if (!!page.per_page) {
    searchParams.append("per_page", page.per_page.toString());
  }
  if (!!page.since) {
    searchParams.append("since", page.since.toString());
  }
  if (!!page.renew) {
    searchParams.append("renew", page.renew.toString());
  }

  let params = searchParams.toString();

  return params;
}
