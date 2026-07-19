"use server";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import {
  certificates,
  communityEvents,
  communityPosts,
  dashboardResources,
  emailEvents,
  joinApplications,
  mentorAssignments,
  mentorshipSessions,
  moduleDeliveries,
  programModules,
  moduleSubmissions,
  opportunities,
  programEnrollments,
  programMembers,
  projectShowcases,
  users,
} from "@/db/schema";
import { getAdminEmails } from "@/lib/validations/join";
import {
  applicationRejectedEmail,
  certificateIssuedEmail,
  sendResendEmail,
  verifiedAccessEmail,
} from "@/lib/email";
import {
  cancelModuleDelivery,
  recordEngagementEvent,
  rescheduleModuleDelivery as updateScheduledModuleDelivery,
  sendModuleDeliveryNow,
  syncMemberDeliveries as syncOnboardingMemberDeliveries,
} from "@/lib/onboarding/service";
import { createCertificatePdf } from "@/lib/pdf";

type ActionResult = {
  ok: boolean;
  message: string;
};

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    throw new Error("You must be signed in.");
  }

  if (!getAdminEmails().includes(session.user.email)) {
    throw new Error("You do not have admin access.");
  }

  return session.user;
}

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalDate(input: string) {
  if (!input) return null;
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
}

function optionalText(input: string) {
  return input ? input : null;
}

async function sendAndLogEmail(
  payload: ReturnType<typeof applicationRejectedEmail>,
  context: { programMemberId?: string } = {},
) {
  try {
    const result = await sendResendEmail(payload);
    await db.insert(emailEvents).values({
      programMemberId: context.programMemberId ?? null,
      recipientEmail: Array.isArray(payload.to) ? payload.to.join(",") : payload.to,
      templateKey: payload.templateKey,
      status: result.sent ? "sent" : "skipped",
      providerId: result.providerId,
      sentAt: result.sent ? new Date() : null,
      payload: { subject: payload.subject },
    });
  } catch (error) {
    await db.insert(emailEvents).values({
      programMemberId: context.programMemberId ?? null,
      recipientEmail: Array.isArray(payload.to) ? payload.to.join(",") : payload.to,
      templateKey: payload.templateKey,
      status: "failed",
      error: error instanceof Error ? error.message : "Email failed.",
      payload: { subject: payload.subject },
    });
    throw error;
  }
}

export async function updateJoinApplicationStatus(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const applicationId = value(formData, "application_id");
    const status = value(formData, "status");

    if (!applicationId || !status) {
      return { ok: false, message: "Application and status are required." };
    }

    const [application] = await db
      .update(joinApplications)
      .set({ status, updatedAt: new Date() })
      .where(eq(joinApplications.id, applicationId))
      .returning({
        id: joinApplications.id,
        fullName: joinApplications.fullName,
        email: joinApplications.email,
        applicationType: joinApplications.applicationType,
      });

    if (!application) {
      return { ok: false, message: "Application was not found." };
    }

    const nextStep =
      status === "approved"
        ? application.applicationType === "mentor"
          ? "executive_meeting"
          : "onboarding_modules"
        : status === "rejected"
          ? "exit"
          : "application_review";

    await db
      .update(programMembers)
      .set({
        status,
        currentStep: nextStep,
        updatedAt: new Date(),
      })
      .where(eq(programMembers.joinApplicationId, applicationId));

    if (status === "rejected") {
      await sendAndLogEmail(
        applicationRejectedEmail(application.fullName, application.email),
      );
    }

    revalidatePath("/admin/join-applications");
    revalidatePath("/dashboard");
    return { ok: true, message: "Application status updated." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Status update failed.",
    };
  }
}

export async function assignMentorToYouth(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const youthMemberId = value(formData, "youth_member_id");
    const mentorMemberId = value(formData, "mentor_member_id");
    const notes = value(formData, "notes");

    if (!youthMemberId || !mentorMemberId) {
      return { ok: false, message: "Youth and mentor are required." };
    }

    const [assignment] = await db
      .insert(mentorAssignments)
      .values({
        youthMemberId,
        mentorMemberId,
        notes,
      })
      .returning({ id: mentorAssignments.id });

    await db.insert(mentorshipSessions).values(
      [1, 2, 3].map((sessionNumber) => ({
        assignmentId: assignment.id,
        sessionNumber,
      })),
    );

    await db
      .update(programMembers)
      .set({ currentStep: "monthly_virtual_sessions", updatedAt: new Date() })
      .where(eq(programMembers.id, youthMemberId));

    await db
      .update(programMembers)
      .set({ currentStep: "assigned_to_youth", updatedAt: new Date() })
      .where(eq(programMembers.id, mentorMemberId));

    revalidatePath("/admin/join-applications");
    return { ok: true, message: "Mentor assigned." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Mentor assignment failed.",
    };
  }
}

