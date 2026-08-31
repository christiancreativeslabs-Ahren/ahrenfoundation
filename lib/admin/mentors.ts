import { and, asc, desc, eq, ilike, inArray, lt, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { mentorAssignments, programMembers } from "@/db/schema";

export type MentorListDirection = "next" | "last";

export type MentorListInput = {
  page: number;
  limit: number;
  cursor?: string;
  direction: MentorListDirection;
  search?: string;
  status?: "all" | "application_received" | "approved" | "verified_mentor";
};

export type MentorListRow = {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  fullName: string;
  email: string;
  status: string;
  currentStep: string;
  userId: string | null;
  joinApplicationId: string;
  mentorAgreementSignedAt: Date | string | null;
  orientationCompletedAt: Date | string | null;
  verifiedAt: Date | string | null;
  activeMenteeCount: number;
  totalMenteeCount: number;
};

export type MentorListResponse = {
  items: MentorListRow[];
  totalCount: number;
  hasMore: boolean;
  nextCursor: string | null;
  page: number;
  limit: number;
  summary: {
    total: number;
    verified: number;
    approved: number;
    activeAssignments: number;
    totalAssignments: number;
  };
};

export type MentorExportRow = {
  createdAt: string;
  updatedAt: string;
  fullName: string;
  email: string;
  status: string;
  currentStep: string;
  activeMenteeCount: number;
  totalMenteeCount: number;
  mentorAgreementSignedAt: string;
  orientationCompletedAt: string;
  verifiedAt: string;
  userId: string;
  joinApplicationId: string;
};

export const MENTOR_EXPORT_HEADERS = [
  "createdAt",
  "updatedAt",
  "fullName",
  "email",
  "status",
  "currentStep",
  "activeMenteeCount",
  "totalMenteeCount",
  "mentorAgreementSignedAt",
  "orientationCompletedAt",
  "verifiedAt",
  "userId",
  "joinApplicationId",
] satisfies Array<keyof MentorExportRow>;

function normalizeCursor(cursor?: string) {
  if (!cursor) return null;
  const [createdAt, id] = cursor.split("|");
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime()) || !id) return null;
  return { createdAt: date, id };
}

function encodeCursor(row: MentorListRow) {
  return `${new Date(row.createdAt).toISOString()}|${row.id}`;
}

function toIso(value: Date | string | null | undefined) {
  if (!value) return "";
  return new Date(value).toISOString();
}

function buildFilters(input: Pick<MentorListInput, "search" | "status">) {
  const search = input.search?.trim();

  return [
    eq(programMembers.role, "mentor"),
    input.status && input.status !== "all"
      ? eq(programMembers.status, input.status)
      : undefined,
    search
      ? or(
          ilike(programMembers.fullName, `%${search}%`),
          ilike(programMembers.email, `%${search}%`),
          ilike(programMembers.status, `%${search}%`),
          ilike(programMembers.currentStep, `%${search}%`),
        )
      : undefined,
  ].filter(Boolean);
}

async function getAssignmentCounts(mentorIds: string[]) {
  if (!mentorIds.length) {
    return new Map<string, { active: number; total: number }>();
  }

  const rows = await db
    .select({
      mentorMemberId: mentorAssignments.mentorMemberId,
      total: sql<number>`coalesce(count(*), 0)`,
      active: sql<number>`coalesce(sum(case when ${mentorAssignments.status} = 'active' then 1 else 0 end), 0)`,
    })
    .from(mentorAssignments)
    .where(
      or(...mentorIds.map((mentorId) => eq(mentorAssignments.mentorMemberId, mentorId))),
    )
    .groupBy(mentorAssignments.mentorMemberId);

  return new Map(
    rows.map((row) => [
      row.mentorMemberId,
      { active: Number(row.active ?? 0), total: Number(row.total ?? 0) },
    ]),
  );
}

