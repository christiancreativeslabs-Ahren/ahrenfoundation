import { and, asc, desc, eq, ilike, lt, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { opportunities } from "@/db/schema";

export type OpportunityListDirection = "next" | "last";

export type OpportunityListInput = {
  page: number;
  limit: number;
  cursor?: string;
  direction: OpportunityListDirection;
  search?: string;
  audience?: "all" | "youth" | "mentor";
  status?: "all" | "published" | "draft";
  type?: string;
};

export type OpportunityListRow = {
  opportunityId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  audience: string;
  type: string;
  title: string;
  summary: string | null;
  url: string | null;
  status: string;
};

export type OpportunityListResponse = {
  items: OpportunityListRow[];
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
  const [createdAt, opportunityId] = cursor.split("|");
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime()) || !opportunityId) return null;
  return { createdAt: date, opportunityId };
}

function encodeCursor(row: OpportunityListRow) {
  return `${new Date(row.createdAt).toISOString()}|${row.opportunityId}`;
}

export async function getOpportunityListData(
  input: OpportunityListInput,
): Promise<OpportunityListResponse> {
  const cursor = normalizeCursor(input.cursor);
  const search = input.search?.trim();
  const type = input.type?.trim();

  const filters = [
    input.audience && input.audience !== "all"
      ? eq(opportunities.audience, input.audience)
      : undefined,
    input.status && input.status !== "all"
      ? eq(opportunities.status, input.status)
      : undefined,
    type ? ilike(opportunities.type, `%${type}%`) : undefined,
    search
      ? or(
          ilike(opportunities.title, `%${search}%`),
          ilike(opportunities.summary, `%${search}%`),
          ilike(opportunities.type, `%${search}%`),
          ilike(opportunities.audience, `%${search}%`),
          ilike(opportunities.status, `%${search}%`),
        )
      : undefined,
    cursor
      ? or(
          lt(opportunities.createdAt, cursor.createdAt),
          and(
            eq(opportunities.createdAt, cursor.createdAt),
            lt(opportunities.id, cursor.opportunityId),
          ),
        )
      : undefined,
  ].filter(Boolean);

  const whereClause = filters.length ? and(...filters) : undefined;

  const [summaryRow] = await db
    .select({
      total: sql<number>`coalesce(count(*), 0)`,
      published: sql<number>`coalesce(sum(case when ${opportunities.status} = 'published' then 1 else 0 end), 0)`,
      draft: sql<number>`coalesce(sum(case when ${opportunities.status} = 'draft' then 1 else 0 end), 0)`,
      all: sql<number>`coalesce(sum(case when ${opportunities.audience} = 'all' then 1 else 0 end), 0)`,
      youth: sql<number>`coalesce(sum(case when ${opportunities.audience} = 'youth' then 1 else 0 end), 0)`,
      mentor: sql<number>`coalesce(sum(case when ${opportunities.audience} = 'mentor' then 1 else 0 end), 0)`,
    })
    .from(opportunities)
    .where(whereClause);

  const totalCount = Number(summaryRow?.total ?? 0);

  const baseQuery = db
    .select({
      opportunityId: opportunities.id,
      createdAt: opportunities.createdAt,
      updatedAt: opportunities.updatedAt,
      audience: opportunities.audience,
      type: opportunities.type,
      title: opportunities.title,
      summary: opportunities.summary,
      url: opportunities.url,
      status: opportunities.status,
    })
    .from(opportunities)
    .where(whereClause);

  const rows =
    input.direction === "last" && !cursor
      ? await baseQuery
          .orderBy(asc(opportunities.createdAt), asc(opportunities.id))
          .offset(Math.max(0, totalCount - input.limit))
          .limit(input.limit)
      : await baseQuery
          .orderBy(desc(opportunities.createdAt), desc(opportunities.id))
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
