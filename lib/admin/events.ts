import { and, asc, desc, eq, ilike, lt, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { communityEvents } from "@/db/schema";

export type EventListDirection = "next" | "last";

export type EventListInput = {
  page: number;
  limit: number;
  cursor?: string;
  direction: EventListDirection;
  search?: string;
  audience?: "all" | "youth" | "mentor";
  status?: "all" | "published" | "draft";
};

export type EventListRow = {
  eventId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  audience: string;
  title: string;
  summary: string | null;
  startsAt: Date | string;
  location: string | null;
  meetingUrl: string | null;
  status: string;
};

export type EventListResponse = {
  items: EventListRow[];
  totalCount: number;
  hasMore: boolean;
  nextCursor: string | null;
  page: number;
  limit: number;
  summary: {
    total: number;
    published: number;
    draft: number;
    all: number;
    youth: number;
    mentor: number;
  };
};

function normalizeCursor(cursor?: string) {
  if (!cursor) return null;
  const [startsAt, eventId] = cursor.split("|");
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime()) || !eventId) return null;
  return { startsAt: date, eventId };
}

function encodeCursor(row: EventListRow) {
  return `${new Date(row.startsAt).toISOString()}|${row.eventId}`;
}

export async function getEventListData(
  input: EventListInput,
): Promise<EventListResponse> {
  const cursor = normalizeCursor(input.cursor);
  const search = input.search?.trim();

  const filters = [
    input.audience && input.audience !== "all"
      ? eq(communityEvents.audience, input.audience)
      : undefined,
    input.status && input.status !== "all"
      ? eq(communityEvents.status, input.status)
      : undefined,
    search
      ? or(
          ilike(communityEvents.title, `%${search}%`),
          ilike(communityEvents.summary, `%${search}%`),
          ilike(communityEvents.location, `%${search}%`),
          ilike(communityEvents.audience, `%${search}%`),
          ilike(communityEvents.status, `%${search}%`),
        )
      : undefined,
    cursor
      ? or(
          lt(communityEvents.startsAt, cursor.startsAt),
          and(
            eq(communityEvents.startsAt, cursor.startsAt),
            lt(communityEvents.id, cursor.eventId),
          ),
        )
      : undefined,
  ].filter(Boolean);

  const whereClause = filters.length ? and(...filters) : undefined;

  const [summaryRow] = await db
    .select({
      total: sql<number>`coalesce(count(*), 0)`,
      published: sql<number>`coalesce(sum(case when ${communityEvents.status} = 'published' then 1 else 0 end), 0)`,
      draft: sql<number>`coalesce(sum(case when ${communityEvents.status} = 'draft' then 1 else 0 end), 0)`,
      all: sql<number>`coalesce(sum(case when ${communityEvents.audience} = 'all' then 1 else 0 end), 0)`,
      youth: sql<number>`coalesce(sum(case when ${communityEvents.audience} = 'youth' then 1 else 0 end), 0)`,
      mentor: sql<number>`coalesce(sum(case when ${communityEvents.audience} = 'mentor' then 1 else 0 end), 0)`,
    })
    .from(communityEvents)
    .where(whereClause);

  const totalCount = Number(summaryRow?.total ?? 0);

  const baseQuery = db
    .select({
      eventId: communityEvents.id,
      createdAt: communityEvents.createdAt,
      updatedAt: communityEvents.updatedAt,
      audience: communityEvents.audience,
      title: communityEvents.title,
      summary: communityEvents.summary,
      startsAt: communityEvents.startsAt,
      location: communityEvents.location,
      meetingUrl: communityEvents.meetingUrl,
      status: communityEvents.status,
    })
    .from(communityEvents)
    .where(whereClause);

  const rows =
    input.direction === "last" && !cursor
      ? await baseQuery
          .orderBy(asc(communityEvents.startsAt), asc(communityEvents.id))
          .offset(Math.max(0, totalCount - input.limit))
          .limit(input.limit)
      : await baseQuery
          .orderBy(desc(communityEvents.startsAt), desc(communityEvents.id))
          .limit(input.limit + 1);

  const hasMore =
    input.direction === "last" && !cursor ? false : rows.length > input.limit;
  const items =
    input.direction === "last" && !cursor
      ? rows
      : hasMore
        ? rows.slice(0, -1)
        : rows;
  const nextCursor = hasMore ? encodeCursor(items.at(-1)!) : null;

  return {
    items,
    totalCount,
    hasMore,
    nextCursor,
    page: input.page,
    limit: input.limit,
    summary: {
      total: Number(summaryRow?.total ?? 0),
      published: Number(summaryRow?.published ?? 0),
      draft: Number(summaryRow?.draft ?? 0),
      all: Number(summaryRow?.all ?? 0),
      youth: Number(summaryRow?.youth ?? 0),
      mentor: Number(summaryRow?.mentor ?? 0),
    },
  };
}
