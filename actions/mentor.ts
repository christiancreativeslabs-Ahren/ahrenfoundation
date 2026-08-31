"use server";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import {
  engagementEvents,
  mentorAssignments,
  mentorshipSessions,
  moduleSubmissions,
  programMembers,
} from "@/db/schema";

type ActionResult = {
  ok: boolean;
  message: string;
};

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalDate(raw: string) {
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function requireMentorMember() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect("/mentor/login");
  }

  const [mentor] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.email, session.user.email))
    .limit(1);

  if (!mentor || mentor.role !== "mentor") {
    redirect("/mentor/login");
  }

  return mentor;
}

export async function reviewMenteeWorkbookSubmission(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const mentor = await requireMentorMember();
    const submissionId = value(formData, "submission_id");
    const status = value(formData, "review_status") || "reviewed";
    const feedback = value(formData, "feedback");

    if (!submissionId) {
      return { ok: false, message: "Submission is required." };
    }

    const [row] = await db
      .select({
        submission: moduleSubmissions,
        assignment: mentorAssignments,
      })
      .from(moduleSubmissions)
      .innerJoin(
        mentorAssignments,
        and(
          eq(mentorAssignments.youthMemberId, moduleSubmissions.programMemberId),
          eq(mentorAssignments.mentorMemberId, mentor.id),
          eq(mentorAssignments.status, "active"),
        ),
      )
      .where(eq(moduleSubmissions.id, submissionId))
      .limit(1);

    if (!row) {
      return { ok: false, message: "Submission was not found for your assigned mentees." };
    }

    const now = new Date();
    const payload =
      row.submission.payload && typeof row.submission.payload === "object"
        ? row.submission.payload
        : {};

    await db
      .update(moduleSubmissions)
      .set({
        payload: {
          ...payload,
          mentorFeedback: feedback,
          mentorReviewStatus: status,
          mentorReviewedAt: now.toISOString(),
          mentorReviewerId: mentor.id,
          mentorReviewerName: mentor.fullName,
          mentorReviewerEmail: mentor.email,
        },
        updatedAt: now,
      })
      .where(eq(moduleSubmissions.id, submissionId));

    await db.insert(engagementEvents).values({
      eventType: "mentor_submission_reviewed",
      programMemberId: row.submission.programMemberId,
      enrollmentId: row.submission.enrollmentId,
      moduleId: row.submission.moduleId,
      deliveryId: row.submission.deliveryId,
      metadata: {
        submissionId,
        mentorMemberId: mentor.id,
        reviewStatus: status,
      },
    });

    revalidatePath("/mentor/dashboard");
    revalidatePath("/mentor/submissions");
    revalidatePath(`/mentor/submissions/${submissionId}`);
    revalidatePath(`/mentor/mentees/${row.submission.programMemberId}`);

    return { ok: true, message: "Workbook submission review saved." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Review update failed.",
    };
  }
}

export async function updateMentorSession(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const mentor = await requireMentorMember();
    const sessionId = value(formData, "session_id");
    const status = value(formData, "status") || "scheduled";
    const notes = value(formData, "notes");
    const meetingUrl = value(formData, "meeting_url");
    const scheduledAt = optionalDate(value(formData, "scheduled_at"));
    const completedAt = status === "completed" ? new Date() : null;

    if (!sessionId) {
      return { ok: false, message: "Session is required." };
    }

    const [row] = await db
      .select({
        session: mentorshipSessions,
        assignment: mentorAssignments,
      })
      .from(mentorshipSessions)
      .innerJoin(
        mentorAssignments,
        eq(mentorAssignments.id, mentorshipSessions.assignmentId),
      )
      .where(
        and(
          eq(mentorshipSessions.id, sessionId),
          eq(mentorAssignments.mentorMemberId, mentor.id),
          eq(mentorAssignments.status, "active"),
        ),
      )
      .limit(1);

    if (!row) {
      return { ok: false, message: "Session was not found for your mentees." };
    }

    await db
      .update(mentorshipSessions)
      .set({
        status,
        notes,
        meetingUrl,
        scheduledAt,
        completedAt,
        updatedAt: new Date(),
      })
      .where(eq(mentorshipSessions.id, sessionId));

    revalidatePath("/mentor/dashboard");
    revalidatePath("/mentor/sessions");
    revalidatePath(`/mentor/mentees/${row.assignment.youthMemberId}`);

    return { ok: true, message: "Mentorship session updated." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Session update failed.",
    };
  }
}
