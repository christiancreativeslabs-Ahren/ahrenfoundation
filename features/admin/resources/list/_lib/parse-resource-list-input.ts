import type { ResourceListInput } from "@/lib/admin/resources";

export const DEFAULT_RESOURCE_LIST_PAGE_SIZE = 20;

export type RawResourceListParams = Record<string, string | string[] | undefined>;

const AUDIENCE_VALUES = ["all", "youth", "mentor"] as const;
const VISIBILITY_VALUES = ["all", "published", "draft"] as const;
const DIRECTIONS = ["next", "last"] as const;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function parseResourceListInput(
  params: RawResourceListParams,
): ResourceListInput {
  const audience = first(params.audience);
  const visibility = first(params.visibility);
  const direction = first(params.direction);

  return {
    page: parsePositiveInt(first(params.page), 1),
    limit: Math.min(
      100,
      parsePositiveInt(first(params.limit), DEFAULT_RESOURCE_LIST_PAGE_SIZE),
    ),
    cursor: first(params.cursor) || undefined,
    direction: DIRECTIONS.includes(direction as (typeof DIRECTIONS)[number])
      ? (direction as ResourceListInput["direction"])
      : "next",
    search: first(params.search)?.trim() || undefined,
    audience: AUDIENCE_VALUES.includes(audience as (typeof AUDIENCE_VALUES)[number])
      ? (audience as ResourceListInput["audience"])
      : "all",
    visibility: VISIBILITY_VALUES.includes(
      visibility as (typeof VISIBILITY_VALUES)[number],
    )
      ? (visibility as ResourceListInput["visibility"])
      : "all",
    category: first(params.category)?.trim() || undefined,
  };
}