export async function updateMentorshipSession(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const sessionId = value(formData, "session_id");
    const status = value(formData, "status") || "scheduled";
    const notes = value(formData, "notes");
    const meetingUrl = value(formData, "meeting_url");
    const scheduledAt = optionalDate(value(formData, "scheduled_at"));
    const completedAt = status === "completed" ? new Date() : null;

    if (!sessionId) {
      return { ok: false, message: "Session is required." };
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

    revalidatePath("/admin/join-applications");
    return { ok: true, message: "Mentorship session updated." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Session update failed.",
    };
  }
}

export async function issueCompletionCertificate(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const memberId = value(formData, "program_member_id");
    if (!memberId) {
      return { ok: false, message: "Program member is required." };
    }

    const [member] = await db
      .select()
      .from(programMembers)
      .where(eq(programMembers.id, memberId))
      .limit(1);

    if (!member) {
      return { ok: false, message: "Program member was not found." };
    }

    const deliveries = await db
      .select({ moduleId: moduleDeliveries.moduleId })
      .from(moduleDeliveries)
      .where(eq(moduleDeliveries.programMemberId, memberId));

    const submissions = await db
      .select({ moduleId: moduleSubmissions.moduleId })
      .from(moduleSubmissions)
      .where(eq(moduleSubmissions.programMemberId, memberId));

    const expectedModules = new Set(deliveries.map((delivery) => delivery.moduleId));
    const submittedModules = new Set(submissions.map((submission) => submission.moduleId));

    if (!expectedModules.size || submittedModules.size < expectedModules.size) {
      return {
        ok: false,
        message: `All ${expectedModules.size || 12} module assignments are required before issuing a certificate.`,
      };
    }

    const certificateNumber = `AHREN-${new Date().getFullYear()}-${member.id.slice(0, 8).toUpperCase()}`;
    const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
    const certificateUrl = `${baseUrl}/api/certificates/${certificateNumber}`;
    const issuedAt = new Date();

    await db
      .insert(certificates)
      .values({
        programMemberId: member.id,
        certificateNumber,
        issuedAt,
        pdfUrl: certificateUrl,
      })
      .onConflictDoNothing({ target: certificates.certificateNumber });

    await db
      .update(programMembers)
      .set({
        status: "completed",
        currentStep: "certificate_issued",
        certificateIssuedAt: issuedAt,
        updatedAt: new Date(),
      })
      .where(eq(programMembers.id, member.id));

    await db
      .update(programEnrollments)
      .set({
        status: "completed",
        completedAt: issuedAt,
        updatedAt: new Date(),
      })
      .where(eq(programEnrollments.programMemberId, member.id));

    const formattedIssuedAt = new Intl.DateTimeFormat("en-NG", {
      dateStyle: "long",
    }).format(issuedAt);
    const certificatePdf = createCertificatePdf({
      name: member.fullName,
      certificateNumber,
      issuedAt: formattedIssuedAt,
    });

    await sendAndLogEmail(
      certificateIssuedEmail(
        member.fullName,
        member.email,
        certificateNumber,
        certificateUrl,
        certificatePdf.toString("base64"),
      ),
      { programMemberId: member.id },
    );

    revalidatePath("/admin/join-applications");
    revalidatePath("/dashboard");
    return { ok: true, message: "Certificate issued." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Certificate issue failed.",
    };
  }
}

export async function grantVerifiedStatus(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const memberId = value(formData, "program_member_id");
    if (!memberId) {
      return { ok: false, message: "Program member is required." };
    }

    const [member] = await db
      .select()
      .from(programMembers)
      .where(eq(programMembers.id, memberId))
      .limit(1);

    if (!member) {
      return { ok: false, message: "Program member was not found." };
    }

    await db
      .update(programMembers)
      .set({
        status: member.role === "mentor" ? "verified_mentor" : "verified_member",
        currentStep: "dashboard_access",
        verifiedAt: new Date(),
        loginCredentialsSentAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(programMembers.id, member.id));

    await db
      .update(users)
      .set({ emailVerified: true, updatedAt: new Date() })
      .where(eq(users.email, member.email));

    await auth.api.requestPasswordReset({
      body: {
        email: member.email,
        redirectTo: "/dashboard",
      },
      headers: await headers(),
    });

    await sendAndLogEmail(verifiedAccessEmail(member.fullName, member.email), {
      programMemberId: member.id,
    });

    revalidatePath("/admin/join-applications");
    revalidatePath("/dashboard");
    return { ok: true, message: "Verified access granted." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Verification failed.",
    };
  }
}

