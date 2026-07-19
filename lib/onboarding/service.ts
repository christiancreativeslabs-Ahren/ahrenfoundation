import { createId } from "@paralleldrive/cuid2";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  emailEvents,
  engagementEvents,
  moduleDeliveries,
  moduleQuestions,
  moduleSubmissionAnswers,
  moduleSubmissions,
  programEnrollments,
  programMembers,
  programModules,
  programs,
} from "@/db/schema";
import { sendResendEmail } from "@/lib/email";
import {
  AHREN_ONBOARDING_PROGRAM,
  type OnboardingModuleDefinition,
} from "@/lib/onboarding/content";
import {
  renderOnboardingModuleEmail,
} from "@/lib/onboarding/email-renderer";
import { moduleDefinitionFromPayload } from "@/lib/onboarding/email-shared";
import {
  buildEmailOpenUrl,
  buildTrackedLessonClickUrl,
} from "@/lib/onboarding/urls";
export {
  buildEmailOpenUrl,
  buildLessonUrl,
  buildTrackedLessonClickUrl,
  getAppBaseUrl,
} from "@/lib/onboarding/urls";

export type EngagementEventType =
  | "email_sent"
  | "email_skipped"
  | "email_failed"
  | "email_opened"
  | "email_clicked"
  | "lesson_viewed"
  | "assignment_started"
  | "assignment_submitted"
  | "delivery_rescheduled"
  | "delivery_cancelled"
  | "delivery_synced"
  | "submission_reviewed";

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function moduleScriptureText(module: OnboardingModuleDefinition) {
  return module.scriptures.map((scripture) => scripture.text).join("\n");
}

function moduleScriptureReference(module: OnboardingModuleDefinition) {
  return module.scriptures.map((scripture) => scripture.reference).join("; ");
}

export async function ensureAhrenOnboardingProgram() {
  const definition = AHREN_ONBOARDING_PROGRAM;

  const [program] = await db
    .insert(programs)
    .values({
      slug: definition.slug,
      name: definition.name,
      summary: definition.summary,
      startsAfterDays: definition.startsAfterDays,
      status: "published",
      isActive: true,
      payload: {
        source: "ahren-foundation-complete-email-copy",
        moduleCount: definition.modules.length,
      },
    })
    .onConflictDoUpdate({
      target: programs.slug,
      set: {
        name: definition.name,
        summary: definition.summary,
        startsAfterDays: definition.startsAfterDays,
        status: "published",
        isActive: true,
        updatedAt: new Date(),
        payload: {
          source: "ahren-foundation-complete-email-copy",
          moduleCount: definition.modules.length,
        },
      },
    })
    .returning();

  const moduleRows: Array<typeof programModules.$inferSelect> = [];

  for (const module of definition.modules) {
    const [moduleRow] = await db
      .insert(programModules)
      .values({
        programId: program.id,
        moduleKey: module.moduleKey,
        moduleNumber: module.moduleNumber,
        weekNumber: module.weekNumber,
        sendOffsetDays: module.sendOffsetDays,
        sendDayLabel: module.sendDayLabel,
        title: module.title,
        subtitle: module.subtitle ?? null,
        subject: module.subject,
        previewText: module.previewText,
        openingCopy: module.openingCopy.join("\n"),
        scriptureText: moduleScriptureText(module),
        scriptureReference: moduleScriptureReference(module),
        reflection: module.reflection,
        focus: module.focus,
        action: module.action,
        sortOrder: module.moduleNumber,
        status: "published",
        payload: {
          scriptures: module.scriptures,
        },
      })
      .onConflictDoUpdate({
        target: [programModules.programId, programModules.moduleKey],
        set: {
          moduleNumber: module.moduleNumber,
          weekNumber: module.weekNumber,
          sendOffsetDays: module.sendOffsetDays,
          sendDayLabel: module.sendDayLabel,
          title: module.title,
          subtitle: module.subtitle ?? null,
          subject: module.subject,
          previewText: module.previewText,
          openingCopy: module.openingCopy.join("\n"),
          scriptureText: moduleScriptureText(module),
          scriptureReference: moduleScriptureReference(module),
          reflection: module.reflection,
          focus: module.focus,
          action: module.action,
          sortOrder: module.moduleNumber,
          status: "published",
          updatedAt: new Date(),
          payload: {
            scriptures: module.scriptures,
          },
        },
      })
      .returning();

    moduleRows.push(moduleRow);

    for (let index = 0; index < module.questions.length; index += 1) {
      await db
        .insert(moduleQuestions)
        .values({
          moduleId: moduleRow.id,
          questionNumber: index + 1,
          prompt: module.questions[index],
          responseType: "long_text",
          isRequired: true,
        })
        .onConflictDoUpdate({
          target: [moduleQuestions.moduleId, moduleQuestions.questionNumber],
          set: {
            prompt: module.questions[index],
            responseType: "long_text",
            isRequired: true,
            updatedAt: new Date(),
          },
        });
    }
  }

  return { program, modules: moduleRows };
}

