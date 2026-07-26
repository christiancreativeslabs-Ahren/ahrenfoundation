import { and, asc, desc, eq, ilike, lt, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { communityPosts, programMembers, users } from "@/db/schema";

export type CommunityPostListDirection = "next" | "last";

export type CommunityPostListInput = {
  page: number;
  limit: number;
  cursor?: string;
  direction: CommunityPostListDirection;
  search?: string;
  channel?: string;
  status?: "all" | "published" | "hidden";
};

export type CommunityPostListRow = {
  postId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  channel: string;
  body: string;
  status: string;
  userId: string | null;
  memberId: string | null;
  authorName: string | null;
  authorEmail: string | null;
  memberName: string | null;
  memberEmail: string | null;
};

export type CommunityPostListResponse = {
  items: CommunityPostListRow[];
  totalCount: number;
  hasMore: boolean;
  nextCursor: string | null;
  page: number;
  limit: number;
  summary: {
    total: number;
    published: number;
    hidden: number;
    verifiedMembers: number;
    withMember: number;
    withoutMember: number;
  };
};

function normalizeCursor(cursor?: string) {
  if (!cursor) return null;
  const [createdAt, postId] = cursor.split("|");
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime()) || !postId) return null;
  return { createdAt: date, postId };
}

function encodeCursor(row: CommunityPostListRow) {
  return `${new Date(row.createdAt).toISOString()}|${row.postId}`;
}

export async function getCommunityPostListData(
  input: CommunityPostListInput,
): Promise<CommunityPostListResponse> {
  const cursor = normalizeCursor(input.cursor);
  const search = input.search?.trim();
  const channel = input.channel?.trim();

  const filters = [
    input.status && input.status !== "all"
      ? eq(communityPosts.status, input.status)
      : undefined,
    channel ? ilike(communityPosts.channel, `%${channel}%`) : undefined,
    search
      ? or(
          ilike(communityPosts.body, `%${search}%`),
          ilike(communityPosts.channel, `%${search}%`),
          ilike(users.name, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(programMembers.fullName, `%${search}%`),
          ilike(programMembers.email, `%${search}%`),
        )
      : undefined,
    cursor
      ? or(
          lt(communityPosts.createdAt, cursor.createdAt),
          and(
            eq(communityPosts.createdAt, cursor.createdAt),
            lt(communityPosts.id, cursor.postId),
          ),
        )
      : undefined,
  ].filter(Boolean);

  const whereClause = filters.length ? and(...filters) : undefined;

  const [summaryRow] = await db
    .select({
      total: sql<number>`coalesce(count(*), 0)`,
      published: sql<number>`coalesce(sum(case when ${communityPosts.status} = 'published' then 1 else 0 end), 0)`,
      hidden: sql<number>`coalesce(sum(case when ${communityPosts.status} = 'hidden' then 1 else 0 end), 0)`,
      verifiedMembers: sql<number>`coalesce(sum(case when ${communityPosts.channel} = 'verified_members' then 1 else 0 end), 0)`,
      withMember: sql<number>`coalesce(sum(case when ${communityPosts.programMemberId} is not null then 1 else 0 end), 0)`,
      withoutMember: sql<number>`coalesce(sum(case when ${communityPosts.programMemberId} is null then 1 else 0 end), 0)`,
    })
    .from(communityPosts)
    .leftJoin(users, eq(users.id, communityPosts.userId))
    .leftJoin(programMembers, eq(programMembers.id, communityPosts.programMemberId))
    .where(whereClause);

  const totalCount = Number(summaryRow?.total ?? 0);

  const baseQuery = db
    .select({
      postId: communityPosts.id,
      createdAt: communityPosts.createdAt,
      updatedAt: communityPosts.updatedAt,
      channel: communityPosts.channel,
      body: communityPosts.body,
      status: communityPosts.status,
      userId: communityPosts.userId,
      memberId: communityPosts.programMemberId,
      authorName: users.name,
      authorEmail: users.email,
      memberName: programMembers.fullName,
      memberEmail: programMembers.email,
    })
    .from(communityPosts)
    .leftJoin(users, eq(users.id, communityPosts.userId))
    .leftJoin(programMembers, eq(programMembers.id, communityPosts.programMemberId))
    .where(whereClause);

  const rows =
    input.direction === "last" && !cursor
      ? await baseQuery
          .orderBy(asc(communityPosts.createdAt), asc(communityPosts.id))
          .offset(Math.max(0, totalCount - input.limit))
          .limit(input.limit)
      : await baseQuery
          .orderBy(desc(communityPosts.createdAt), desc(communityPosts.id))
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
      hidden: Number(summaryRow?.hidden ?? 0),
      verifiedMembers: Number(summaryRow?.verifiedMembers ?? 0),
      withMember: Number(summaryRow?.withMember ?? 0),
      withoutMember: Number(summaryRow?.withoutMember ?? 0),
    },
  };
}
