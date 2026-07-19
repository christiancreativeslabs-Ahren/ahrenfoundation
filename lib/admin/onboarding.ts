import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  emailEvents,
  engagementEvents,
  joinApplications,
  moduleDeliveries,
  moduleQuestions,
  moduleSubmissionAnswers,
  moduleSubmissions,
  programEnrollments,
  programMembers,
  programModules,
  users,
} from "@/db/schema";

type JsonRecord = Record<string, unknown> | null | undefined;

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function getString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function getStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

export function getFaithPayload(payload: JsonRecord) {
  const faith = asRecord(payload?.faith);
  return {
    bornAgain: getString(faith?.bornAgain),
    holySpirit: getString(faith?.holySpirit),
    dependency: getString(faith?.dependency),
  };
}

export function formatAdminDate(value: Date | string | null | undefined) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function countByStatus<T extends { status: string }>(rows: T[]) {
  return rows.reduce<Record<string, number>>((accumulator, row) => {
    accumulator[row.status] = (accumulator[row.status] ?? 0) + 1;
    return accumulator;
  }, {});
}

export async function getAdminDashboardMetrics() {
  const [
    applications,
    enrollments,
    deliveries,
    submissions,
    recentEvents,
  ] = await Promise.all([
    db.select().from(joinApplications),
    db.select().from(programEnrollments),
    db.select().from(moduleDeliveries),
    db.select().from(moduleSubmissions),
    db
      .select({
        event: engagementEvents,
        member: programMembers,
        module: programModules,
      })
      .from(engagementEvents)
      .leftJoin(programMembers, eq(programMembers.id, engagementEvents.programMemberId))
      .leftJoin(programModules, eq(programModules.id, engagementEvents.moduleId))
      .orderBy(desc(engagementEvents.createdAt))
      .limit(8),
  ]);

  const applicationStatus = countByStatus(applications);
  const enrollmentStatus = countByStatus(enrollments);
  const deliveryStatus = countByStatus(deliveries);
  const completedDeliveries = deliveries.filter(
    (delivery) => Boolean(delivery.assignmentSubmittedAt) || delivery.status === "completed",
  ).length;
  const completionRate = deliveries.length
    ? Math.round((completedDeliveries / deliveries.length) * 100)
    : 0;

  return {
    applications: {
      total: applications.length,
      approved: applicationStatus.approved ?? 0,
      rejected: applicationStatus.rejected ?? 0,
      reviewing: applicationStatus.reviewing ?? 0,
      pending: applicationStatus.pending ?? 0,
    },
    enrollments: {
      total: enrollments.length,
      active: enrollmentStatus.active ?? 0,
      completed: enrollmentStatus.completed ?? 0,
    },
    deliveries: {
      total: deliveries.length,
      scheduled: deliveryStatus.scheduled ?? 0,
      sent: deliveryStatus.sent ?? 0,
      skipped: deliveryStatus.skipped ?? 0,
      failed: deliveryStatus.failed ?? 0,
      completed: deliveryStatus.completed ?? 0,
      cancelled: deliveryStatus.cancelled ?? 0,
    },
    submissions: {
      total: submissions.length,
      completionRate,
    },
    recentEvents,
  };
}

export async function getJoinApplicationDetail(applicationId: string) {
  const [row] = await db
    .select({
      application: joinApplications,
      member: programMembers,
    })
    .from(joinApplications)
    .leftJoin(
      programMembers,
      eq(programMembers.joinApplicationId, joinApplications.id),
    )
    .where(eq(joinApplications.id, applicationId))
    .limit(1);

  if (!row) return null;

  const linkedUser = row.member?.userId
    ? (
        await db
          .select()
          .from(users)
          .where(eq(users.id, row.member.userId))
          .limit(1)
      )[0] ?? null
    : (
        await db
          .select()
          .from(users)
          .where(eq(users.email, row.application.email))
          .limit(1)
      )[0] ?? null;

  const enrollments = row.member
    ? await db
        .select({
          enrollment: programEnrollments,
        })
        .from(programEnrollments)
        .where(eq(programEnrollments.programMemberId, row.member.id))
        .orderBy(desc(programEnrollments.createdAt))
    : [];

  const welcomeEmails = await db
    .select()
    .from(emailEvents)
    .where(eq(emailEvents.recipientEmail, row.application.email))
    .orderBy(desc(emailEvents.createdAt))
    .limit(20);

  return {
    ...row,
    linkedUser,
    enrollments: enrollments.map((item) => item.enrollment),
    welcomeEmails,
  };
}

