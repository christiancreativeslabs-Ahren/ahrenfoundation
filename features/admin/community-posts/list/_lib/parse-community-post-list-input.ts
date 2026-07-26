import type { CommunityPostListInput } from "@/lib/admin/community-posts";

export const DEFAULT_COMMUNITY_POST_LIST_PAGE_SIZE = 20;

export type RawCommunityPostListParams = Record<string, string | string[] | undefined>;

const STATUS_VALUES = ["all", "published", "hidden"] as const;
const DIRECTIONS = ["next", "last"] as const;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function parseCommunityPostListInput(
  params: RawCommunityPostListParams,
): CommunityPostListInput {
  const status = first(params.status);
  const direction = first(params.direction);

  return {
    page: parsePositiveInt(first(params.page), 1),
    limit: Math.min(
      100,
      parsePositiveInt(
        first(params.limit),
        DEFAULT_COMMUNITY_POST_LIST_PAGE_SIZE,
      ),
    ),
    cursor: first(params.cursor) || undefined,
    direction: DIRECTIONS.includes(direction as (typeof DIRECTIONS)[number])
      ? (direction as CommunityPostListInput["direction"])
      : "next",
    search: first(params.search)?.trim() || undefined,
    channel: first(params.channel)?.trim() || undefined,
    status: STATUS_VALUES.includes(status as (typeof STATUS_VALUES)[number])
      ? (status as CommunityPostListInput["status"])
      : "all",
  };
}