export async function updateMentorOnboardingMilestone(formData: FormData) {
  await requireAdmin();

  const memberId = value(formData, "program_member_id");
  const milestone = value(formData, "milestone");

  if (!memberId || !milestone) return;

  const now = new Date();
  const updates: Partial<typeof programMembers.$inferInsert> = {
    updatedAt: now,
  };

  if (milestone === "executive_meeting_completed") {
    updates.currentStep = "mentor_agreement";
  }

  if (milestone === "mentor_agreement_signed") {
    updates.currentStep = "mentor_orientation";
    updates.mentorAgreementSignedAt = now;
  }

  if (milestone === "mentor_orientation_completed") {
    updates.currentStep = "matching";
    updates.orientationCompletedAt = now;
  }

  if (milestone === "post_assignment_screening") {
    updates.currentStep = "post_assignment_screening";
    updates.status = "screening";
  }

  await db
    .update(programMembers)
    .set(updates)
    .where(and(eq(programMembers.id, memberId), eq(programMembers.role, "mentor")));

  revalidatePath(`/admin/program-members/${memberId}`);
  revalidatePath("/admin/join-applications");
}

export async function createDashboardResource(formData: FormData) {
  await requireAdmin();

  const audience = value(formData, "audience") || "all";
  const category = value(formData, "category") || "Resource";
  const title = value(formData, "title");
  const summary = value(formData, "summary");
  const url = value(formData, "url");
  const isPublished = value(formData, "is_published") === "true";

  if (!title) return;

  await db.insert(dashboardResources).values({
    audience,
    category,
    title,
    summary: optionalText(summary),
    url: optionalText(url),
    isPublished,
  });

  revalidatePath("/admin/content");
  revalidatePath("/dashboard");
}

export async function createCommunityEvent(formData: FormData) {
  await requireAdmin();

  const audience = value(formData, "audience") || "all";
  const title = value(formData, "title");
  const summary = value(formData, "summary");
  const startsAt = optionalDate(value(formData, "starts_at"));
  const location = value(formData, "location");
  const meetingUrl = value(formData, "meeting_url");
  const status = value(formData, "status") || "published";

  if (!title || !startsAt) return;

  await db.insert(communityEvents).values({
    audience,
    title,
    summary: optionalText(summary),
    startsAt,
    location: optionalText(location),
    meetingUrl: optionalText(meetingUrl),
    status,
  });

  revalidatePath("/admin/content");
  revalidatePath("/dashboard");
}

export async function createOpportunity(formData: FormData) {
  await requireAdmin();

  const audience = value(formData, "audience") || "all";
  const type = value(formData, "type") || "partnership";
  const title = value(formData, "title");
  const summary = value(formData, "summary");
  const url = value(formData, "url");
  const status = value(formData, "status") || "published";

  if (!title) return;

  await db.insert(opportunities).values({
    audience,
    type,
    title,
    summary: optionalText(summary),
    url: optionalText(url),
    status,
  });

  revalidatePath("/admin/content");
  revalidatePath("/dashboard");
}

export async function updateCommunityPostStatus(formData: FormData) {
  await requireAdmin();

  const postId = value(formData, "post_id");
  const status = value(formData, "status");

  if (!postId || !status) return;

  await db
    .update(communityPosts)
    .set({ status, updatedAt: new Date() })
    .where(eq(communityPosts.id, postId));

  revalidatePath("/admin/content");
  revalidatePath("/dashboard");
}

export async function updateProjectShowcaseStatus(formData: FormData) {
  await requireAdmin();

  const projectId = value(formData, "project_id");
  const status = value(formData, "status");

  if (!projectId || !status) return;

  await db
    .update(projectShowcases)
    .set({ status, updatedAt: new Date() })
    .where(eq(projectShowcases.id, projectId));

  revalidatePath("/admin/content");
  revalidatePath("/dashboard");
}

