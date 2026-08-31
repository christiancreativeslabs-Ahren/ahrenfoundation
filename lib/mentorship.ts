import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  mentorAssignments,
  mentorshipSessions,
  moduleQuestions,
  moduleDeliveries,
  moduleSubmissionAnswers,
  moduleSubmissions,
  programMembers,
  programModules,
} from "@/db/schema";
import { getWorkbookMemberDashboard } from "@/lib/workbook";

type SubmissionPayload = {
  mentorFeedback?: string;
  mentorReviewStatus?: string;
  mentorReviewedAt?: string;
  mentorReviewerId?: string;
  mentorReviewerName?: string;
  mentorReviewerEmail?: string;
  [key: string]: unknown;
};

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function asPayload(value: Record<string, unknown> | null | undefined): SubmissionPayload {
  return value && typeof value === "object" ? value : {};
}

export function getMentorReviewStatus(
  payload: Record<string, unknown> | null | undefined,
) {
  return asPayload(payload).mentorReviewStatus ?? "needs_review";
}

export function getMentorFeedback(
  payload: Record<string, unknown> | null | undefined,
) {
  return asPayload(payload).mentorFeedback ?? "";
}

export function getMentorReviewedAt(
  payload: Record<string, unknown> | null | undefined,
) {
  return asPayload(payload).mentorReviewedAt ?? null;
}

export async function getActiveMentorAssignmentForMentee(
  menteeMemberId: string
) {
  const [row] = await db
    .select({
      assignment: mentorAssignments,
      mentor: programMembers,
    })
    .from(mentorAssignments)
    .innerJoin(
      programMembers,
      eq(programMembers.id, mentorAssignments.mentorMemberId)
    )
    .where(
      and(
        eq(mentorAssignments.youthMemberId, menteeMemberId),
        eq(mentorAssignments.status, "active")
      )
    )
    .orderBy(desc(mentorAssignments.assignedAt))
    .limit(1);

  if (!row) {
    return null;
  }

  const sessions = await db
    .select()
    .from(mentorshipSessions)
    .where(eq(mentorshipSessions.assignmentId, row.assignment.id))
    .orderBy(asc(mentorshipSessions.sessionNumber));

  return {
    ...row,
    sessions,
  };
}

export async function getMentorDashboardData(mentorMemberId: string) {
  const [mentor] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.id, mentorMemberId))
    .limit(1);

  if (!mentor) {
    return null;
  }

  const assignments = await db
    .select({
      assignment: mentorAssignments,
      mentee: programMembers,
    })
    .from(mentorAssignments)
    .innerJoin(
      programMembers,
      eq(programMembers.id, mentorAssignments.youthMemberId)
    )
    .where(
      and(
        eq(mentorAssignments.mentorMemberId, mentorMemberId),
        eq(mentorAssignments.status, "active")
      )
    )
    .orderBy(desc(mentorAssignments.assignedAt));

  const assignmentIds = assignments.map((row) => row.assignment.id);
  const menteeIds = assignments.map((row) => row.mentee.id);

  const sessions = assignmentIds.length
    ? await db
        .select()
        .from(mentorshipSessions)
        .where(inArray(mentorshipSessions.assignmentId, assignmentIds))
        .orderBy(asc(mentorshipSessions.sessionNumber))
    : [];

  const submissions = menteeIds.length
    ? await db
        .select({
          submission: moduleSubmissions,
          module: programModules,
        })
        .from(moduleSubmissions)
        .innerJoin(
          programModules,
          eq(programModules.id, moduleSubmissions.moduleId)
        )
        .where(inArray(moduleSubmissions.programMemberId, menteeIds))
        .orderBy(desc(moduleSubmissions.submittedAt))
    : [];

  const reviewedSubmissions = submissions.filter(
    (row) => getMentorReviewStatus(row.submission.payload) === "reviewed",
  ).length;
  const followUpSubmissions = submissions.filter(
    (row) => getMentorReviewStatus(row.submission.payload) === "needs_follow_up",
  ).length;
  const completedSessions = sessions.filter(
    (session) => session.status === "completed",
  ).length;

  const latestSubmissionByMember = new Map<
    string,
    (typeof submissions)[number]
  >();
  for (const submission of submissions) {
    if (!latestSubmissionByMember.has(submission.submission.programMemberId)) {
      latestSubmissionByMember.set(
        submission.submission.programMemberId,
        submission
      );
    }
  }

  const sessionsByAssignment = new Map<string, typeof sessions>();
  for (const session of sessions) {
    const existing = sessionsByAssignment.get(session.assignmentId) ?? [];
    existing.push(session);
    sessionsByAssignment.set(session.assignmentId, existing);
  }

  return {
    mentor,
    assignments: assignments.map((row) => {
      const assignmentSessions =
        sessionsByAssignment.get(row.assignment.id) ?? [];
      const latestSubmission =
        latestSubmissionByMember.get(row.mentee.id) ?? null;

      return {
        ...row,
        sessions: assignmentSessions,
        latestSubmission,
        sessionCount: assignmentSessions.length,
      };
    }),
    totalAssignments: assignments.length,
    totalSubmissions: submissions.length,
    needsReviewCount: submissions.length - reviewedSubmissions,
    reviewedSubmissions,
    followUpSubmissions,
    totalSessions: sessions.length,
    completedSessions,
  };
}

