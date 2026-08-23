"use server";

import { and, eq, inArray } from "drizzle-orm";
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
import {
  coerceTrainingApplicationDateInput,
  sanitizeTrainingApplicationHtml,
} from "@/lib/application-settings.shared";
import { upsertTrainingApplicationSettings } from "@/lib/application-settings";
import { getAdminEmails } from "@/lib/validations/join";
import {
  applicationRejectedEmail,
  certificateIssuedEmail,
  sendEmail,
  verifiedAccessEmail,
} from "@/lib/email";
import {
  cancelModuleDelivery,
  recordEngagementEvent,
  rescheduleModuleDelivery as updateScheduledModuleDelivery,
  sendModuleDeliveryNow,
  syncMemberDeliveries as syncOnboardingMemberDeliveries,
} from "@/lib/onboarding/service";
import { syncJoinApplicationProjection } from "@/lib/admin/join-applications";
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

async function getMemberJoinApplicationPath(memberId: string) {
  const [member] = await db
    .select({
      joinApplicationId: programMembers.joinApplicationId,
    })
    .from(programMembers)
    .where(eq(programMembers.id, memberId))
    .limit(1);

  return member?.joinApplicationId
    ? `/admin/join-applications/${member.joinApplicationId}`
    : "/admin/join-applications";
}

async function getDeliveryJoinApplicationPath(deliveryId: string) {
  const [delivery] = await db
    .select({
      programMemberId: moduleDeliveries.programMemberId,
    })
    .from(moduleDeliveries)
    .where(eq(moduleDeliveries.id, deliveryId))
    .limit(1);

  return delivery?.programMemberId
    ? getMemberJoinApplicationPath(delivery.programMemberId)
    : "/admin/join-applications";
}

async function assignMentorToYouthMembersInternal({
  mentorMemberId,
  youthMemberIds,
  notes,
}: {
  mentorMemberId: string;
  youthMemberIds: string[];
  notes?: string | null;
}) {
  const uniqueYouthMemberIds = Array.from(
    new Set(youthMemberIds.map((value) => value.trim()).filter(Boolean)),
  );

  if (!mentorMemberId || !uniqueYouthMemberIds.length) {
    return { ok: false, message: "Mentor and at least one mentee are required." };
  }

  const [mentor] = await db
    .select({
      id: programMembers.id,
      fullName: programMembers.fullName,
      joinApplicationId: programMembers.joinApplicationId,
    })
    .from(programMembers)
    .where(and(eq(programMembers.id, mentorMemberId), eq(programMembers.role, "mentor")))
    .limit(1);

  if (!mentor) {
    return { ok: false, message: "Selected mentor was not found." };
  }

  const youthMembers = await db
    .select({
      id: programMembers.id,
      joinApplicationId: programMembers.joinApplicationId,
      fullName: programMembers.fullName,
      email: programMembers.email,
    })
    .from(programMembers)
    .where(
      and(
        eq(programMembers.role, "youth"),
        inArray(programMembers.id, uniqueYouthMemberIds),
      ),
    );

  if (!youthMembers.length) {
    return { ok: false, message: "Selected mentees were not found." };
  }

  const existingAssignments = await db
    .select({
      id: mentorAssignments.id,
      youthMemberId: mentorAssignments.youthMemberId,
    })
    .from(mentorAssignments)
    .where(
      and(
        eq(mentorAssignments.status, "active"),
        inArray(mentorAssignments.youthMemberId, youthMembers.map((item) => item.id)),
      ),
    );

  if (existingAssignments.length) {
    await db
      .update(mentorAssignments)
      .set({
        status: "ended",
        endedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        inArray(
          mentorAssignments.id,
          existingAssignments.map((assignment) => assignment.id),
        ),
      );
  }

  const assignmentRows = [];
  const now = new Date();

  for (const youthMember of youthMembers) {
    const [assignment] = await db
      .insert(mentorAssignments)
      .values({
        youthMemberId: youthMember.id,
        mentorMemberId,
        notes,
        assignedAt: now,
      })
      .returning({ id: mentorAssignments.id });

    assignmentRows.push(assignment);

    await db.insert(mentorshipSessions).values(
      [1, 2, 3].map((sessionNumber) => ({
        assignmentId: assignment.id,
        sessionNumber,
      })),
    );

    await db
      .update(programMembers)
      .set({ currentStep: "monthly_virtual_sessions", updatedAt: new Date() })
      .where(eq(programMembers.id, youthMember.id));
  }

  await db
    .update(programMembers)
    .set({ currentStep: "assigned_to_youth", updatedAt: new Date() })
    .where(eq(programMembers.id, mentorMemberId));

  await Promise.all(
    youthMembers.map((member) => syncJoinApplicationProjection(member.joinApplicationId)),
  );

  const mentorPath = await getMemberJoinApplicationPath(mentorMemberId);
  const youthPaths = await Promise.all(
    youthMembers.map((member) => getMemberJoinApplicationPath(member.id)),
  );

  revalidatePath("/admin/join-applications");
  revalidatePath("/admin/assignments");
  revalidatePath(mentorPath);
  youthPaths.forEach((path) => revalidatePath(path));

  return {
    ok: true,
    message: `Assigned mentor to ${youthMembers.length} mentee${youthMembers.length === 1 ? "" : "s"}.`,
    assignmentIds: assignmentRows.map((row) => row.id),
  };
}

async function sendAndLogEmail(
  payload: ReturnType<typeof applicationRejectedEmail>,
  context: { programMemberId?: string } = {},
) {
  try {
    const result = await sendEmail(payload);
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

    await syncJoinApplicationProjection(applicationId);

    revalidatePath("/admin/join-applications");
    revalidatePath(`/admin/join-applications/${applicationId}`);
    revalidatePath("/dashboard");
    return { ok: true, message: "Application status updated." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Status update failed.",
    };
  }
}

export async function updateTrainingApplicationSettings(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const applicationsOpenAt = coerceTrainingApplicationDateInput(
      formData.get("applications_open_at"),
    );
    const applicationsCloseAt = coerceTrainingApplicationDateInput(
      formData.get("applications_close_at"),
    );
    const forceClosed = String(formData.get("force_closed") ?? "") === "true";
    const closedTitle = value(formData, "closed_title") || "Applications Closed.";
    const closedMessageHtml = sanitizeTrainingApplicationHtml(
      value(formData, "closed_message_html") ||
        "<p>Our 6-Week Tech & Creativity Mentorship Program is now fully booked. Thank you to everyone who applied!</p>",
    );

    await upsertTrainingApplicationSettings({
      applicationsOpenAt,
      applicationsCloseAt,
      forceClosed,
      closedTitle,
      closedMessageHtml,
    });

    revalidatePath("/training/apply");
    revalidatePath("/admin/join-applications");

    return {
      ok: true,
      message: "Application window updated.",
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Application window update failed.",
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
    const result = await assignMentorToYouthMembersInternal({
      mentorMemberId,
      youthMemberIds: [youthMemberId],
      notes,
    });

    if (!result.ok) {
      return result;
    }

    return { ok: true, message: result.message };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Mentor assignment failed.",
    };
  }
}

