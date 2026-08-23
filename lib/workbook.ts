import "server-only";

import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  programMembers,
  workbookModules,
  workbookPrograms,
  workbookQuestions,
  workbookSubmissionAnswers,
  workbookSubmissions,
} from "@/db/schema";

export const DEFAULT_WORKBOOK_PROGRAM = {
  slug: "ahren-workbook",
  name: "Ahren Workbook",
  summary:
    "Weekly workbook lessons, reflections, and assessments for mentees inside the Ahren Hub.",
};

export type WorkbookImportQuestionInput = {
  prompt: string;
  responseType?: string;
  isRequired?: boolean;
};

export type WorkbookImportModuleInput = {
  moduleKey: string;
  moduleNumber: number;
  title: string;
  subtitle?: string | null;
  summary?: string | null;
  contentHtml?: string;
  status?: string;
  questions?: WorkbookImportQuestionInput[];
};

export type WorkbookImportDefinition = {
  program?: {
    slug?: string;
    name?: string;
    summary?: string | null;
    status?: string;
    isActive?: boolean;
    payload?: Record<string, unknown>;
  };
  modules: WorkbookImportModuleInput[];
};

function normalizeString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function parseWorkbookImportDefinition(raw: string): WorkbookImportDefinition {
  const parsed = JSON.parse(raw) as WorkbookImportDefinition;

  if (!parsed || !Array.isArray(parsed.modules)) {
    throw new Error("Workbook import JSON must include a modules array.");
  }

  return {
    program: parsed.program,
    modules: parsed.modules.map((module) => ({
      moduleKey: normalizeString(module.moduleKey),
      moduleNumber: normalizeNumber(module.moduleNumber),
      title: normalizeString(module.title),
      subtitle: module.subtitle ?? null,
      summary: module.summary ?? null,
      contentHtml: normalizeString(module.contentHtml),
      status: normalizeString(module.status, "draft"),
      questions: Array.isArray(module.questions)
        ? module.questions.map((question) => ({
            prompt: normalizeString(question.prompt),
            responseType: normalizeString(question.responseType, "long_text"),
            isRequired: normalizeBoolean(question.isRequired, true),
          }))
        : [],
    })),
  };
}

export async function upsertWorkbookFromDefinition(
  definition: WorkbookImportDefinition,
) {
  const programInput = definition.program ?? {};
  const [program] = await db
    .insert(workbookPrograms)
    .values({
      slug: normalizeString(programInput.slug, DEFAULT_WORKBOOK_PROGRAM.slug),
      name: normalizeString(programInput.name, DEFAULT_WORKBOOK_PROGRAM.name),
      summary: normalizeString(
        programInput.summary,
        DEFAULT_WORKBOOK_PROGRAM.summary,
      ),
      status: normalizeString(programInput.status, "draft"),
      isActive: normalizeBoolean(programInput.isActive, false),
      payload: programInput.payload ?? {},
    })
    .onConflictDoUpdate({
      target: workbookPrograms.slug,
      set: {
        name: normalizeString(programInput.name, DEFAULT_WORKBOOK_PROGRAM.name),
        summary: normalizeString(
          programInput.summary,
          DEFAULT_WORKBOOK_PROGRAM.summary,
        ),
        status: normalizeString(programInput.status, "draft"),
        isActive: normalizeBoolean(programInput.isActive, false),
        updatedAt: new Date(),
        payload: programInput.payload ?? {},
      },
    })
    .returning();

  const moduleRows = [];

  for (const moduleInput of definition.modules) {
    const [moduleRow] = await db
      .insert(workbookModules)
      .values({
        workbookProgramId: program.id,
        moduleKey: normalizeString(moduleInput.moduleKey),
        moduleNumber: normalizeNumber(moduleInput.moduleNumber),
        title: normalizeString(moduleInput.title),
        subtitle: moduleInput.subtitle ?? null,
        summary: moduleInput.summary ?? null,
        contentHtml: moduleInput.contentHtml ?? "",
        sortOrder: normalizeNumber(moduleInput.moduleNumber),
        status: normalizeString(moduleInput.status, "draft"),
        payload: {},
      })
      .onConflictDoUpdate({
        target: [workbookModules.workbookProgramId, workbookModules.moduleKey],
        set: {
          moduleNumber: normalizeNumber(moduleInput.moduleNumber),
          title: normalizeString(moduleInput.title),
          subtitle: moduleInput.subtitle ?? null,
          summary: moduleInput.summary ?? null,
          contentHtml: moduleInput.contentHtml ?? "",
          sortOrder: normalizeNumber(moduleInput.moduleNumber),
          status: normalizeString(moduleInput.status, "draft"),
          updatedAt: new Date(),
          payload: {},
        },
      })
      .returning();

    moduleRows.push(moduleRow);

    const questions = moduleInput.questions ?? [];
    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index];
      await db
        .insert(workbookQuestions)
        .values({
          workbookModuleId: moduleRow.id,
          questionNumber: index + 1,
          prompt: normalizeString(question.prompt),
          responseType: normalizeString(question.responseType, "long_text"),
          isRequired: normalizeBoolean(question.isRequired, true),
        })
        .onConflictDoUpdate({
          target: [workbookQuestions.workbookModuleId, workbookQuestions.questionNumber],
          set: {
            prompt: normalizeString(question.prompt),
            responseType: normalizeString(question.responseType, "long_text"),
            isRequired: normalizeBoolean(question.isRequired, true),
            updatedAt: new Date(),
          },
        });
    }
  }

  return { program, modules: moduleRows };
}

