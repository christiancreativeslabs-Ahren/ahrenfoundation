import { asc, desc, eq, inArray, or } from "drizzle-orm";
import { db } from "@/db";
import {
  emailEvents,
  bulkEmailCampaigns,
  mentorAssignments,
  mentorshipSessions,
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
    bornAgain: getString(payload?.faithBornAgain ?? payload?.mentorFaithBornAgain ?? faith?.bornAgain),
    holySpirit: getString(payload?.faithHolySpirit ?? payload?.mentorFaithHolySpirit ?? faith?.holySpirit),
    dependency: getString(payload?.faithDependency ?? payload?.mentorFaithDependency ?? faith?.dependency),
  };
}

function buildYouthApplicationPayload(application: Record<string, unknown>) {
  const rawPayload = asRecord(application.payload);
  const rawFaith = asRecord(rawPayload?.faith);
  return {
    ageRange: getString(application.ageRange ?? rawPayload?.ageRange),
    sex: getString(application.sex ?? rawPayload?.sex),
    skills: getStringArray(application.skills ?? rawPayload?.skills),
    skillsOther: getString(application.skillsOther ?? rawPayload?.skillsOther),
    skillsToLearn: getString(application.skillsToLearn ?? rawPayload?.skillsToLearn),
    availability: getStringArray(application.availability ?? rawPayload?.availability),
    whyJoin: getString(application.whyJoin ?? rawPayload?.whyJoin),
    faithBornAgain: getString(
      application.faithBornAgain ?? rawPayload?.faithBornAgain ?? rawFaith?.bornAgain,
    ),
    faithHolySpirit: getString(
      application.faithHolySpirit ?? rawPayload?.faithHolySpirit ?? rawFaith?.holySpirit,
    ),
    faithDependency: getString(rawPayload?.faithDependency ?? rawFaith?.dependency),
    testimony: getString(rawPayload?.testimony ?? application.testimony),
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

  const mergedPayload = buildYouthApplicationPayload(row.application as Record<string, unknown>);

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
    application: {
      ...row.application,
      payload: {
        ...(asRecord(row.application.payload) ?? {}),
        ...mergedPayload,
      },
    },
    linkedUser,
    enrollments: enrollments.map((item) => item.enrollment),
    welcomeEmails,
  };
}

export async function getProgramMemberJourneyData(memberId: string) {
  const [member] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.id, memberId))
    .limit(1);

  if (!member) return null;

  const moduleProgress = await db
    .select({
      delivery: moduleDeliveries,
      enrollment: programEnrollments,
      module: programModules,
    })
    .from(moduleDeliveries)
    .innerJoin(programEnrollments, eq(programEnrollments.id, moduleDeliveries.enrollmentId))
    .innerJoin(programModules, eq(programModules.id, moduleDeliveries.moduleId))
    .where(eq(moduleDeliveries.programMemberId, member.id))
    .orderBy(desc(programModules.moduleNumber));

  const submissions = await db
    .select()
    .from(moduleSubmissions)
    .where(eq(moduleSubmissions.programMemberId, member.id))
    .orderBy(desc(moduleSubmissions.submittedAt));

  const assignments = await db
    .select()
    .from(mentorAssignments)
    .where(
      or(
        eq(mentorAssignments.youthMemberId, member.id),
        eq(mentorAssignments.mentorMemberId, member.id),
      ),
    )
    .orderBy(desc(mentorAssignments.createdAt));

  const sessions = assignments.length
    ? await db
        .select()
        .from(mentorshipSessions)
        .where(eq(mentorshipSessions.assignmentId, assignments[0].id))
        .orderBy(desc(mentorshipSessions.sessionNumber))
    : [];

  const latestSubmissionByModule = new Map<string, typeof submissions[number]>();
  for (const submission of submissions) {
    if (!latestSubmissionByModule.has(submission.moduleId)) {
      latestSubmissionByModule.set(submission.moduleId, submission);
    }
  }

  const latestSubmissionIds = Array.from(latestSubmissionByModule.values()).map(
    (submission) => submission.id,
  );

  const answers = latestSubmissionIds.length
    ? await db
        .select({
          submissionId: moduleSubmissionAnswers.submissionId,
          answer: moduleSubmissionAnswers.answer,
          questionNumber: moduleQuestions.questionNumber,
          prompt: moduleQuestions.prompt,
        })
        .from(moduleSubmissionAnswers)
        .innerJoin(moduleQuestions, eq(moduleQuestions.id, moduleSubmissionAnswers.questionId))
        .where(inArray(moduleSubmissionAnswers.submissionId, latestSubmissionIds))
        .orderBy(asc(moduleQuestions.questionNumber))
    : [];

  const deliveryIds = moduleProgress.map((item) => item.delivery.id);
  const deliveryEmailEvents = deliveryIds.length
    ? await db
        .select()
        .from(emailEvents)
        .where(inArray(emailEvents.deliveryId, deliveryIds))
        .orderBy(desc(emailEvents.createdAt))
    : [];

  const latestEmailEventByDelivery = new Map<string, typeof deliveryEmailEvents[number]>();
  for (const event of deliveryEmailEvents) {
    if (event.deliveryId && !latestEmailEventByDelivery.has(event.deliveryId)) {
      latestEmailEventByDelivery.set(event.deliveryId, event);
    }
  }

  type AnswerRow = (typeof answers)[number];
  const answersBySubmission = new Map<string, AnswerRow[]>();
  for (const answer of answers) {
    const existing = answersBySubmission.get(answer.submissionId) ?? [];
    existing.push(answer);
    answersBySubmission.set(answer.submissionId, existing);
  }

  const completedModules = moduleProgress.filter(
    (item) => item.delivery.assignmentSubmittedAt,
  ).length;
  const completionPercentage = moduleProgress.length
    ? Math.round((completedModules / moduleProgress.length) * 100)
    : 0;
  const currentModule = moduleProgress.find(
    (item) => !item.delivery.assignmentSubmittedAt,
  );
  const nextScheduled = moduleProgress.find(
    (item) =>
      item.delivery.status === "scheduled" ||
      item.delivery.status === "failed" ||
      item.delivery.status === "cancelled",
  );

  return {
    member,
    moduleProgress,
    submissions,
    assignments,
    sessions,
    answers,
    answersBySubmission,
    latestSubmissionByModule,
    latestEmailEventByDelivery,
    completedModules,
    completionPercentage,
    currentModule,
    nextScheduled,
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
      campaign: bulkEmailCampaigns,
    })
    .from(emailEvents)
    .leftJoin(programMembers, eq(programMembers.id, emailEvents.programMemberId))
    .leftJoin(programModules, eq(programModules.id, emailEvents.moduleId))
    .leftJoin(moduleDeliveries, eq(moduleDeliveries.id, emailEvents.deliveryId))
    .leftJoin(programEnrollments, eq(programEnrollments.id, emailEvents.enrollmentId))
    .leftJoin(bulkEmailCampaigns, eq(bulkEmailCampaigns.id, emailEvents.bulkEmailCampaignId))
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
