import type { JoinApplicationListInput } from "@/lib/admin/join-applications";

export function serializeJoinApplicationListQueryKey(
  input: JoinApplicationListInput,
) {
  return JSON.stringify({
    page: input.page,
    limit: input.limit,
    cursor: input.cursor ?? null,
    direction: input.direction ?? "next",
    search: input.search ?? "",
    applicationType: input.applicationType ?? "all",
    status: input.status ?? null,
  });
}
