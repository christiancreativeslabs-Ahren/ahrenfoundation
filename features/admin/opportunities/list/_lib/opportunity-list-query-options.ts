import type { OpportunityListInput } from "@/lib/admin/opportunities";

export function serializeOpportunityListQueryKey(input: OpportunityListInput) {
  return JSON.stringify({
    page: input.page,
    limit: input.limit,
    cursor: input.cursor ?? null,
    direction: input.direction ?? "next",
    search: input.search ?? "",
    audience: input.audience ?? "all",
    status: input.status ?? "all",
    type: input.type ?? "",
  });
}