export async function getMentorMenteeDetailData(
  mentorMemberId: string,
  menteeMemberId: string
) {
  const [mentee] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.id, menteeMemberId))
    .limit(1);

  if (!mentee) {
    return null;
  }

  const [assignmentRow] = await db
    .select({
      assignment: mentorAssignments,
      mentor: programMembers,
    })
    .from(mentorAssignments)
    .innerJoin(
      programMembers,
      eq(programMembers.id, mentorAssignments.mentorMemberId)
    )
    .where(
      and(
        eq(mentorAssignments.youthMemberId, menteeMemberId),
        eq(mentorAssignments.mentorMemberId, mentorMemberId),
        eq(mentorAssignments.status, "active")
      )
    )
    .orderBy(desc(mentorAssignments.assignedAt))
    .limit(1);

  if (!assignmentRow) {
    return null;
  }

  const [menteeAssignment, workbook] = await Promise.all([
    getActiveMentorAssignmentForMentee(menteeMemberId),
    getWorkbookMemberDashboard(menteeMemberId),
  ]);

  const submissions = await db
    .select({
      submission: moduleSubmissions,
      module: programModules,
    })
    .from(moduleSubmissions)
    .innerJoin(
      programModules,
      eq(programModules.id, moduleSubmissions.moduleId)
    )
    .where(eq(moduleSubmissions.programMemberId, menteeMemberId))
    .orderBy(desc(moduleSubmissions.submittedAt));

  const latestSubmission = submissions[0] ?? null;
  const submissionIds = submissions.map((row) => row.submission.id);
  const allAnswers = submissionIds.length
    ? await db
        .select({
          answer: moduleSubmissionAnswers,
          question: moduleQuestions,
        })
        .from(moduleSubmissionAnswers)
        .innerJoin(moduleQuestions, eq(moduleQuestions.id, moduleSubmissionAnswers.questionId))
        .where(inArray(moduleSubmissionAnswers.submissionId, submissionIds))
        .orderBy(asc(moduleQuestions.questionNumber))
    : [];

  const answersBySubmission = new Map<string, typeof allAnswers>();
  for (const answer of allAnswers) {
    const existing = answersBySubmission.get(answer.answer.submissionId) ?? [];
    existing.push(answer);
    answersBySubmission.set(answer.answer.submissionId, existing);
  }

  const answers = latestSubmission
    ? answersBySubmission.get(latestSubmission.submission.id) ?? []
    : [];

  const deliveryByModuleId = new Map(
    workbook.deliveries.map((delivery) => [delivery.moduleId, delivery]),
  );
  const submissionByModuleId = new Map(
    submissions.map((row) => [row.module.id, row]),
  );
  const moduleJourney = workbook.modules.map((module) => ({
    module,
    delivery: deliveryByModuleId.get(module.id) ?? null,
    submission: submissionByModuleId.get(module.id) ?? null,
    reviewStatus: getMentorReviewStatus(
      submissionByModuleId.get(module.id)?.submission.payload,
    ),
  }));

  return {
    mentor: assignmentRow.mentor,
    mentee,
    assignment: assignmentRow.assignment,
    sessions: menteeAssignment?.sessions ?? [],
    workbook,
    submissions,
    moduleJourney,
    latestSubmission,
    answers,
    answersBySubmission,
    formatDate,
  };
}

