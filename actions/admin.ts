"use server";

import { and, eq, inArray, or } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth, takeCapturedMagicLink } from "@/lib/auth/auth";
import { db } from "@/db";
import {
  accounts,
  bulkEmailCampaignRecipients,
  certificates,
  communityEvents,
  communityPosts,
  dashboardResources,
  emailEvents,
  engagementEvents,
  joinApplications,
  joinApplicationListItems,
  mentorAssignments,
  mentorshipSessions,
  moduleDeliveries,
  moduleSubmissionAnswers,
  programModules,
  moduleSubmissions,
  opportunities,
  programEnrollments,
  programMembers,
  projectShowcases,
  sessions,
  users,
  verifications,
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
} from "@/lib/email";
import {
  cancelModuleDelivery,
  enrollMemberInWorkbookProgram,
  recordEngagementEvent,
  rescheduleModuleDelivery as updateScheduledModuleDelivery,
  sendModuleDeliveryNow,
  syncMemberWorkbookDeliveries,
} from "@/lib/workbook/service";
import { syncJoinApplicationProjection } from "@/lib/admin/join-applications";
import { createCertificatePdf } from "@/lib/pdf";

type ActionResult = {
  ok: boolean;
  message: string;
  url?: string;
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
function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] ?? fullName,
    lastName: parts.slice(1).join(" ") || null,
  };
}

async function ensureProgramMemberLoginAccess(memberId: string) {
  const [member] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.id, memberId))
    .limit(1);

  if (!member) {
    throw new Error("Program member was not found.");
  }

  if (member.role !== "mentor" && member.role !== "youth") {
    throw new Error("Only mentors and mentees can receive login links.");
  }

  const { firstName, lastName } = splitName(member.fullName);
  const now = new Date();
  const [user] = await db
    .insert(users)
    .values({
      email: member.email,
      name: member.fullName,
      firstName,
      lastName,
      emailVerified: true,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        name: member.fullName,
        firstName,
        lastName,
        emailVerified: true,
        updatedAt: now,
      },
    })
    .returning({ id: users.id });

  await db
    .update(programMembers)
    .set({
      userId: user.id,
      status: member.role === "mentor" ? "verified_mentor" : "verified_member",
      currentStep: "dashboard_access",
      verifiedAt: member.verifiedAt ?? now,
      loginCredentialsSentAt: now,
      updatedAt: now,
    })
    .where(eq(programMembers.id, member.id));

  if (member.role === "youth") {
    await enrollMemberInWorkbookProgram(member.id, now);
    await syncMemberWorkbookDeliveries(member.id);
  }

  await syncJoinApplicationProjection(member.joinApplicationId);

  await auth.api.signInMagicLink({
    body: {
      email: member.email,
      name: member.fullName,
      callbackURL:
        member.role === "mentor" ? "/mentor/dashboard" : "/dashboard",
      errorCallbackURL:
        member.role === "mentor" ? "/mentor/login" : "/hub/login",
    },
    headers: await headers(),
  });

  return member;
}

