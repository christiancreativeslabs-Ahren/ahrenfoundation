import type { CommunityPostListInput } from "@/lib/admin/community-posts";

export function serializeCommunityPostListQueryKey(input: CommunityPostListInput) {
  return JSON.stringify({
    page: input.page,
    limit: input.limit,
    cursor: input.cursor ?? null,
    direction: input.direction ?? "next",
    search: input.search ?? "",
    channel: input.channel ?? "",
    status: input.status ?? "all",
  });
}
