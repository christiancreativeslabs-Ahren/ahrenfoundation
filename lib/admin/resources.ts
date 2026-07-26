import { and, asc, desc, eq, ilike, lt, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { dashboardResources } from "@/db/schema";

export type ResourceListDirection = "next" | "last";

export type ResourceListInput = {
  page: number;
  limit: number;
  cursor?: string;
  direction: ResourceListDirection;
  search?: string;
  audience?: "all" | "youth" | "mentor";
  visibility?: "all" | "published" | "draft";
  category?: string;
};

export type ResourceListRow = {
  resourceId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  audience: string;
  category: string;
  title: string;
  summary: string | null;
  url: string | null;
  isPublished: boolean;
};

export type ResourceListResponse = {
  items: ResourceListRow[];
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
  const [createdAt, resourceId] = cursor.split("|");
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime()) || !resourceId) return null;
  return { createdAt: date, resourceId };
}

function encodeCursor(row: ResourceListRow) {
  return `${new Date(row.createdAt).toISOString()}|${row.resourceId}`;
}

export async function getResourceListData(
  input: ResourceListInput,
): Promise<ResourceListResponse> {
  const cursor = normalizeCursor(input.cursor);
  const search = input.search?.trim();
  const category = input.category?.trim();

  const filters = [
    input.audience && input.audience !== "all"
      ? eq(dashboardResources.audience, input.audience)
      : undefined,
    input.visibility && input.visibility !== "all"
      ? eq(dashboardResources.isPublished, input.visibility === "published")
      : undefined,
    category ? ilike(dashboardResources.category, `%${category}%`) : undefined,
    search
      ? or(
          ilike(dashboardResources.title, `%${search}%`),
          ilike(dashboardResources.summary, `%${search}%`),
          ilike(dashboardResources.category, `%${search}%`),
          ilike(dashboardResources.audience, `%${search}%`),
        )
      : undefined,
    cursor
      ? or(
          lt(dashboardResources.createdAt, cursor.createdAt),
          and(
            eq(dashboardResources.createdAt, cursor.createdAt),
            lt(dashboardResources.id, cursor.resourceId),
          ),
        )
      : undefined,
  ].filter(Boolean);

  const whereClause = filters.length ? and(...filters) : undefined;

  const [summaryRow] = await db
    .select({
      total: sql<number>`coalesce(count(*), 0)`,
      published: sql<number>`coalesce(sum(case when ${dashboardResources.isPublished} then 1 else 0 end), 0)`,
      draft: sql<number>`coalesce(sum(case when not ${dashboardResources.isPublished} then 1 else 0 end), 0)`,
      all: sql<number>`coalesce(sum(case when ${dashboardResources.audience} = 'all' then 1 else 0 end), 0)`,
      youth: sql<number>`coalesce(sum(case when ${dashboardResources.audience} = 'youth' then 1 else 0 end), 0)`,
      mentor: sql<number>`coalesce(sum(case when ${dashboardResources.audience} = 'mentor' then 1 else 0 end), 0)`,
    })
    .from(dashboardResources)
    .where(whereClause);

  const totalCount = Number(summaryRow?.total ?? 0);

  const baseQuery = db
    .select({
      resourceId: dashboardResources.id,
      createdAt: dashboardResources.createdAt,
      updatedAt: dashboardResources.updatedAt,
      audience: dashboardResources.audience,
      category: dashboardResources.category,
      title: dashboardResources.title,
      summary: dashboardResources.summary,
      url: dashboardResources.url,
      isPublished: dashboardResources.isPublished,
    })
    .from(dashboardResources)
    .where(whereClause);

  const rows =
    input.direction === "last" && !cursor
      ? await baseQuery
          .orderBy(
            asc(dashboardResources.createdAt),
            asc(dashboardResources.id),
          )
          .offset(Math.max(0, totalCount - input.limit))
          .limit(input.limit)
      : await baseQuery
          .orderBy(
            desc(dashboardResources.createdAt),
            desc(dashboardResources.id),
          )
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