export async function resendModuleDelivery(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const deliveryId = value(formData, "delivery_id");
    if (!deliveryId) {
      return { ok: false, message: "Delivery is required." };
    }

    await sendModuleDeliveryNow(deliveryId, { source: "admin_resend" });

    revalidatePath("/admin/onboarding");
    revalidatePath("/admin/email-events");
    revalidatePath("/admin/engagement");
    return { ok: true, message: "Module email resent." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Resend failed.",
    };
  }
}

export async function rescheduleModuleDeliveryAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const deliveryId = value(formData, "delivery_id");
    const scheduledAt = optionalDate(value(formData, "scheduled_for"));

    if (!deliveryId || !scheduledAt) {
      return { ok: false, message: "Delivery and schedule date are required." };
    }

    await updateScheduledModuleDelivery(deliveryId, scheduledAt);

    revalidatePath("/admin/onboarding");
    revalidatePath("/admin/engagement");
    return { ok: true, message: "Delivery rescheduled." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Reschedule failed.",
    };
  }
}

export async function retryFailedModuleDelivery(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const deliveryId = value(formData, "delivery_id");
    if (!deliveryId) {
      return { ok: false, message: "Delivery is required." };
    }

    const [delivery] = await db
      .select()
      .from(moduleDeliveries)
      .where(eq(moduleDeliveries.id, deliveryId))
      .limit(1);

    if (!delivery) {
      return { ok: false, message: "Delivery was not found." };
    }

    await updateScheduledModuleDelivery(
      deliveryId,
      delivery.scheduledFor ?? new Date(),
    );
    await sendModuleDeliveryNow(deliveryId, { source: "admin_retry" });

    revalidatePath("/admin/onboarding");
    revalidatePath("/admin/email-events");
    revalidatePath("/admin/engagement");
    return { ok: true, message: "Failed delivery retried." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Retry failed.",
    };
  }
}

export async function cancelModuleDeliveryAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const deliveryId = value(formData, "delivery_id");
    if (!deliveryId) {
      return { ok: false, message: "Delivery is required." };
    }

    await cancelModuleDelivery(deliveryId);

    revalidatePath("/admin/onboarding");
    revalidatePath("/admin/engagement");
    return { ok: true, message: "Delivery cancelled." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Cancel failed.",
    };
  }
}

export async function syncMemberDeliveriesAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const memberId = value(formData, "program_member_id");
    if (!memberId) {
      return { ok: false, message: "Program member is required." };
    }

    const result = await syncOnboardingMemberDeliveries(memberId);

    revalidatePath("/admin/onboarding");
    revalidatePath(`/admin/program-members/${memberId}`);
    revalidatePath("/admin/join-applications");
    return {
      ok: true,
      message: `Delivery sync completed. ${result.created} delivery records created.`,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Delivery sync failed.",
    };
  }
}

export async function markSubmissionReviewed(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const reviewer = await requireAdmin();

    const submissionId = value(formData, "submission_id");
    const status = value(formData, "status") || "reviewed";

    if (!submissionId) {
      return { ok: false, message: "Submission is required." };
    }

    const [submission] = await db
      .select({
        submission: moduleSubmissions,
        member: programMembers,
        module: programModules,
      })
      .from(moduleSubmissions)
      .innerJoin(programMembers, eq(programMembers.id, moduleSubmissions.programMemberId))
      .innerJoin(programModules, eq(programModules.id, moduleSubmissions.moduleId))
      .where(eq(moduleSubmissions.id, submissionId))
      .limit(1);

    if (!submission) {
      return { ok: false, message: "Submission was not found." };
    }

    const now = new Date();
    await db
      .update(moduleSubmissions)
      .set({
        status,
        payload: {
          ...(submission.submission.payload ?? {}),
          reviewedAt: now.toISOString(),
          reviewedBy: reviewer.email,
          reviewStatus: status,
        },
        updatedAt: now,
      })
      .where(eq(moduleSubmissions.id, submissionId));

    await recordEngagementEvent({
      eventType: "submission_reviewed",
      programMemberId: submission.member.id,
      enrollmentId: submission.submission.enrollmentId,
      moduleId: submission.module.id,
      deliveryId: submission.submission.deliveryId,
      metadata: {
        reviewStatus: status,
        reviewedBy: reviewer.email,
      },
    });

    revalidatePath("/admin/module-submissions");
    revalidatePath(`/admin/program-members/${submission.member.id}`);
    return { ok: true, message: "Submission marked as reviewed." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Review update failed.",
    };
  }
}
