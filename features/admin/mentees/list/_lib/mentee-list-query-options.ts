import type { MenteeListInput } from "@/lib/admin/mentees";

export function serializeMenteeListQueryKey(input: MenteeListInput) {
  return JSON.stringify({
    page: input.page,
    limit: input.limit,
    cursor: input.cursor ?? null,
    direction: input.direction ?? "next",
    search: input.search ?? "",
    status: input.status ?? "all",
  });
}
