"use server";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { getAdminEmails } from "@/lib/validations/join";
import {
  moduleDeliveries,
  moduleQuestions,
  moduleSubmissionAnswers,
  moduleSubmissions,
  programMembers,
  programModules,
} from "@/db/schema";
import {
  getWorkbookModuleById,
  getWorkbookModulePageData,
  parseWorkbookImportDefinition,
  upsertWorkbookFromDefinition,
} from "@/lib/workbook";
import {
  recordEngagementEvent,
  syncMemberWorkbookDeliveries,
} from "@/lib/workbook/service";

type ActionResult = {
  ok: boolean;
  message: string;
};

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

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

async function requireVerifiedMentee() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    throw new Error("You must be signed in.");
  }

  const [member] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.email, session.user.email))
    .limit(1);

  if (!member || member.status !== "verified_member" || member.role !== "youth") {
    throw new Error("Mentee access is required.");
  }

  return { user: session.user, member };
}

export async function importWorkbookFromJson(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const raw = value(formData, "workbook_json");
    if (!raw) {
      throw new Error("Paste workbook JSON before importing.");
    }

    const definition = parseWorkbookImportDefinition(raw);
    await upsertWorkbookFromDefinition(definition);

    revalidatePath("/admin/workbook");
    revalidatePath("/admin/workbook/import");
    revalidatePath("/dashboard/workbook");
    revalidatePath("/email-preview/workbook");

    redirect("/admin/workbook/import?imported=1");
  } catch (error) {
    redirect(
      `/admin/workbook/import?error=${encodeURIComponent(
        error instanceof Error ? error.message : "Workbook import failed.",
      )}`,
    );
  }
}

export async function saveWorkbookModuleAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const moduleId = value(formData, "module_id");

  try {
    await requireAdmin();

    if (!moduleId) {
      throw new Error("Workbook module was not found.");
    }

    const current = await getWorkbookModuleById(moduleId);
    if (!current) {
      throw new Error("Workbook module was not found.");
    }

    const moduleKey = value(formData, "module_key");
    const moduleNumber = Number(value(formData, "module_number"));
    const weekNumber = Number(value(formData, "week_number"));
    const sendOffsetDays = Number(value(formData, "send_offset_days"));
    const sendDayLabel = value(formData, "send_day_label");
    const title = value(formData, "title");
    const subtitle = value(formData, "subtitle");
    const subject = value(formData, "subject");
    const previewText = value(formData, "preview_text");
    const openingCopy = value(formData, "opening_copy");
    const scriptureText = value(formData, "scripture_text");
    const scriptureReference = value(formData, "scripture_reference");
    const reflection = value(formData, "reflection");
    const focus = value(formData, "focus");
    const action = value(formData, "action");
    const contentHtml = value(formData, "content_html");
    const status = value(formData, "status") || "published";
    const questionCount = Number(value(formData, "question_count") || "0");

    if (!moduleKey) throw new Error("Module key is required.");
    if (!Number.isInteger(moduleNumber) || moduleNumber <= 0) {
      throw new Error("Module number must be a positive integer.");
    }
    if (!Number.isInteger(weekNumber) || weekNumber <= 0) {
      throw new Error("Week number must be a positive integer.");
    }
    if (!Number.isInteger(sendOffsetDays) || sendOffsetDays < 0) {
      throw new Error("Send offset days must be zero or a positive integer.");
    }
    if (!sendDayLabel) throw new Error("Send day label is required.");
    if (!title) throw new Error("Module title is required.");
    if (!subject) throw new Error("Email subject is required.");
    if (!openingCopy) throw new Error("Opening copy is required.");
    if (!scriptureText) throw new Error("Scripture text is required.");
    if (!scriptureReference) throw new Error("Scripture reference is required.");
    if (!reflection) throw new Error("Reflection is required.");
    if (!focus) throw new Error("Focus is required.");
    if (!action) throw new Error("Action is required.");

    const questions = Array.from({ length: Math.max(0, questionCount) }, (_, index) => {
      const prompt = value(formData, `question_prompt_${index}`);
      const responseType = value(formData, `question_response_type_${index}`) || "long_text";
      const isRequired = String(formData.get(`question_required_${index}`) ?? "") === "true";
      return { prompt, responseType, isRequired };
    }).filter((question) => question.prompt);

    if (!questions.length) {
      throw new Error("Add at least one question before saving the module.");
    }

    await db.transaction(async (tx) => {
      await tx
        .update(programModules)
        .set({
          moduleKey,
          moduleNumber,
          weekNumber,
          sendOffsetDays,
          sendDayLabel,
          title,
          subtitle: subtitle || null,
          subject,
          previewText: previewText || null,
          openingCopy,
          scriptureText,
          scriptureReference,
          reflection,
          focus,
          action,
          sortOrder: moduleNumber,
          status,
          payload: {
            ...(current.module.payload ?? {}),
            contentHtml,
          },
          updatedAt: new Date(),
        })
        .where(eq(programModules.id, moduleId));

      await tx.delete(moduleQuestions).where(eq(moduleQuestions.moduleId, moduleId));

      await tx.insert(moduleQuestions).values(
        questions.map((question, index) => ({
          moduleId,
          questionNumber: index + 1,
          prompt: question.prompt,
          responseType: question.responseType,
          isRequired: question.isRequired,
        })),
      );
    });

    revalidatePath("/admin/workbook");
    revalidatePath(`/admin/workbook/${moduleId}`);
    revalidatePath(`/admin/workbook/${moduleId}/edit`);
    revalidatePath("/dashboard/workbook");
    revalidatePath(`/dashboard/workbook/${moduleId}`);
    revalidatePath("/email-preview/workbook");

    redirect(`/admin/workbook/${moduleId}?updated=1`);
  } catch (error) {
    redirect(
      `/admin/workbook/${moduleId ?? ""}/edit?error=${encodeURIComponent(
        error instanceof Error ? error.message : "Workbook module update failed.",
      )}`,
    );
  }
}