export async function enrollMemberInAhrenOnboarding(
  programMemberId: string,
  signedUpAt = new Date()
) {
  const { program, modules } = await ensureAhrenOnboardingProgram();
  const startsAt = addDays(signedUpAt, program.startsAfterDays);

  const [member] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.id, programMemberId))
    .limit(1);

  if (!member) {
    throw new Error("Program member was not found.");
  }

  if (member.role !== "youth") {
    throw new Error(
      "Only youth members can be synced into onboarding module deliveries."
    );
  }

  const [enrollment] = await db
    .insert(programEnrollments)
    .values({
      programId: program.id,
      programMemberId,
      status: "active",
      signedUpAt,
      startsAt,
      payload: {
        generatedFromProgramSlug: program.slug,
      },
    })
    .onConflictDoUpdate({
      target: [
        programEnrollments.programMemberId,
        programEnrollments.programId,
      ],
      set: {
        status: "active",
        startsAt,
        updatedAt: new Date(),
      },
    })
    .returning();

  for (const module of modules) {
    await db
      .insert(moduleDeliveries)
      .values({
        enrollmentId: enrollment.id,
        moduleId: module.id,
        programMemberId,
        recipientEmail: member.email,
        accessToken: createId(),
        status: "scheduled",
        scheduledFor: addDays(startsAt, module.sendOffsetDays),
        payload: {
          moduleNumber: module.moduleNumber,
          moduleKey: module.moduleKey,
        },
      })
      .onConflictDoNothing({
        target: [moduleDeliveries.enrollmentId, moduleDeliveries.moduleId],
      });
  }

  return enrollment;
}

async function getDeliveryRecord(deliveryId: string) {
  const [row] = await db
    .select({
      delivery: moduleDeliveries,
      enrollment: programEnrollments,
      member: programMembers,
      module: programModules,
      program: programs,
    })
    .from(moduleDeliveries)
    .innerJoin(
      programEnrollments,
      eq(programEnrollments.id, moduleDeliveries.enrollmentId)
    )
    .innerJoin(
      programMembers,
      eq(programMembers.id, moduleDeliveries.programMemberId)
    )
    .innerJoin(programModules, eq(programModules.id, moduleDeliveries.moduleId))
    .innerJoin(programs, eq(programs.id, programModules.programId))
    .where(eq(moduleDeliveries.id, deliveryId))
    .limit(1);

  return row ?? null;
}

export async function syncMemberDeliveries(programMemberId: string) {
  const [member] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.id, programMemberId))
    .limit(1);

  if (!member) {
    throw new Error("Program member was not found.");
  }

  const enrollments = await db
    .select()
    .from(programEnrollments)
    .where(eq(programEnrollments.programMemberId, programMemberId))
    .orderBy(asc(programEnrollments.createdAt));

  if (!enrollments.length) {
    await enrollMemberInAhrenOnboarding(programMemberId, member.createdAt);

    await recordEngagementEvent({
      eventType: "delivery_synced",
      programMemberId,
      metadata: {
        createdEnrollment: true,
      },
    });

    return { created: AHREN_ONBOARDING_PROGRAM.modules.length, enrollments: 1 };
  }

  let created = 0;

  for (const enrollment of enrollments) {
    const modules = await db
      .select()
      .from(programModules)
      .where(eq(programModules.programId, enrollment.programId))
      .orderBy(asc(programModules.moduleNumber));

    for (const module of modules) {
      const inserted = await db
        .insert(moduleDeliveries)
        .values({
          enrollmentId: enrollment.id,
          moduleId: module.id,
          programMemberId,
          recipientEmail: member.email,
          accessToken: createId(),
          status: "scheduled",
          scheduledFor: addDays(enrollment.startsAt, module.sendOffsetDays),
          payload: {
            moduleNumber: module.moduleNumber,
            moduleKey: module.moduleKey,
          },
        })
        .onConflictDoNothing({
          target: [moduleDeliveries.enrollmentId, moduleDeliveries.moduleId],
        })
        .returning({ id: moduleDeliveries.id });

      created += inserted.length;
    }
  }

  await recordEngagementEvent({
    eventType: "delivery_synced",
    programMemberId,
    metadata: {
      createdDeliveries: created,
      enrollmentCount: enrollments.length,
    },
  });

  return { created, enrollments: enrollments.length };
}

