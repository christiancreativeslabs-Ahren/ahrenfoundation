import { and, asc, desc, eq, ilike, inArray, lt, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  mentorAssignments,
  moduleSubmissions,
  programMembers,
  programModules,
} from "@/db/schema";

export type MenteeListDirection = "next" | "last";

export type MenteeListInput = {
  page: number;
  limit: number;
  cursor?: string;
  direction: MenteeListDirection;
  search?: string;
  status?: "all" | "application_received" | "approved" | "verified_member" | "completed";
};

export type MenteeListRow = {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  fullName: string;
  email: string;
  status: string;
  currentStep: string;
  userId: string | null;
  joinApplicationId: string;
  verifiedAt: Date | string | null;
  completedModuleCount: number;
  totalModuleCount: number;
  latestSubmissionAt: Date | string | null;
  assignedMentorId: string | null;
  assignedMentorName: string | null;
  assignedMentorEmail: string | null;
};

export type MenteeListResponse = {
  items: MenteeListRow[];
  totalCount: number;
  hasMore: boolean;
  nextCursor: string | null;
  page: number;
  limit: number;
  summary: {
    total: number;
    verified: number;
    approved: number;
    completed: number;
    assigned: number;
  };
};

export type MenteeExportRow = {
  createdAt: string;
  updatedAt: string;
  fullName: string;
  email: string;
  status: string;
  currentStep: string;
  assignedMentorName: string;
  assignedMentorEmail: string;
  completedModuleCount: number;
  totalModuleCount: number;
  latestSubmissionAt: string;
  verifiedAt: string;
  userId: string;
  joinApplicationId: string;
};

function toIso(value: Date | string | null | undefined) {
  if (!value) return "";
  return new Date(value).toISOString();
}

function normalizeCursor(cursor?: string) {
  if (!cursor) return null;
  const [createdAt, id] = cursor.split("|");
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime()) || !id) return null;
  return { createdAt: date, id };
}

function encodeCursor(row: MenteeListRow) {
  return `${new Date(row.createdAt).toISOString()}|${row.id}`;
}

function buildFilters(input: Pick<MenteeListInput, "search" | "status">) {
  const search = input.search?.trim();

  return [
    eq(programMembers.role, "youth"),
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

async function getMenteeDerivedData(menteeIds: string[]) {
  if (!menteeIds.length) {
    return {
      mentorByMenteeId: new Map<string, { id: string; fullName: string; email: string }>(),
      progressByMenteeId: new Map<string, { completed: number; latest: Date | string | null }>(),
      totalModuleCount: 0,
    };
  }

  const [moduleCountRow] = await db
    .select({ total: sql<number>`coalesce(count(*), 0)` })
    .from(programModules);

  const assignmentRows = await db
    .select({
      youthMemberId: mentorAssignments.youthMemberId,
      mentorId: programMembers.id,
      mentorName: programMembers.fullName,
      mentorEmail: programMembers.email,
    })
    .from(mentorAssignments)
    .innerJoin(programMembers, eq(programMembers.id, mentorAssignments.mentorMemberId))
    .where(
      and(
        eq(mentorAssignments.status, "active"),
        inArray(mentorAssignments.youthMemberId, menteeIds),
      ),
    )
    .orderBy(desc(mentorAssignments.assignedAt));

  const mentorByMenteeId = new Map<string, { id: string; fullName: string; email: string }>();
  for (const row of assignmentRows) {
    if (!mentorByMenteeId.has(row.youthMemberId)) {
      mentorByMenteeId.set(row.youthMemberId, {
        id: row.mentorId,
        fullName: row.mentorName,
        email: row.mentorEmail,
      });
    }
  }

  const progressRows = await db
    .select({
      programMemberId: moduleSubmissions.programMemberId,
      completed: sql<number>`coalesce(count(distinct ${moduleSubmissions.moduleId}), 0)`,
      latest: sql<Date | null>`max(${moduleSubmissions.submittedAt})`,
    })
    .from(moduleSubmissions)
    .where(inArray(moduleSubmissions.programMemberId, menteeIds))
    .groupBy(moduleSubmissions.programMemberId);

  const progressByMenteeId = new Map(
    progressRows.map((row) => [
      row.programMemberId,
      { completed: Number(row.completed ?? 0), latest: row.latest },
    ]),
  );

  return {
    mentorByMenteeId,
    progressByMenteeId,
    totalModuleCount: Number(moduleCountRow?.total ?? 0),
  };
}

export async function getMenteeListData(
  input: MenteeListInput,
): Promise<MenteeListResponse> {
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
      verified: sql<number>`coalesce(sum(case when ${programMembers.status} = 'verified_member' then 1 else 0 end), 0)`,
      approved: sql<number>`coalesce(sum(case when ${programMembers.status} = 'approved' then 1 else 0 end), 0)`,
      completed: sql<number>`coalesce(sum(case when ${programMembers.status} = 'completed' then 1 else 0 end), 0)`,
    })
    .from(programMembers)
    .where(summaryWhereClause);

  const totalCount = Number(summaryRow?.total ?? 0);
  const baseQuery = db.select().from(programMembers).where(whereClause);
  const rows =
    input.direction === "last" && !cursor
      ? await baseQuery
          .orderBy(asc(programMembers.createdAt), asc(programMembers.id))
          .offset(Math.max(0, totalCount - input.limit))
          .limit(input.limit)
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
  const derived = await getMenteeDerivedData(pageRows.map((row) => row.id));
  const assigned = Array.from(derived.mentorByMenteeId.keys()).length;
  const items = pageRows.map((row) => {
    const mentor = derived.mentorByMenteeId.get(row.id);
    const progress = derived.progressByMenteeId.get(row.id);
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
      verifiedAt: row.verifiedAt,
      completedModuleCount: progress?.completed ?? 0,
      totalModuleCount: derived.totalModuleCount,
      latestSubmissionAt: progress?.latest ?? null,
      assignedMentorId: mentor?.id ?? null,
      assignedMentorName: mentor?.fullName ?? null,
      assignedMentorEmail: mentor?.email ?? null,
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
      completed: Number(summaryRow?.completed ?? 0),
      assigned,
    },
  };
}

export async function getMenteeExportRows(
  input: Pick<MenteeListInput, "search" | "status">,
): Promise<MenteeExportRow[]> {
  const rows = await db
    .select()
    .from(programMembers)
    .where(and(...buildFilters(input)))
    .orderBy(desc(programMembers.createdAt), desc(programMembers.id));
  const derived = await getMenteeDerivedData(rows.map((row) => row.id));

  return rows.map((row) => {
    const mentor = derived.mentorByMenteeId.get(row.id);
    const progress = derived.progressByMenteeId.get(row.id);
    return {
      createdAt: toIso(row.createdAt),
      updatedAt: toIso(row.updatedAt),
      fullName: row.fullName,
      email: row.email,
      status: row.status,
      currentStep: row.currentStep,
      assignedMentorName: mentor?.fullName ?? "",
      assignedMentorEmail: mentor?.email ?? "",
      completedModuleCount: progress?.completed ?? 0,
      totalModuleCount: derived.totalModuleCount,
      latestSubmissionAt: toIso(progress?.latest ?? null),
      verifiedAt: toIso(row.verifiedAt),
      userId: row.userId ?? "",
      joinApplicationId: row.joinApplicationId,
    };
  });
}