export async function getOnboardingOverviewData() {
  const [metrics, recentSubmissions, recentEmailEvents] = await Promise.all([
    getAdminDashboardMetrics(),
    db
      .select({
        submission: moduleSubmissions,
        member: programMembers,
        module: programModules,
      })
      .from(moduleSubmissions)
      .innerJoin(programMembers, eq(programMembers.id, moduleSubmissions.programMemberId))
      .innerJoin(programModules, eq(programModules.id, moduleSubmissions.moduleId))
      .orderBy(desc(moduleSubmissions.submittedAt))
      .limit(8),
    db
      .select({
        emailEvent: emailEvents,
        member: programMembers,
        module: programModules,
      })
      .from(emailEvents)
      .leftJoin(programMembers, eq(programMembers.id, emailEvents.programMemberId))
      .leftJoin(programModules, eq(programModules.id, emailEvents.moduleId))
      .orderBy(desc(emailEvents.createdAt))
      .limit(8),
  ]);

  return {
    ...metrics,
    recentSubmissions,
    recentEmailEvents,
  };
}

export async function getEmailEventLogData() {
  return db
    .select({
      emailEvent: emailEvents,
      member: programMembers,
      module: programModules,
      delivery: moduleDeliveries,
      enrollment: programEnrollments,
    })
    .from(emailEvents)
    .leftJoin(programMembers, eq(programMembers.id, emailEvents.programMemberId))
    .leftJoin(programModules, eq(programModules.id, emailEvents.moduleId))
    .leftJoin(moduleDeliveries, eq(moduleDeliveries.id, emailEvents.deliveryId))
    .leftJoin(programEnrollments, eq(programEnrollments.id, emailEvents.enrollmentId))
    .orderBy(desc(emailEvents.createdAt))
    .limit(200);
}

export async function getEngagementLogData() {
  return db
    .select({
      event: engagementEvents,
      member: programMembers,
      module: programModules,
      delivery: moduleDeliveries,
      enrollment: programEnrollments,
    })
    .from(engagementEvents)
    .leftJoin(programMembers, eq(programMembers.id, engagementEvents.programMemberId))
    .leftJoin(programModules, eq(programModules.id, engagementEvents.moduleId))
    .leftJoin(moduleDeliveries, eq(moduleDeliveries.id, engagementEvents.deliveryId))
    .leftJoin(programEnrollments, eq(programEnrollments.id, engagementEvents.enrollmentId))
    .orderBy(desc(engagementEvents.createdAt))
    .limit(200);
}

export async function getModuleSubmissionReviewData() {
  const submissionRows = await db
    .select({
      submission: moduleSubmissions,
      member: programMembers,
      module: programModules,
      delivery: moduleDeliveries,
    })
    .from(moduleSubmissions)
    .innerJoin(programMembers, eq(programMembers.id, moduleSubmissions.programMemberId))
    .innerJoin(programModules, eq(programModules.id, moduleSubmissions.moduleId))
    .innerJoin(moduleDeliveries, eq(moduleDeliveries.id, moduleSubmissions.deliveryId))
    .orderBy(desc(moduleSubmissions.submittedAt))
    .limit(100);

  const submissionIds = submissionRows.map((row) => row.submission.id);

  const answers = submissionIds.length
    ? await db
        .select({
          answer: moduleSubmissionAnswers,
          question: moduleQuestions,
        })
        .from(moduleSubmissionAnswers)
        .innerJoin(moduleQuestions, eq(moduleQuestions.id, moduleSubmissionAnswers.questionId))
        .where(inArray(moduleSubmissionAnswers.submissionId, submissionIds))
        .orderBy(desc(moduleSubmissionAnswers.createdAt))
    : [];

  const answersBySubmission = new Map<
    string,
    Array<(typeof answers)[number]>
  >();

  for (const answer of answers) {
    const existing = answersBySubmission.get(answer.answer.submissionId) ?? [];
    existing.push(answer);
    answersBySubmission.set(answer.answer.submissionId, existing);
  }

  return submissionRows.map((row) => ({
    ...row,
    answers: (answersBySubmission.get(row.submission.id) ?? []).sort(
      (left, right) => left.question.questionNumber - right.question.questionNumber,
    ),
  }));
}
