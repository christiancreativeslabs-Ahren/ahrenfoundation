import type { MentorListInput } from "@/lib/admin/mentors";

export function serializeMentorListQueryKey(input: MentorListInput) {
  return JSON.stringify({
    page: input.page,
    limit: input.limit,
    cursor: input.cursor ?? null,
    direction: input.direction ?? "next",
    search: input.search ?? "",
    status: input.status ?? "all",
  });
}