export async function getActiveWorkbookProgram() {
  const [program] = await db
    .select()
    .from(workbookPrograms)
    .where(eq(workbookPrograms.isActive, true))
    .orderBy(desc(workbookPrograms.updatedAt))
    .limit(1);

  return program ?? null;
}

export async function getWorkbookModulesForProgram(programId: string) {
  return db
    .select()
    .from(workbookModules)
    .where(eq(workbookModules.workbookProgramId, programId))
    .orderBy(asc(workbookModules.sortOrder), asc(workbookModules.moduleNumber));
}

export async function getWorkbookModuleById(moduleId: string) {
  const [module] = await db
    .select({
      module: workbookModules,
      program: workbookPrograms,
    })
    .from(workbookModules)
    .innerJoin(
      workbookPrograms,
      eq(workbookPrograms.id, workbookModules.workbookProgramId),
    )
    .where(eq(workbookModules.id, moduleId))
    .limit(1);

  if (!module) return null;

  const questions = await db
    .select()
    .from(workbookQuestions)
    .where(eq(workbookQuestions.workbookModuleId, module.module.id))
    .orderBy(asc(workbookQuestions.questionNumber));

  return {
    module: module.module,
    program: module.program,
    questions,
  };
}

export async function getWorkbookMemberDashboard(programMemberId: string) {
  const activeProgram = await getActiveWorkbookProgram();

  if (!activeProgram) {
    return {
      program: null,
      modules: [],
      submissions: [],
      completedModuleIds: new Set<string>(),
    };
  }

  const [member] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.id, programMemberId))
    .limit(1);

  if (!member) {
    return {
      program: activeProgram,
      modules: [],
      submissions: [],
      completedModuleIds: new Set<string>(),
    };
  }

  const [modules, submissions] = await Promise.all([
    getWorkbookModulesForProgram(activeProgram.id),
    db
      .select()
      .from(workbookSubmissions)
      .where(
        eq(workbookSubmissions.programMemberId, programMemberId),
      )
      .orderBy(desc(workbookSubmissions.submittedAt)),
  ]);

  const completedModuleIds = new Set(
    submissions.map((submission) => submission.workbookModuleId),
  );

  return {
    program: activeProgram,
    modules,
    submissions,
    completedModuleIds,
  };
}

export async function getWorkbookModulePageData(
  moduleId: string,
  programMemberId: string,
) {
  const module = await getWorkbookModuleById(moduleId);

  if (!module) {
    return null;
  }

  const [submission] = await db
    .select()
    .from(workbookSubmissions)
    .where(
      and(
        eq(workbookSubmissions.workbookModuleId, module.module.id),
        eq(workbookSubmissions.programMemberId, programMemberId),
      ),
    )
    .orderBy(desc(workbookSubmissions.submittedAt))
    .limit(1);

  const answers = submission
    ? await db
        .select()
        .from(workbookSubmissionAnswers)
        .where(eq(workbookSubmissionAnswers.submissionId, submission.id))
        .orderBy(asc(workbookSubmissionAnswers.createdAt))
    : [];

  return {
    ...module,
    submission: submission ?? null,
    answers,
  };
}

export async function getWorkbookSubmissionReviewData() {
  const rows = await db
    .select({
      submission: workbookSubmissions,
      member: programMembers,
      module: workbookModules,
      program: workbookPrograms,
    })
    .from(workbookSubmissions)
    .innerJoin(programMembers, eq(programMembers.id, workbookSubmissions.programMemberId))
    .innerJoin(workbookModules, eq(workbookModules.id, workbookSubmissions.workbookModuleId))
    .innerJoin(workbookPrograms, eq(workbookPrograms.id, workbookSubmissions.workbookProgramId))
    .orderBy(desc(workbookSubmissions.submittedAt));

  const submissionIds = rows.map((row) => row.submission.id);

  const answers = submissionIds.length
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
        .where(inArray(workbookSubmissionAnswers.submissionId, submissionIds))
        .orderBy(asc(workbookQuestions.questionNumber))
    : [];

  const answersBySubmission = new Map<
    string,
    typeof answers
  >();

  for (const row of answers) {
    const existing = answersBySubmission.get(row.answer.submissionId) ?? [];
    existing.push(row);
    answersBySubmission.set(row.answer.submissionId, existing);
  }

  return rows.map((row) => ({
    ...row,
    answers: (answersBySubmission.get(row.submission.id) ?? []).sort(
      (a, b) => a.question.questionNumber - b.question.questionNumber,
    ),
  }));
}