export async function getMentorSubmissionsData(mentorMemberId: string) {
  const dashboard = await getMentorDashboardData(mentorMemberId);
  if (!dashboard) return null;

  const menteeIds = dashboard.assignments.map((row) => row.mentee.id);
  const rows = menteeIds.length
    ? await db
        .select({
          submission: moduleSubmissions,
          module: programModules,
          mentee: programMembers,
          delivery: moduleDeliveries,
        })
        .from(moduleSubmissions)
        .innerJoin(programModules, eq(programModules.id, moduleSubmissions.moduleId))
        .innerJoin(programMembers, eq(programMembers.id, moduleSubmissions.programMemberId))
        .innerJoin(moduleDeliveries, eq(moduleDeliveries.id, moduleSubmissions.deliveryId))
        .where(inArray(moduleSubmissions.programMemberId, menteeIds))
        .orderBy(desc(moduleSubmissions.submittedAt))
    : [];

  return {
    mentor: dashboard.mentor,
    rows: rows.map((row) => ({
      ...row,
      reviewStatus: getMentorReviewStatus(row.submission.payload),
      feedback: getMentorFeedback(row.submission.payload),
      reviewedAt: getMentorReviewedAt(row.submission.payload),
    })),
    needsReviewCount: rows.filter(
      (row) => getMentorReviewStatus(row.submission.payload) !== "reviewed",
    ).length,
  };
}

export async function getMentorSubmissionDetailData(
  mentorMemberId: string,
  submissionId: string,
) {
  const [row] = await db
    .select({
      submission: moduleSubmissions,
      module: programModules,
      mentee: programMembers,
      delivery: moduleDeliveries,
      assignment: mentorAssignments,
    })
    .from(moduleSubmissions)
    .innerJoin(programModules, eq(programModules.id, moduleSubmissions.moduleId))
    .innerJoin(programMembers, eq(programMembers.id, moduleSubmissions.programMemberId))
    .innerJoin(moduleDeliveries, eq(moduleDeliveries.id, moduleSubmissions.deliveryId))
    .innerJoin(
      mentorAssignments,
      and(
        eq(mentorAssignments.youthMemberId, moduleSubmissions.programMemberId),
        eq(mentorAssignments.mentorMemberId, mentorMemberId),
        eq(mentorAssignments.status, "active"),
      ),
    )
    .where(eq(moduleSubmissions.id, submissionId))
    .limit(1);

  if (!row) return null;

  const answers = await db
    .select({
      answer: moduleSubmissionAnswers,
      question: moduleQuestions,
    })
    .from(moduleSubmissionAnswers)
    .innerJoin(moduleQuestions, eq(moduleQuestions.id, moduleSubmissionAnswers.questionId))
    .where(eq(moduleSubmissionAnswers.submissionId, submissionId))
    .orderBy(asc(moduleQuestions.questionNumber));

  return {
    ...row,
    answers,
    reviewStatus: getMentorReviewStatus(row.submission.payload),
    feedback: getMentorFeedback(row.submission.payload),
    reviewedAt: getMentorReviewedAt(row.submission.payload),
  };
}

export async function getMentorSessionsData(mentorMemberId: string) {
  const dashboard = await getMentorDashboardData(mentorMemberId);
  if (!dashboard) return null;

  return {
    mentor: dashboard.mentor,
    sessions: dashboard.assignments.flatMap((assignment) =>
      assignment.sessions.map((session) => ({
        session,
        assignment: assignment.assignment,
        mentee: assignment.mentee,
      })),
    ),
    scheduledCount: dashboard.totalSessions - dashboard.completedSessions,
    completedCount: dashboard.completedSessions,
  };
}

export async function getMenteeWorkspaceData(menteeMemberId: string) {
  const [mentee] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.id, menteeMemberId))
    .limit(1);

  if (!mentee) {
    return null;
  }

  const [assignment, workbook] = await Promise.all([
    getActiveMentorAssignmentForMentee(menteeMemberId),
    getWorkbookMemberDashboard(menteeMemberId),
  ]);

  return {
    mentee,
    assignment,
    workbook,
    formatDate,
  };
}