export async function submitWorkbookModuleAnswers(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const { member } = await requireVerifiedMentee();
    const moduleId = value(formData, "module_id");
    const returnTo = value(formData, "return_to") || "/dashboard/workbook";

    if (!moduleId) {
      throw new Error("Workbook module not found.");
    }

    const moduleData = await getWorkbookModulePageData(moduleId, member.id);
    if (!moduleData) {
      throw new Error("Workbook module not found.");
    }

    const answers = moduleData.questions.map((question) => {
      const answer = value(formData, `answer_${question.id}`);
      if (question.isRequired && !answer) {
        throw new Error("Please answer every required question.");
      }

      return {
        questionId: question.id,
        answer,
      };
    });

    await syncMemberWorkbookDeliveries(member.id);

    const [delivery] = await db
      .select()
      .from(moduleDeliveries)
      .where(
        and(
          eq(moduleDeliveries.moduleId, moduleData.module.id),
          eq(moduleDeliveries.programMemberId, member.id),
        ),
      )
      .limit(1);

    if (!delivery) {
      throw new Error("Workbook delivery was not found for this module.");
    }

    if (delivery.scheduledFor > new Date()) {
      throw new Error("This Workbook module is not open yet.");
    }

    const now = new Date();
    const [submission] = await db
      .insert(moduleSubmissions)
      .values({
        enrollmentId: delivery.enrollmentId,
        moduleId: moduleData.module.id,
        deliveryId: delivery.id,
        programMemberId: member.id,
        status: "submitted",
        submittedAt: now,
        payload: {
          questionCount: answers.length,
          source: "dashboard_workbook",
        },
      })
      .returning();

    await db.insert(moduleSubmissionAnswers).values(
      answers.map((answer) => ({
        submissionId: submission.id,
        questionId: answer.questionId,
        answer: answer.answer,
      })),
    );

    await db
      .update(moduleDeliveries)
      .set({
        assignmentSubmittedAt: now,
        status: "completed",
        updatedAt: now,
      })
      .where(eq(moduleDeliveries.id, delivery.id));

    await recordEngagementEvent({
      eventType: "workbook_submitted",
      programMemberId: member.id,
      enrollmentId: delivery.enrollmentId,
      moduleId: moduleData.module.id,
      deliveryId: delivery.id,
      metadata: {
        workbookModuleId: moduleData.module.id,
        questionCount: answers.length,
        source: "dashboard_workbook",
      },
    });

    revalidatePath("/dashboard/workbook");
    revalidatePath(`/dashboard/workbook/${moduleId}`);
    revalidatePath("/admin/workbook/submissions");

    redirect(`${returnTo}?submitted=1`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Workbook submission failed.";
    const moduleId = value(formData, "module_id");
    const returnTo = value(formData, "return_to") || "/dashboard/workbook";
    redirect(
      `${returnTo}?error=${encodeURIComponent(message)}${
        moduleId ? `&module=${encodeURIComponent(moduleId)}` : ""
      }`,
    );
  }
}