async function ensureProgramMemberQuickLoginAccess(memberId: string) {
  const [member] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.id, memberId))
    .limit(1);

  if (!member) {
    throw new Error("Program member was not found.");
  }

  if (member.role !== "mentor" && member.role !== "youth") {
    throw new Error("Only mentors and mentees can receive login links.");
  }

  const { firstName, lastName } = splitName(member.fullName);
  const now = new Date();
  const [user] = await db
    .insert(users)
    .values({
      email: member.email,
      name: member.fullName,
      firstName,
      lastName,
      emailVerified: true,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        name: member.fullName,
        firstName,
        lastName,
        emailVerified: true,
        updatedAt: now,
      },
    })
    .returning({ id: users.id });

  await db
    .update(programMembers)
    .set({
      userId: user.id,
      status: member.role === "mentor" ? "verified_mentor" : "verified_member",
      currentStep: "dashboard_access",
      verifiedAt: member.verifiedAt ?? now,
      loginCredentialsSentAt: now,
      updatedAt: now,
    })
    .where(eq(programMembers.id, member.id));

  if (member.role === "youth") {
    await enrollMemberInWorkbookProgram(member.id, now);
    await syncMemberWorkbookDeliveries(member.id);
  }

  await syncJoinApplicationProjection(member.joinApplicationId);

  // Generate the magic link WITHOUT sending email
  const captureId = crypto.randomUUID();

  await auth.api.signInMagicLink({
    body: {
      email: member.email,
      name: member.fullName,
      callbackURL:
        member.role === "mentor" ? "/mentor/dashboard" : "/dashboard",
      errorCallbackURL:
        member.role === "mentor" ? "/mentor/login" : "/hub/login",
      metadata: { captureId },
    },
    headers: await headers(),
  });

  const magicLinkUrl = takeCapturedMagicLink(captureId);

  if (!magicLinkUrl) {
    throw new Error("Failed to generate login link.");
  }

  return { member, magicLinkUrl };

  // await auth.api.signInMagicLink({
  //   body: {
  //     email: member.email,
  //     name: member.fullName,
  //     callbackURL:
  //       member.role === "mentor" ? "/mentor/dashboard" : "/dashboard",
  //     errorCallbackURL:
  //       member.role === "mentor" ? "/mentor/login" : "/hub/login",
  //   },
  //   headers: await headers(),
  // });

  // return member;
}

export async function registerProgramMemberAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    const role = value(formData, "role");
    const fullName = value(formData, "full_name");
    const email = value(formData, "email").toLowerCase();
    const phoneNumber = value(formData, "phone_number");
    const location = value(formData, "location");
    const notes = value(formData, "notes");
    const sendLogin = String(formData.get("send_login") ?? "") === "true";

    if (role !== "mentor" && role !== "youth") {
      return { ok: false, message: "Choose mentor or mentee." };
    }
    if (!fullName || !email) {
      return { ok: false, message: "Name and email are required." };
    }

    const { firstName, lastName } = splitName(fullName);
    const now = new Date();
    const memberStatus =
      role === "mentor" ? "verified_mentor" : "verified_member";
    const payload = {
      source: "admin_direct_registration",
      notes,
      createdByAdminEmail: admin.email,
    };

    const [application] = await db
      .insert(joinApplications)
      .values({
        applicationType: role,
        fullName,
        email,
        phoneNumber,
        location,
        status: "approved",
        consent: true,
        payload,
      })
      .returning();

    const [user] = await db
      .insert(users)
      .values({
        email,
        name: fullName,
        firstName,
        lastName,
        emailVerified: true,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          name: fullName,
          firstName,
          lastName,
          emailVerified: true,
          updatedAt: now,
        },
      })
      .returning({ id: users.id });

    const [member] = await db
      .insert(programMembers)
      .values({
        joinApplicationId: application.id,
        userId: user.id,
        role,
        fullName,
        email,
        status: memberStatus,
        currentStep: "dashboard_access",
        verifiedAt: now,
        loginCredentialsSentAt: sendLogin ? now : null,
        payload,
      })
      .returning({ id: programMembers.id });

    await syncJoinApplicationProjection(application.id);

    if (role === "youth") {
      await enrollMemberInWorkbookProgram(member.id, now);
      await syncMemberWorkbookDeliveries(member.id);
    }

    if (sendLogin) {
      await auth.api.signInMagicLink({
        body: {
          email,
          name: fullName,
          callbackURL: role === "mentor" ? "/mentor/dashboard" : "/dashboard",
          errorCallbackURL: role === "mentor" ? "/mentor/login" : "/hub/login",
        },
        headers: await headers(),
      });
    }

    revalidatePath("/admin/mentors");
    revalidatePath("/admin/mentees");
    revalidatePath("/admin/join-applications");
    revalidatePath(`/admin/join-applications/${application.id}`);

    return {
      ok: true,
      message: `${role === "mentor" ? "Mentor" : "Mentee"} registered.`,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Member registration failed.",
    };
  }
}

