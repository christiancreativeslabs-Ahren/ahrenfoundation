import type { ResourceListInput } from "@/lib/admin/resources";

export function serializeResourceListQueryKey(input: ResourceListInput) {
  return JSON.stringify({
    page: input.page,
    limit: input.limit,
    cursor: input.cursor ?? null,
    direction: input.direction ?? "next",
    search: input.search ?? "",
    audience: input.audience ?? "all",
    visibility: input.visibility ?? "all",
    category: input.category ?? "",
  });
}
