import "server-only";

import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  mentorAssignments,
  mentorshipSessions,
  programMembers,
  workbookModules,
  workbookQuestions,
  workbookSubmissionAnswers,
  workbookSubmissions,
} from "@/db/schema";
import { getWorkbookMemberDashboard } from "@/lib/workbook";

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export async function getActiveMentorAssignmentForMentee(menteeMemberId: string) {
  const [row] = await db
    .select({
      assignment: mentorAssignments,
      mentor: programMembers,
    })
    .from(mentorAssignments)
    .innerJoin(
      programMembers,
      eq(programMembers.id, mentorAssignments.mentorMemberId),
    )
    .where(
      and(
        eq(mentorAssignments.youthMemberId, menteeMemberId),
        eq(mentorAssignments.status, "active"),
      ),
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
      eq(programMembers.id, mentorAssignments.youthMemberId),
    )
    .where(
      and(
        eq(mentorAssignments.mentorMemberId, mentorMemberId),
        eq(mentorAssignments.status, "active"),
      ),
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
          submission: workbookSubmissions,
          module: workbookModules,
        })
        .from(workbookSubmissions)
        .innerJoin(
          workbookModules,
          eq(workbookModules.id, workbookSubmissions.workbookModuleId),
        )
        .where(inArray(workbookSubmissions.programMemberId, menteeIds))
        .orderBy(desc(workbookSubmissions.submittedAt))
    : [];

  const latestSubmissionByMember = new Map<
    string,
    (typeof submissions)[number]
  >();
  for (const submission of submissions) {
    if (!latestSubmissionByMember.has(submission.submission.programMemberId)) {
      latestSubmissionByMember.set(
        submission.submission.programMemberId,
        submission,
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
      const assignmentSessions = sessionsByAssignment.get(row.assignment.id) ?? [];
      const latestSubmission = latestSubmissionByMember.get(row.mentee.id) ?? null;

      return {
        ...row,
        sessions: assignmentSessions,
        latestSubmission,
        sessionCount: assignmentSessions.length,
      };
    }),
    totalAssignments: assignments.length,
  };
}

export async function getMentorMenteeDetailData(
  mentorMemberId: string,
  menteeMemberId: string,
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
      eq(programMembers.id, mentorAssignments.mentorMemberId),
    )
    .where(
      and(
        eq(mentorAssignments.youthMemberId, menteeMemberId),
        eq(mentorAssignments.mentorMemberId, mentorMemberId),
        eq(mentorAssignments.status, "active"),
      ),
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
      submission: workbookSubmissions,
      module: workbookModules,
    })
    .from(workbookSubmissions)
    .innerJoin(
      workbookModules,
      eq(workbookModules.id, workbookSubmissions.workbookModuleId),
    )
    .where(eq(workbookSubmissions.programMemberId, menteeMemberId))
    .orderBy(desc(workbookSubmissions.submittedAt));

  const latestSubmission = submissions[0] ?? null;
  const answers = latestSubmission
    ? await db
        .select({
          answer: workbookSubmissionAnswers,
          question: workbookQuestions,
        })
        .from(workbookSubmissionAnswers)
        .innerJoin(
          workbookQuestions,
          eq(workbookQuestions.id, workbookSubmissionAnswers.questionId),
        )
        .where(eq(workbookSubmissionAnswers.submissionId, latestSubmission.submission.id))
        .orderBy(asc(workbookQuestions.questionNumber))
    : [];

  return {
    mentor: assignmentRow.mentor,
    mentee,
    assignment: assignmentRow.assignment,
    sessions: menteeAssignment?.sessions ?? [],
    workbook,
    submissions,
    latestSubmission,
    answers,
    formatDate,
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
