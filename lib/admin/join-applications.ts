import { and, asc, desc, eq, ilike, lt, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  joinApplicationListItems,
  joinApplications,
  programMembers,
  users,
} from "@/db/schema";

export type JoinApplicationListDirection = "next" | "last";

export type JoinApplicationListInput = {
  page: number;
  limit: number;
  cursor?: string;
  direction: JoinApplicationListDirection;
  search?: string;
  applicationType?: "all" | "youth" | "mentor";
  status?: "pending" | "reviewing" | "approved" | "rejected";
};

export type JoinApplicationListRow = {
  joinApplicationId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  applicationType: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  status: string;
  consent: boolean;
  programMemberId: string | null;
  memberRole: string | null;
  memberStatus: string | null;
  memberCurrentStep: string | null;
  userId: string | null;
  searchText: string;
  payload: Record<string, unknown> | null;
};

export type JoinApplicationListResponse = {
  items: JoinApplicationListRow[];
  totalCount: number;
  hasMore: boolean;
  nextCursor: string | null;
  page: number;
  limit: number;
  summary: {
    total: number;
    approved: number;
    rejected: number;
    reviewing: number;
    pending: number;
    youth: number;
    mentor: number;
    withMember: number;
    withoutMember: number;
  };
};

function buildSearchText(input: {
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  applicationType: string;
  status: string;
  memberRole?: string | null;
  memberStatus?: string | null;
  memberCurrentStep?: string | null;
  payload?: Record<string, unknown> | null;
}) {
  const payloadValues = input.payload
    ? Object.values(input.payload)
        .flatMap((value) => {
          if (typeof value === "string") return [value];
          if (Array.isArray(value)) {
            return value.filter(
              (item): item is string => typeof item === "string"
            );
          }
          return [];
        })
        .join(" ")
    : "";

  return [
    input.fullName,
    input.email,
    input.phoneNumber,
    input.location,
    input.applicationType,
    input.status,
    input.memberRole ?? "",
    input.memberStatus ?? "",
    input.memberCurrentStep ?? "",
    payloadValues,
  ]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function upsertJoinApplicationListItem(joinApplicationId: string) {
  const [row] = await db
    .select({
      application: joinApplications,
      member: programMembers,
      user: users,
    })
    .from(joinApplications)
    .leftJoin(
      programMembers,
      eq(programMembers.joinApplicationId, joinApplications.id)
    )
    .leftJoin(users, eq(users.id, programMembers.userId))
    .where(eq(joinApplications.id, joinApplicationId))
    .limit(1);

  if (!row) {
    return null;
  }

  const searchText = buildSearchText({
    fullName: row.application.fullName,
    email: row.application.email,
    phoneNumber: row.application.phoneNumber,
    location: row.application.location,
    applicationType: row.application.applicationType,
    status: row.application.status,
    memberRole: row.member?.role ?? null,
    memberStatus: row.member?.status ?? null,
    memberCurrentStep: row.member?.currentStep ?? null,
    payload: row.application.payload ?? null,
  });

  const [item] = await db
    .insert(joinApplicationListItems)
    .values({
      joinApplicationId: row.application.id,
      applicationType: row.application.applicationType,
      fullName: row.application.fullName,
      email: row.application.email,
      phoneNumber: row.application.phoneNumber,
      location: row.application.location,
      status: row.application.status,
      consent: row.application.consent,
      programMemberId: row.member?.id ?? null,
      memberRole: row.member?.role ?? null,
      memberStatus: row.member?.status ?? null,
      memberCurrentStep: row.member?.currentStep ?? null,
      userId: row.member?.userId ?? row.user?.id ?? null,
      searchText,
      payload: row.application.payload ?? null,
    })
    .onConflictDoUpdate({
      target: joinApplicationListItems.joinApplicationId,
      set: {
        updatedAt: new Date(),
        applicationType: row.application.applicationType,
        fullName: row.application.fullName,
        email: row.application.email,
        phoneNumber: row.application.phoneNumber,
        location: row.application.location,
        status: row.application.status,
        consent: row.application.consent,
        programMemberId: row.member?.id ?? null,
        memberRole: row.member?.role ?? null,
        memberStatus: row.member?.status ?? null,
        memberCurrentStep: row.member?.currentStep ?? null,
        userId: row.member?.userId ?? row.user?.id ?? null,
        searchText,
        payload: row.application.payload ?? null,
      },
    })
    .returning();

  return item;
}

function normalizeCursorCursor(cursor?: string) {
  if (!cursor) return null;
  const [createdAt, joinApplicationId] = cursor.split("|");
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime()) || !joinApplicationId) return null;
  return { createdAt: date, joinApplicationId };
}

