"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { getAdminEmails } from "@/lib/validations/join";
import {
  programMembers,
  workbookModules,
  workbookQuestions,
  workbookSubmissions,
  workbookSubmissionAnswers,
} from "@/db/schema";
import {
  parseWorkbookImportDefinition,
  upsertWorkbookFromDefinition,
  getWorkbookModulePageData,
} from "@/lib/workbook";
import { recordEngagementEvent } from "@/lib/onboarding/service";

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
    revalidatePath("/dashboard/workbook");

    redirect("/admin/workbook?imported=1");
  } catch (error) {
    redirect(
      `/admin/workbook?error=${encodeURIComponent(
        error instanceof Error ? error.message : "Workbook import failed.",
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

    const [submission] = await db
      .insert(workbookSubmissions)
      .values({
        workbookProgramId: moduleData.program.id,
        workbookModuleId: moduleData.module.id,
        programMemberId: member.id,
        status: "submitted",
        payload: {
          questionCount: answers.length,
        },
      })
      .returning();

    await db.insert(workbookSubmissionAnswers).values(
      answers.map((answer) => ({
        submissionId: submission.id,
        questionId: answer.questionId,
        answer: answer.answer,
      })),
    );

    await db
      .update(workbookModules)
      .set({
        updatedAt: new Date(),
      })
      .where(eq(workbookModules.id, moduleData.module.id));

    await recordEngagementEvent({
      eventType: "workbook_submitted",
      programMemberId: member.id,
      moduleId: moduleData.module.id,
      metadata: {
        workbookModuleId: moduleData.module.id,
        questionCount: answers.length,
      },
    });

    revalidatePath("/dashboard/workbook");
    revalidatePath(`/dashboard/workbook/${moduleId}`);
    revalidatePath("/admin/workbook-submissions");

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
