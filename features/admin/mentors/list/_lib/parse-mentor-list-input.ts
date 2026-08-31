import type { MentorListInput } from "@/lib/admin/mentors";

export const DEFAULT_MENTOR_LIST_PAGE_SIZE = 20;

export type RawMentorListParams = Record<string, string | string[] | undefined>;

const STATUS_VALUES = ["all", "application_received", "approved", "verified_mentor"] as const;
const DIRECTIONS = ["next", "last"] as const;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function parseMentorListInput(params: RawMentorListParams): MentorListInput {
  const status = first(params.status);
  const direction = first(params.direction);

  return {
    page: parsePositiveInt(first(params.page), 1),
    limit: Math.min(
      100,
      parsePositiveInt(first(params.limit), DEFAULT_MENTOR_LIST_PAGE_SIZE),
    ),
    cursor: first(params.cursor) || undefined,
    direction: DIRECTIONS.includes(direction as (typeof DIRECTIONS)[number])
      ? (direction as MentorListInput["direction"])
      : "next",
    search: first(params.search)?.trim() || undefined,
    status: STATUS_VALUES.includes(status as (typeof STATUS_VALUES)[number])
      ? (status as MentorListInput["status"])
      : "all",
  };
}
