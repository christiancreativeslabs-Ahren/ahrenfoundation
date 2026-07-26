import type { OpportunityListInput } from "@/lib/admin/opportunities";

export const DEFAULT_OPPORTUNITY_LIST_PAGE_SIZE = 20;

export type RawOpportunityListParams = Record<string, string | string[] | undefined>;

const AUDIENCE_VALUES = ["all", "youth", "mentor"] as const;
const STATUS_VALUES = ["all", "published", "draft"] as const;
const DIRECTIONS = ["next", "last"] as const;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function parseOpportunityListInput(
  params: RawOpportunityListParams,
): OpportunityListInput {
  const audience = first(params.audience);
  const status = first(params.status);
  const direction = first(params.direction);

  return {
    page: parsePositiveInt(first(params.page), 1),
    limit: Math.min(
      100,
      parsePositiveInt(
        first(params.limit),
        DEFAULT_OPPORTUNITY_LIST_PAGE_SIZE,
      ),
    ),
    cursor: first(params.cursor) || undefined,
    direction: DIRECTIONS.includes(direction as (typeof DIRECTIONS)[number])
      ? (direction as OpportunityListInput["direction"])
      : "next",
    search: first(params.search)?.trim() || undefined,
    audience: AUDIENCE_VALUES.includes(
      audience as (typeof AUDIENCE_VALUES)[number],
    )
      ? (audience as OpportunityListInput["audience"])
      : "all",
    status: STATUS_VALUES.includes(status as (typeof STATUS_VALUES)[number])
      ? (status as OpportunityListInput["status"])
      : "all",
    type: first(params.type)?.trim() || undefined,
  };
}
