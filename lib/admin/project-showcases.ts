import { and, asc, desc, eq, ilike, lt, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { programMembers, projectShowcases, users } from "@/db/schema";

export type ProjectShowcaseListDirection = "next" | "last";

export type ProjectShowcaseListInput = {
  page: number;
  limit: number;
  cursor?: string;
  direction: ProjectShowcaseListDirection;
  search?: string;
  status?: "all" | "draft" | "submitted" | "published" | "hidden";
};

export type ProjectShowcaseListRow = {
  projectId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  title: string;
  summary: string;
  projectUrl: string | null;
  status: string;
  userId: string | null;
  memberId: string | null;
  authorName: string | null;
  authorEmail: string | null;
  memberName: string | null;
  memberEmail: string | null;
};

export type ProjectShowcaseListResponse = {
  items: ProjectShowcaseListRow[];
  totalCount: number;
  hasMore: boolean;
  nextCursor: string | null;
  page: number;
  limit: number;
  summary: {
    total: number;
    draft: number;
    submitted: number;
    published: number;
    hidden: number;
    withMember: number;
    withoutMember: number;
  };
};

function normalizeCursor(cursor?: string) {
  if (!cursor) return null;
  const [createdAt, projectId] = cursor.split("|");
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime()) || !projectId) return null;
  return { createdAt: date, projectId };
}

function encodeCursor(row: ProjectShowcaseListRow) {
  return `${new Date(row.createdAt).toISOString()}|${row.projectId}`;
}

export async function getProjectShowcaseListData(
  input: ProjectShowcaseListInput,
): Promise<ProjectShowcaseListResponse> {
  const cursor = normalizeCursor(input.cursor);
  const search = input.search?.trim();

  const filters = [
    input.status && input.status !== "all"
      ? eq(projectShowcases.status, input.status)
      : undefined,
    search
      ? or(
          ilike(projectShowcases.title, `%${search}%`),
          ilike(projectShowcases.summary, `%${search}%`),
          ilike(users.name, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(programMembers.fullName, `%${search}%`),
          ilike(programMembers.email, `%${search}%`),
        )
      : undefined,
    cursor
      ? or(
          lt(projectShowcases.createdAt, cursor.createdAt),
          and(
            eq(projectShowcases.createdAt, cursor.createdAt),
            lt(projectShowcases.id, cursor.projectId),
          ),
        )
      : undefined,
  ].filter(Boolean);

  const whereClause = filters.length ? and(...filters) : undefined;

  const [summaryRow] = await db
    .select({
      total: sql<number>`coalesce(count(*), 0)`,
      draft: sql<number>`coalesce(sum(case when ${projectShowcases.status} = 'draft' then 1 else 0 end), 0)`,
      submitted: sql<number>`coalesce(sum(case when ${projectShowcases.status} = 'submitted' then 1 else 0 end), 0)`,
      published: sql<number>`coalesce(sum(case when ${projectShowcases.status} = 'published' then 1 else 0 end), 0)`,
      hidden: sql<number>`coalesce(sum(case when ${projectShowcases.status} = 'hidden' then 1 else 0 end), 0)`,
      withMember: sql<number>`coalesce(sum(case when ${projectShowcases.programMemberId} is not null then 1 else 0 end), 0)`,
      withoutMember: sql<number>`coalesce(sum(case when ${projectShowcases.programMemberId} is null then 1 else 0 end), 0)`,
    })
    .from(projectShowcases)
    .leftJoin(users, eq(users.id, projectShowcases.userId))
    .leftJoin(programMembers, eq(programMembers.id, projectShowcases.programMemberId))
    .where(whereClause);

  const totalCount = Number(summaryRow?.total ?? 0);

  const baseQuery = db
    .select({
      projectId: projectShowcases.id,
      createdAt: projectShowcases.createdAt,
      updatedAt: projectShowcases.updatedAt,
      title: projectShowcases.title,
      summary: projectShowcases.summary,
      projectUrl: projectShowcases.projectUrl,
      status: projectShowcases.status,
      userId: projectShowcases.userId,
      memberId: projectShowcases.programMemberId,
      authorName: users.name,
      authorEmail: users.email,
      memberName: programMembers.fullName,
      memberEmail: programMembers.email,
    })
    .from(projectShowcases)
    .leftJoin(users, eq(users.id, projectShowcases.userId))
    .leftJoin(programMembers, eq(programMembers.id, projectShowcases.programMemberId))
    .where(whereClause);

  const rows =
    input.direction === "last" && !cursor
      ? await baseQuery
          .orderBy(asc(projectShowcases.createdAt), asc(projectShowcases.id))
          .offset(Math.max(0, totalCount - input.limit))
          .limit(input.limit)
      : await baseQuery
          .orderBy(desc(projectShowcases.createdAt), desc(projectShowcases.id))
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
      draft: Number(summaryRow?.draft ?? 0),
      submitted: Number(summaryRow?.submitted ?? 0),
      published: Number(summaryRow?.published ?? 0),
      hidden: Number(summaryRow?.hidden ?? 0),
      withMember: Number(summaryRow?.withMember ?? 0),
      withoutMember: Number(summaryRow?.withoutMember ?? 0),
    },
  };
}