export async function getMentorListData(
  input: MentorListInput,
): Promise<MentorListResponse> {
  const cursor = normalizeCursor(input.cursor);
  const filters = [
    ...buildFilters(input),
    cursor
      ? or(
          lt(programMembers.createdAt, cursor.createdAt),
          and(eq(programMembers.createdAt, cursor.createdAt), lt(programMembers.id, cursor.id)),
        )
      : undefined,
  ].filter(Boolean);
  const whereClause = filters.length ? and(...filters) : undefined;
  const summaryWhereClause = and(...buildFilters(input));

  const [summaryRow] = await db
    .select({
      total: sql<number>`coalesce(count(*), 0)`,
      verified: sql<number>`coalesce(sum(case when ${programMembers.status} = 'verified_mentor' then 1 else 0 end), 0)`,
      approved: sql<number>`coalesce(sum(case when ${programMembers.status} = 'approved' then 1 else 0 end), 0)`,
    })
    .from(programMembers)
    .where(summaryWhereClause);

  const filteredMentorIds = await db
    .select({ id: programMembers.id })
    .from(programMembers)
    .where(summaryWhereClause);
  const filteredMentorIdValues = filteredMentorIds.map((row) => row.id);

  const [assignmentSummaryRow] = await db
    .select({
      totalAssignments: sql<number>`coalesce(count(*), 0)`,
      activeAssignments: sql<number>`coalesce(sum(case when ${mentorAssignments.status} = 'active' then 1 else 0 end), 0)`,
    })
    .from(mentorAssignments)
    .where(
      filteredMentorIdValues.length
        ? inArray(mentorAssignments.mentorMemberId, filteredMentorIdValues)
        : sql`false`,
    );

  const totalCount = Number(summaryRow?.total ?? 0);
  const baseQuery = db.select().from(programMembers).where(whereClause);

  const rows =
    input.direction === "last" && !cursor
      ? await baseQuery
          .orderBy(asc(programMembers.createdAt), asc(programMembers.id))
          .offset(Math.max(0, totalCount - input.limit))
          .limit(input.limit)
      : !cursor && input.page > 1
        ? await baseQuery
            .orderBy(desc(programMembers.createdAt), desc(programMembers.id))
            .offset((input.page - 1) * input.limit)
            .limit(input.limit + 1)
      : await baseQuery
          .orderBy(desc(programMembers.createdAt), desc(programMembers.id))
          .limit(input.limit + 1);

  const hasMore =
    input.direction === "last" && !cursor ? false : rows.length > input.limit;
  const pageRows =
    input.direction === "last" && !cursor
      ? rows
      : hasMore
        ? rows.slice(0, -1)
        : rows;
  const countsByMentorId = await getAssignmentCounts(pageRows.map((row) => row.id));
  const items = pageRows.map((row) => {
    const counts = countsByMentorId.get(row.id) ?? { active: 0, total: 0 };
    return {
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      fullName: row.fullName,
      email: row.email,
      status: row.status,
      currentStep: row.currentStep,
      userId: row.userId,
      joinApplicationId: row.joinApplicationId,
      mentorAgreementSignedAt: row.mentorAgreementSignedAt,
      orientationCompletedAt: row.orientationCompletedAt,
      verifiedAt: row.verifiedAt,
      activeMenteeCount: counts.active,
      totalMenteeCount: counts.total,
    };
  });

  return {
    items,
    totalCount,
    hasMore,
    nextCursor: hasMore ? encodeCursor(items.at(-1)!) : null,
    page: input.page,
    limit: input.limit,
    summary: {
      total: Number(summaryRow?.total ?? 0),
      verified: Number(summaryRow?.verified ?? 0),
      approved: Number(summaryRow?.approved ?? 0),
      activeAssignments: Number(assignmentSummaryRow?.activeAssignments ?? 0),
      totalAssignments: Number(assignmentSummaryRow?.totalAssignments ?? 0),
    },
  };
}

export async function getMentorExportRows(
  input: Pick<MentorListInput, "search" | "status">,
): Promise<MentorExportRow[]> {
  const whereClause = and(...buildFilters(input));
  const rows = await db
    .select()
    .from(programMembers)
    .where(whereClause)
    .orderBy(desc(programMembers.createdAt), desc(programMembers.id));
  const countsByMentorId = await getAssignmentCounts(rows.map((row) => row.id));

  return rows.map((row) => {
    const counts = countsByMentorId.get(row.id) ?? { active: 0, total: 0 };
    return {
      createdAt: toIso(row.createdAt),
      updatedAt: toIso(row.updatedAt),
      fullName: row.fullName,
      email: row.email,
      status: row.status,
      currentStep: row.currentStep,
      activeMenteeCount: counts.active,
      totalMenteeCount: counts.total,
      mentorAgreementSignedAt: toIso(row.mentorAgreementSignedAt),
      orientationCompletedAt: toIso(row.orientationCompletedAt),
      verifiedAt: toIso(row.verifiedAt),
      userId: row.userId ?? "",
      joinApplicationId: row.joinApplicationId,
    };
  });
}
