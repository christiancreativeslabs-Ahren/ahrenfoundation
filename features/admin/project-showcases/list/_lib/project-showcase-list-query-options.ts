import type { ProjectShowcaseListInput } from "@/lib/admin/project-showcases";

export function serializeProjectShowcaseListQueryKey(input: ProjectShowcaseListInput) {
  return JSON.stringify({
    page: input.page,
    limit: input.limit,
    cursor: input.cursor ?? null,
    direction: input.direction ?? "next",
    search: input.search ?? "",
    status: input.status ?? "all",
  });
}
