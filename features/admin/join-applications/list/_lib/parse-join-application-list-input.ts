import type { JoinApplicationListInput } from "@/lib/admin/join-applications";

export const DEFAULT_JOIN_APPLICATION_LIST_PAGE_SIZE = 20;

export type RawJoinApplicationListParams = Record<
  string,
  string | string[] | undefined
>;

const APPLICATION_TYPES = ["all", "youth", "mentor"] as const;
const STATUS_VALUES = ["pending", "reviewing", "approved", "rejected"] as const;
const DIRECTIONS = ["next", "last"] as const;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function parseJoinApplicationListInput(
  params: RawJoinApplicationListParams,
): JoinApplicationListInput {
  const applicationType = first(params.applicationType);
  const status = first(params.status);
  const direction = first(params.direction);

  return {
    page: parsePositiveInt(first(params.page), 1),
    limit: Math.min(
      100,
      parsePositiveInt(
        first(params.limit),
        DEFAULT_JOIN_APPLICATION_LIST_PAGE_SIZE,
      ),
    ),
    cursor: first(params.cursor) || undefined,
    direction: DIRECTIONS.includes(direction as (typeof DIRECTIONS)[number])
      ? (direction as JoinApplicationListInput["direction"])
      : "next",
    search: first(params.search)?.trim() || undefined,
    applicationType: APPLICATION_TYPES.includes(
      applicationType as (typeof APPLICATION_TYPES)[number],
    )
      ? (applicationType as JoinApplicationListInput["applicationType"])
      : "all",
    status: STATUS_VALUES.includes(status as (typeof STATUS_VALUES)[number])
      ? (status as JoinApplicationListInput["status"])
      : undefined,
  };
}