function encodeCursor(row: JoinApplicationListRow) {
  return `${new Date(row.createdAt).toISOString()}|${row.joinApplicationId}`;
}

export async function getJoinApplicationListData(
  input: JoinApplicationListInput
): Promise<JoinApplicationListResponse> {
  const cursor = normalizeCursorCursor(input.cursor);
  const search = input.search?.trim();

  const filters = [
    input.applicationType && input.applicationType !== "all"
      ? eq(joinApplicationListItems.applicationType, input.applicationType)
      : undefined,
    input.status
      ? eq(joinApplicationListItems.status, input.status)
      : undefined,
    search
      ? or(
          ilike(joinApplicationListItems.searchText, `%${search}%`),
          ilike(joinApplicationListItems.fullName, `%${search}%`),
          ilike(joinApplicationListItems.email, `%${search}%`),
          ilike(joinApplicationListItems.phoneNumber, `%${search}%`),
          ilike(joinApplicationListItems.location, `%${search}%`)
        )
      : undefined,
    cursor
      ? or(
          lt(joinApplicationListItems.createdAt, cursor.createdAt),
          and(
            eq(joinApplicationListItems.createdAt, cursor.createdAt),
            lt(
              joinApplicationListItems.joinApplicationId,
              cursor.joinApplicationId
            )
          )
        )
      : undefined,
  ].filter(Boolean);

  const whereClause = filters.length ? and(...filters) : undefined;

  const [summaryRow] = await db
    .select({
      total: sql<number>`coalesce(count(*), 0)`,
      approved: sql<number>`coalesce(sum(case when ${joinApplicationListItems.status} = 'approved' then 1 else 0 end), 0)`,
      rejected: sql<number>`coalesce(sum(case when ${joinApplicationListItems.status} = 'rejected' then 1 else 0 end), 0)`,
      reviewing: sql<number>`coalesce(sum(case when ${joinApplicationListItems.status} = 'reviewing' then 1 else 0 end), 0)`,
      pending: sql<number>`coalesce(sum(case when ${joinApplicationListItems.status} = 'pending' then 1 else 0 end), 0)`,
      youth: sql<number>`coalesce(sum(case when ${joinApplicationListItems.applicationType} = 'youth' then 1 else 0 end), 0)`,
      mentor: sql<number>`coalesce(sum(case when ${joinApplicationListItems.applicationType} = 'mentor' then 1 else 0 end), 0)`,
      withMember: sql<number>`coalesce(sum(case when ${joinApplicationListItems.programMemberId} is not null then 1 else 0 end), 0)`,
      withoutMember: sql<number>`coalesce(sum(case when ${joinApplicationListItems.programMemberId} is null then 1 else 0 end), 0)`,
    })
    .from(joinApplicationListItems)
    .where(whereClause);

  const totalCount = Number(summaryRow?.total ?? 0);

  const baseQuery = db
    .select()
    .from(joinApplicationListItems)
    .where(whereClause);

  const rows =
    input.direction === "last" && !cursor
      ? await baseQuery
          .orderBy(
            asc(joinApplicationListItems.createdAt),
            asc(joinApplicationListItems.joinApplicationId)
          )
          .offset(Math.max(0, totalCount - input.limit))
          .limit(input.limit)
      : await baseQuery
          .orderBy(
            desc(joinApplicationListItems.createdAt),
            desc(joinApplicationListItems.joinApplicationId)
          )
          .limit(input.limit + 1);

  const hasMore =
    input.direction === "last" && !cursor ? false : rows.length > input.limit;
  const items =
    input.direction === "last" && !cursor
      ? (rows as JoinApplicationListRow[])
      : ((hasMore ? rows.slice(0, -1) : rows) as JoinApplicationListRow[]);
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
      approved: Number(summaryRow?.approved ?? 0),
      rejected: Number(summaryRow?.rejected ?? 0),
      reviewing: Number(summaryRow?.reviewing ?? 0),
      pending: Number(summaryRow?.pending ?? 0),
      youth: Number(summaryRow?.youth ?? 0),
      mentor: Number(summaryRow?.mentor ?? 0),
      withMember: Number(summaryRow?.withMember ?? 0),
      withoutMember: Number(summaryRow?.withoutMember ?? 0),
    },
  };
}

export async function syncJoinApplicationProjection(joinApplicationId: string) {
  return upsertJoinApplicationListItem(joinApplicationId);
}
