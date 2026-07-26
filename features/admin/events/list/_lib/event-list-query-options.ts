import type { EventListInput } from "@/lib/admin/events";

export function serializeEventListQueryKey(input: EventListInput) {
  return JSON.stringify({
    page: input.page,
    limit: input.limit,
    cursor: input.cursor ?? null,
    direction: input.direction ?? "next",
    search: input.search ?? "",
    audience: input.audience ?? "all",
    status: input.status ?? "all",
  });
}