export async function rescheduleModuleDelivery(
  deliveryId: string,
  scheduledFor: Date
) {
  const row = await getDeliveryRecord(deliveryId);
  if (!row) {
    throw new Error("Module delivery was not found.");
  }

  const now = new Date();
  await db
    .update(moduleDeliveries)
    .set({
      status: row.delivery.assignmentSubmittedAt ? "completed" : "scheduled",
      scheduledFor,
      failedAt: null,
      error: null,
      updatedAt: now,
    })
    .where(eq(moduleDeliveries.id, deliveryId));

  await recordEngagementEvent({
    eventType: "delivery_rescheduled",
    programMemberId: row.member.id,
    enrollmentId: row.enrollment.id,
    moduleId: row.module.id,
    deliveryId,
    metadata: {
      scheduledFor: scheduledFor.toISOString(),
    },
  });
}

export async function cancelModuleDelivery(deliveryId: string) {
  const row = await getDeliveryRecord(deliveryId);
  if (!row) {
    throw new Error("Module delivery was not found.");
  }

  const now = new Date();
  await db
    .update(moduleDeliveries)
    .set({
      status: row.delivery.assignmentSubmittedAt ? "completed" : "cancelled",
      error: null,
      updatedAt: now,
    })
    .where(eq(moduleDeliveries.id, deliveryId));

  await recordEngagementEvent({
    eventType: "delivery_cancelled",
    programMemberId: row.member.id,
    enrollmentId: row.enrollment.id,
    moduleId: row.module.id,
    deliveryId,
    metadata: {
      previousStatus: row.delivery.status,
    },
  });
}

type SendModuleDeliveryOptions = {
  source?: "cron" | "admin_resend" | "admin_retry";
};

export async function sendModuleDeliveryNow(
  deliveryId: string,
  options: SendModuleDeliveryOptions = {}
) {
  const row = await getDeliveryRecord(deliveryId);
  if (!row) {
    throw new Error("Module delivery was not found.");
  }

  const moduleDefinition = moduleDefinitionFromPayload(row.module);
  const lessonUrl = buildTrackedLessonClickUrl(
    row.delivery.id,
    row.delivery.accessToken
  );
  const openPixelUrl = buildEmailOpenUrl(
    row.delivery.id,
    row.delivery.accessToken
  );
  const payload = {
    ...renderOnboardingModuleEmail({
      name: row.member.fullName,
      module: moduleDefinition,
      lessonUrl,
      openPixelUrl,
    }),
    to: row.member.email,
  };

  try {
    const result = await sendResendEmail(payload);
    const now = new Date();
    const status = result.sent ? "sent" : "skipped";

    const [emailEvent] = await db
      .insert(emailEvents)
      .values({
        programMemberId: row.member.id,
        enrollmentId: row.enrollment.id,
        moduleId: row.module.id,
        deliveryId: row.delivery.id,
        recipientEmail: row.member.email,
        templateKey: payload.templateKey,
        status,
        providerId: result.providerId,
        sentAt: result.sent ? now : null,
        payload: {
          subject: payload.subject,
          moduleNumber: row.module.moduleNumber,
          lessonUrl,
          source: options.source ?? "cron",
        },
      })
      .returning({ id: emailEvents.id });

    await db
      .update(moduleDeliveries)
      .set({
        status: row.delivery.assignmentSubmittedAt
          ? "completed"
          : result.sent
            ? "sent"
            : "skipped",
        sentAt: result.sent ? now : row.delivery.sentAt,
        failedAt: null,
        error: null,
        updatedAt: now,
      })
      .where(eq(moduleDeliveries.id, row.delivery.id));

    await recordEngagementEvent({
      eventType: result.sent ? "email_sent" : "email_skipped",
      programMemberId: row.member.id,
      enrollmentId: row.enrollment.id,
      moduleId: row.module.id,
      deliveryId: row.delivery.id,
      emailEventId: emailEvent?.id,
      metadata: {
        templateKey: payload.templateKey,
        providerId: result.providerId,
        source: options.source ?? "cron",
      },
    });

    return {
      ok: true,
      status,
      deliveryId: row.delivery.id,
      moduleNumber: row.module.moduleNumber,
    };
  } catch (error) {
    const now = new Date();
    const message =
      error instanceof Error ? error.message : "Module delivery failed.";

    const [emailEvent] = await db
      .insert(emailEvents)
      .values({
        programMemberId: row.member.id,
        enrollmentId: row.enrollment.id,
        moduleId: row.module.id,
        deliveryId: row.delivery.id,
        recipientEmail: row.member.email,
        templateKey: payload.templateKey,
        status: "failed",
        error: message,
        payload: {
          subject: payload.subject,
          moduleNumber: row.module.moduleNumber,
          source: options.source ?? "cron",
        },
      })
      .returning({ id: emailEvents.id });

    await db
      .update(moduleDeliveries)
      .set({
        status: row.delivery.assignmentSubmittedAt ? "completed" : "failed",
        failedAt: now,
        error: message,
        updatedAt: now,
      })
      .where(eq(moduleDeliveries.id, row.delivery.id));

    await recordEngagementEvent({
      eventType: "email_failed",
      programMemberId: row.member.id,
      enrollmentId: row.enrollment.id,
      moduleId: row.module.id,
      deliveryId: row.delivery.id,
      emailEventId: emailEvent?.id,
      metadata: {
        templateKey: payload.templateKey,
        error: message,
        source: options.source ?? "cron",
      },
    });

    throw new Error(message);
  }
}

