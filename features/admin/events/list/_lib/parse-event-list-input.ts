import type { EventListInput } from "@/lib/admin/events";

export const DEFAULT_EVENT_LIST_PAGE_SIZE = 20;

export type RawEventListParams = Record<string, string | string[] | undefined>;

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

export function parseEventListInput(params: RawEventListParams): EventListInput {
  const audience = first(params.audience);
  const status = first(params.status);
  const direction = first(params.direction);

  return {
    page: parsePositiveInt(first(params.page), 1),
    limit: Math.min(
      100,
      parsePositiveInt(first(params.limit), DEFAULT_EVENT_LIST_PAGE_SIZE),
    ),
    cursor: first(params.cursor) || undefined,
    direction: DIRECTIONS.includes(direction as (typeof DIRECTIONS)[number])
      ? (direction as EventListInput["direction"])
      : "next",
    search: first(params.search)?.trim() || undefined,
    audience: AUDIENCE_VALUES.includes(audience as (typeof AUDIENCE_VALUES)[number])
      ? (audience as EventListInput["audience"])
      : "all",
    status: STATUS_VALUES.includes(status as (typeof STATUS_VALUES)[number])
      ? (status as EventListInput["status"])
      : "all",
  };
}