export async function deactivateProgramMemberAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const memberId = value(formData, "program_member_id");
    if (!memberId) return { ok: false, message: "Program member is required." };

    const [member] = await db
      .select()
      .from(programMembers)
      .where(eq(programMembers.id, memberId))
      .limit(1);

    if (!member) return { ok: false, message: "Program member was not found." };

    const now = new Date();
    const payload =
      member.payload && typeof member.payload === "object"
        ? member.payload
        : {};

    await db.transaction(async (tx) => {
      await tx
        .update(programMembers)
        .set({
          status: "application_received",
          currentStep: "application_review",
          payload: {
            ...payload,
            isDeleted: true,
            deactivatedAt: now.toISOString(),
          },
          updatedAt: now,
        })
        .where(eq(programMembers.id, member.id));

      if (member.userId) {
        await tx
          .update(users)
          .set({ emailVerified: false, updatedAt: now })
          .where(eq(users.id, member.userId));
      }

      await tx
        .update(mentorAssignments)
        .set({ status: "inactive", endedAt: now, updatedAt: now })
        .where(
          or(
            eq(mentorAssignments.youthMemberId, member.id),
            eq(mentorAssignments.mentorMemberId, member.id),
          ),
        );

      await tx
        .update(moduleDeliveries)
        .set({ status: "cancelled", updatedAt: now })
        .where(eq(moduleDeliveries.programMemberId, member.id));

      await tx
        .update(programEnrollments)
        .set({ status: "inactive", updatedAt: now })
        .where(eq(programEnrollments.programMemberId, member.id));
    });

    await syncJoinApplicationProjection(member.joinApplicationId);
    revalidatePath("/admin/mentors");
    revalidatePath("/admin/mentees");
    revalidatePath(`/admin/mentors/${member.id}`);
    revalidatePath(`/admin/mentees/${member.id}`);
    revalidatePath("/admin/join-applications");

    return { ok: true, message: "Account deactivated." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Deactivate failed.",
    };
  }
}

export async function reactivateProgramMemberAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const memberId = value(formData, "program_member_id");
    if (!memberId) return { ok: false, message: "Program member is required." };

    const member = await ensureProgramMemberLoginAccess(memberId);
    const payload =
      member.payload && typeof member.payload === "object"
        ? member.payload
        : {};

    await db
      .update(programMembers)
      .set({
        payload: {
          ...payload,
          isDeleted: false,
          reactivatedAt: new Date().toISOString(),
        },
        updatedAt: new Date(),
      })
      .where(eq(programMembers.id, member.id));

    revalidatePath("/admin/mentors");
    revalidatePath("/admin/mentees");
    revalidatePath(`/admin/mentors/${member.id}`);
    revalidatePath(`/admin/mentees/${member.id}`);
    revalidatePath("/admin/join-applications");

    return { ok: true, message: "Account reactivated and login link sent." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Reactivate failed.",
    };
  }
}

export async function permanentlyDeleteProgramMemberAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const memberId = value(formData, "program_member_id");
    const confirmation = value(formData, "confirmation");
    if (!memberId) return { ok: false, message: "Program member is required." };

    const [member] = await db
      .select()
      .from(programMembers)
      .where(eq(programMembers.id, memberId))
      .limit(1);

    if (!member) return { ok: false, message: "Program member was not found." };
    if (confirmation !== member.email) {
      return {
        ok: false,
        message: "Type the member email to confirm deletion.",
      };
    }

    const assignments = await db
      .select({ id: mentorAssignments.id })
      .from(mentorAssignments)
      .where(
        or(
          eq(mentorAssignments.youthMemberId, member.id),
          eq(mentorAssignments.mentorMemberId, member.id),
        ),
      );
    const assignmentIds = assignments.map((assignment) => assignment.id);
    const submissions = await db
      .select({ id: moduleSubmissions.id })
      .from(moduleSubmissions)
      .where(eq(moduleSubmissions.programMemberId, member.id));
    const submissionIds = submissions.map((submission) => submission.id);

    await db.transaction(async (tx) => {
      if (assignmentIds.length) {
        await tx
          .delete(mentorshipSessions)
          .where(inArray(mentorshipSessions.assignmentId, assignmentIds));
      }

      if (submissionIds.length) {
        await tx
          .delete(moduleSubmissionAnswers)
          .where(inArray(moduleSubmissionAnswers.submissionId, submissionIds));
      }

      await tx
        .delete(moduleSubmissions)
        .where(eq(moduleSubmissions.programMemberId, member.id));
      await tx
        .delete(emailEvents)
        .where(eq(emailEvents.programMemberId, member.id));
      await tx
        .delete(engagementEvents)
        .where(eq(engagementEvents.programMemberId, member.id));
      await tx
        .delete(certificates)
        .where(eq(certificates.programMemberId, member.id));
      await tx
        .delete(moduleDeliveries)
        .where(eq(moduleDeliveries.programMemberId, member.id));
      await tx
        .delete(programEnrollments)
        .where(eq(programEnrollments.programMemberId, member.id));
      await tx
        .delete(mentorAssignments)
        .where(
          or(
            eq(mentorAssignments.youthMemberId, member.id),
            eq(mentorAssignments.mentorMemberId, member.id),
          ),
        );
      await tx
        .delete(bulkEmailCampaignRecipients)
        .where(eq(bulkEmailCampaignRecipients.programMemberId, member.id));
      await tx
        .delete(projectShowcases)
        .where(eq(projectShowcases.programMemberId, member.id));
      await tx
        .delete(communityPosts)
        .where(eq(communityPosts.programMemberId, member.id));
      await tx.delete(programMembers).where(eq(programMembers.id, member.id));
      await tx
        .delete(joinApplicationListItems)
        .where(
          eq(
            joinApplicationListItems.joinApplicationId,
            member.joinApplicationId,
          ),
        );
      await tx
        .delete(joinApplications)
        .where(eq(joinApplications.id, member.joinApplicationId));

      if (member.userId) {
        const siblings = await tx
          .select({ id: programMembers.id })
          .from(programMembers)
          .where(eq(programMembers.userId, member.userId))
          .limit(1);

        if (!siblings.length) {
          await tx.delete(sessions).where(eq(sessions.userId, member.userId));
          await tx.delete(accounts).where(eq(accounts.userId, member.userId));
          await tx
            .delete(verifications)
            .where(eq(verifications.identifier, member.email));
          await tx.delete(users).where(eq(users.id, member.userId));
        }
      }
    });

    revalidatePath("/admin/mentors");
    revalidatePath("/admin/mentees");
    revalidatePath("/admin/join-applications");

    return { ok: true, message: "Account permanently deleted." };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Permanent delete failed.",
    };
  }
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
    return {
      ok: false,
      message: "Mentor and at least one mentee are required.",
    };
  }

  const [mentor] = await db
    .select({
      id: programMembers.id,
      fullName: programMembers.fullName,
      joinApplicationId: programMembers.joinApplicationId,
    })
    .from(programMembers)
    .where(
      and(
        eq(programMembers.id, mentorMemberId),
        eq(programMembers.role, "mentor"),
      ),
    )
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
        inArray(
          mentorAssignments.youthMemberId,
          youthMembers.map((item) => item.id),
        ),
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
    youthMembers.map((member) =>
      syncJoinApplicationProjection(member.joinApplicationId),
    ),
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
      recipientEmail: Array.isArray(payload.to)
        ? payload.to.join(",")
        : payload.to,
      templateKey: payload.templateKey,
      status: result.sent ? "sent" : "skipped",
      providerId: result.providerId,
      sentAt: result.sent ? new Date() : null,
      payload: { subject: payload.subject },
    });
  } catch (error) {
    await db.insert(emailEvents).values({
      programMemberId: context.programMemberId ?? null,
      recipientEmail: Array.isArray(payload.to)
        ? payload.to.join(",")
        : payload.to,
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
          : "program_modules"
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
    const closedTitle =
      value(formData, "closed_title") || "Applications Closed.";
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
      message:
        error instanceof Error ? error.message : "Mentor assignment failed.",
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
    const youthMemberIds = formData
      .getAll("youth_member_ids")
      .map((value) => String(value ?? "").trim());

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
      message:
        error instanceof Error ? error.message : "Mentor assignment failed.",
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
      message:
        error instanceof Error ? error.message : "Session update failed.",
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

    const expectedModules = new Set(
      deliveries.map((delivery) => delivery.moduleId),
    );
    const submittedModules = new Set(
      submissions.map((submission) => submission.moduleId),
    );

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
      message:
        error instanceof Error ? error.message : "Certificate issue failed.",
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

    const member = await ensureProgramMemberLoginAccess(memberId);

    revalidatePath("/admin/join-applications");
    revalidatePath(`/admin/join-applications/${member.joinApplicationId}`);
    revalidatePath(
      `/admin/${member.role === "mentor" ? "mentors" : "mentees"}/${member.id}`,
    );
    revalidatePath(`/admin/program-members/${member.id}`);
    revalidatePath("/dashboard");
    return { ok: true, message: "Login link sent." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Verification failed.",
    };
  }
}

export async function sendProgramMemberLoginLinkAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const memberId = value(formData, "program_member_id");
    if (!memberId) {
      return { ok: false, message: "Program member is required." };
    }

    const member = await ensureProgramMemberLoginAccess(memberId);

    revalidatePath("/admin/mentors");
    revalidatePath("/admin/mentees");
    revalidatePath(
      `/admin/${member.role === "mentor" ? "mentors" : "mentees"}/${member.id}`,
    );
    revalidatePath(`/admin/program-members/${member.id}`);
    revalidatePath("/admin/join-applications");
    revalidatePath(`/admin/join-applications/${member.joinApplicationId}`);

    return { ok: true, message: "Login link sent." };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Login link could not be sent.",
    };
  }
}

export async function requestProgramMemberLoginLinkAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const lastName = String(formData.get("lastName") ?? "").trim();

    if (!email || !lastName) {
      return { ok: false, message: "Email and last name are required." };
    }

    // Find the program member by email
    const [member] = await db
      .select()
      .from(programMembers)
      .where(eq(programMembers.email, email))
      .limit(1);

    if (!member) {
      // Don’t leak existence
      return { ok: false, message: "Invalid credentials." };
    }

    // Soft identity check with last name
    const { lastName: expectedLastName } = splitName(member.fullName);
    if (
      !expectedLastName ||
      expectedLastName.toLowerCase() !== lastName.toLowerCase()
    ) {
      return { ok: false, message: "Invalid credentials." };
    }

    // This does the real work: upsert user, update program_member, generate magic link
    const { magicLinkUrl } = await ensureProgramMemberQuickLoginAccess(
      member.id,
    );

    return {
      ok: true,
      message: "Redirecting…",
      url: magicLinkUrl,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Could not sign you in.",
    };
  }
}

export async function updateMentorWorkflowMilestone(formData: FormData) {
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
    .where(
      and(eq(programMembers.id, memberId), eq(programMembers.role, "mentor")),
    );

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

    revalidatePath("/admin/workbook/deliveries");
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

    revalidatePath("/admin/workbook/deliveries");
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

    revalidatePath("/admin/workbook/deliveries");
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

    revalidatePath("/admin/workbook/deliveries");
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

export async function syncMemberWorkbookDeliveriesAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const memberId = value(formData, "program_member_id");
    if (!memberId) {
      return { ok: false, message: "Program member is required." };
    }

    const result = await syncMemberWorkbookDeliveries(memberId);

    revalidatePath("/admin/workbook/deliveries");
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
      .innerJoin(
        programMembers,
        eq(programMembers.id, moduleSubmissions.programMemberId),
      )
      .innerJoin(
        programModules,
        eq(programModules.id, moduleSubmissions.moduleId),
      )
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

    revalidatePath("/admin/workbook/submissions");
    revalidatePath(`/admin/program-members/${submission.member.id}`);
    return { ok: true, message: "Submission marked as reviewed." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Review update failed.",
    };
  }
}