export async function recordEngagementEvent(input: {
  eventType: EngagementEventType;
  programMemberId?: string | null;
  enrollmentId?: string | null;
  moduleId?: string | null;
  deliveryId?: string | null;
  emailEventId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  await db.insert(engagementEvents).values({
    eventType: input.eventType,
    programMemberId: input.programMemberId ?? null,
    enrollmentId: input.enrollmentId ?? null,
    moduleId: input.moduleId ?? null,
    deliveryId: input.deliveryId ?? null,
    emailEventId: input.emailEventId ?? null,
    metadata: input.metadata,
  });
}

export async function getDeliveryByToken(deliveryId: string, token: string) {
  const [row] = await db
    .select({
      delivery: moduleDeliveries,
      enrollment: programEnrollments,
      member: programMembers,
      module: programModules,
      program: programs,
    })
    .from(moduleDeliveries)
    .innerJoin(
      programEnrollments,
      eq(programEnrollments.id, moduleDeliveries.enrollmentId)
    )
    .innerJoin(
      programMembers,
      eq(programMembers.id, moduleDeliveries.programMemberId)
    )
    .innerJoin(programModules, eq(programModules.id, moduleDeliveries.moduleId))
    .innerJoin(programs, eq(programs.id, programModules.programId))
    .where(
      and(
        eq(moduleDeliveries.id, deliveryId),
        eq(moduleDeliveries.accessToken, token)
      )
    )
    .limit(1);

  return row ?? null;
}

export async function getQuestionsForModule(moduleId: string) {
  return db
    .select()
    .from(moduleQuestions)
    .where(eq(moduleQuestions.moduleId, moduleId))
    .orderBy(asc(moduleQuestions.questionNumber));
}

export async function getSubmissionsForDelivery(deliveryId: string) {
  return db
    .select()
    .from(moduleSubmissions)
    .where(eq(moduleSubmissions.deliveryId, deliveryId))
    .orderBy(asc(moduleSubmissions.submittedAt));
}

export async function submitModuleAnswers(input: {
  deliveryId: string;
  accessToken: string;
  answers: Array<{ questionId: string; answer: string }>;
}) {
  const row = await getDeliveryByToken(input.deliveryId, input.accessToken);
  if (!row) {
    throw new Error("This lesson link is invalid or has expired.");
  }

  const now = new Date();
  const [submission] = await db
    .insert(moduleSubmissions)
    .values({
      enrollmentId: row.enrollment.id,
      moduleId: row.module.id,
      deliveryId: row.delivery.id,
      programMemberId: row.member.id,
      status: "submitted",
      submittedAt: now,
      payload: {
        answerCount: input.answers.length,
      },
    })
    .returning();

  if (input.answers.length) {
    await db.insert(moduleSubmissionAnswers).values(
      input.answers.map((answer) => ({
        submissionId: submission.id,
        questionId: answer.questionId,
        answer: answer.answer,
      }))
    );
  }

  await db
    .update(moduleDeliveries)
    .set({
      status: "completed",
      assignmentSubmittedAt: now,
      updatedAt: now,
    })
    .where(eq(moduleDeliveries.id, row.delivery.id));

  await recordEngagementEvent({
    eventType: "assignment_submitted",
    programMemberId: row.member.id,
    enrollmentId: row.enrollment.id,
    moduleId: row.module.id,
    deliveryId: row.delivery.id,
    metadata: {
      answerCount: input.answers.length,
      moduleNumber: row.module.moduleNumber,
    },
  });

  return submission;
}