export async function assignMentorToYouthGroup(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const mentorMemberId = value(formData, "mentor_member_id");
    const notes = value(formData, "notes");
    const youthMemberIds = formData.getAll("youth_member_ids").map((value) =>
      String(value ?? "").trim(),
    );

    const result = await assignMentorToYouthMembersInternal({
      mentorMemberId,
      youthMemberIds,
      notes,
    });

    if (!result.ok) {
      return result;
    }

    return { ok: true, message: result.message };
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

    await syncJoinApplicationProjection(member.joinApplicationId);

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
    revalidatePath(`/admin/join-applications/${member.joinApplicationId}`);
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

    await syncJoinApplicationProjection(member.joinApplicationId);

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
    revalidatePath(`/admin/join-applications/${member.joinApplicationId}`);
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

  const [member] = await db
    .select({
      joinApplicationId: programMembers.joinApplicationId,
    })
    .from(programMembers)
    .where(eq(programMembers.id, memberId))
    .limit(1);

  if (member) {
    await syncJoinApplicationProjection(member.joinApplicationId);
  }

  if (member?.joinApplicationId) {
    revalidatePath(`/admin/join-applications/${member.joinApplicationId}`);
  }
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

  revalidatePath("/admin/opportunities");
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

  revalidatePath("/admin/events");
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

  revalidatePath("/admin/community-posts");
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

  revalidatePath("/admin/project-showcases");
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
    revalidatePath(await getDeliveryJoinApplicationPath(deliveryId));
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
    revalidatePath(await getDeliveryJoinApplicationPath(deliveryId));
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
    revalidatePath(await getDeliveryJoinApplicationPath(deliveryId));
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
    revalidatePath(await getDeliveryJoinApplicationPath(deliveryId));
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
    revalidatePath(await getMemberJoinApplicationPath(memberId));
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
