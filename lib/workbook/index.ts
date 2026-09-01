import "server-only";

import { and, asc, desc, eq, gt, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  moduleDeliveries,
  moduleQuestions,
  moduleSubmissionAnswers,
  moduleSubmissions,
  programMembers,
  programModules,
  programs,
} from "@/db/schema";
import {
  AHREN_WORKBOOK_PROGRAM,
  type WorkbookModuleDefinition,
} from "@/lib/workbook/content";
import {
  ensureAhrenWorkbookProgram as ensureAhrenWorkbookProgramCore,
  syncMemberWorkbookDeliveries,
} from "@/lib/workbook/service";

export const DEFAULT_WORKBOOK_PROGRAM = {
  slug: AHREN_WORKBOOK_PROGRAM.slug,
  name: AHREN_WORKBOOK_PROGRAM.name,
  summary: AHREN_WORKBOOK_PROGRAM.summary,
};

const LEGACY_WORKBOOK_PROGRAM_SLUGS = new Set(["ahren-workbook"]);

export type WorkbookImportQuestionInput = {
  prompt: string;
  responseType?: string;
  isRequired?: boolean;
};

export type WorkbookImportModuleInput = {
  moduleKey: string;
  moduleNumber: number;
  weekNumber?: number;
  sendOffsetDays?: number;
  sendDayLabel?: string;
  title: string;
  subtitle?: string | null;
  subject?: string;
  previewText?: string | null;
  openingCopy?: string[] | string;
  scriptures?: Array<{ text: string; reference: string }>;
  scriptureText?: string;
  scriptureReference?: string;
  reflection?: string;
  focus?: string;
  action?: string;
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
    startsAfterDays?: number;
    isActive?: boolean;
    payload?: Record<string, unknown>;
  };
  modules: WorkbookImportModuleInput[];
};

type NormalizedWorkbookModule = Omit<
  Required<WorkbookImportModuleInput>,
  "openingCopy" | "scriptures" | "questions" | "summary" | "contentHtml"
> & {
  openingCopy: string[];
  scriptures: Array<{ text: string; reference: string }>;
  questions: Required<WorkbookImportQuestionInput>[];
  summary: string | null;
  contentHtml: string;
};

export type WorkbookSubmissionDetail = Awaited<
  ReturnType<typeof getWorkbookSubmissionById>
>;

function normalizeString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeInteger(value: unknown, fallback: number) {
  const normalized = normalizeNumber(value, fallback);
  return Number.isInteger(normalized) ? normalized : fallback;
}

function normalizeProgramSlug(value: unknown) {
  const slug = normalizeString(value, DEFAULT_WORKBOOK_PROGRAM.slug);
  return LEGACY_WORKBOOK_PROGRAM_SLUGS.has(slug)
    ? DEFAULT_WORKBOOK_PROGRAM.slug
    : slug;
}

function modulePayload(module: { payload: Record<string, unknown> | null }) {
  return module.payload && typeof module.payload === "object"
    ? module.payload
    : {};
}

export function getWorkbookModuleContentHtml(module: {
  payload: Record<string, unknown> | null;
}) {
  const contentHtml = modulePayload(module).contentHtml;
  return typeof contentHtml === "string" ? contentHtml : "";
}

function renderRichModuleHtml(module: any) {
  const parts: string[] = [];

  // Title + Subtitle
  parts.push(
    `<h2>Module ${module.moduleNumber}: ${escapeHtml(module.title)}</h2>`,
  );
  if (module.subtitle) {
    parts.push(`<p><strong>${escapeHtml(module.subtitle)}</strong></p>`);
  }

  // Opening
  if (module.openingCopy?.length) {
    parts.push(paragraphs(module.openingCopy));
  }

  // Scriptures
  if (module.scriptures?.length) {
    parts.push(`<h3>Key Scriptures</h3>`);
    parts.push(
      `<ul>${module.scriptures
        .map(
          (s: any) =>
            `<li><em>${escapeHtml(s.text)}</em> — ${escapeHtml(s.reference)}</li>`,
        )
        .join("")}</ul>`,
    );
  }

  // Body sections
  if (module.bodySections?.length) {
    for (const section of module.bodySections) {
      if (section.heading) {
        parts.push(`<h3>${escapeHtml(section.heading)}</h3>`);
      }
      if (section.paragraphs?.length) {
        parts.push(paragraphs(section.paragraphs));
      }
      if (section.bullets?.length) {
        parts.push(
          `<ul>${section.bullets
            .map((b: string) => `<li>${escapeHtml(b)}</li>`)
            .join("")}</ul>`,
        );
      }
      if (section.closing) {
        parts.push(`<p>${escapeHtml(section.closing)}</p>`);
      }
      // Table (Lies the World Tells You)
      if (section.table) {
        parts.push(renderTable(section.table));
      }
    }
  }

  // Reflection + Focus + Action (still useful)
  if (module.reflection) {
    parts.push(`<h3>Reflection</h3><p>${escapeHtml(module.reflection)}</p>`);
  }
  if (module.focus) {
    parts.push(`<h3>Focus</h3><p>${escapeHtml(module.focus)}</p>`);
  }

  // This Week's Creative Growth Actions
  if (module.thisWeeksActions) {
    parts.push(`<h3>This Week's Creative Growth Actions</h3>`);
    if (module.thisWeeksActions.intro) {
      parts.push(`<p>${escapeHtml(module.thisWeeksActions.intro)}</p>`);
    }
    if (module.thisWeeksActions.items?.length) {
      parts.push(
        `<ol>${module.thisWeeksActions.items
          .map((item: string) => `<li>${escapeHtml(item)}</li>`)
          .join("")}</ol>`,
      );
    }
  } else if (module.action) {
    parts.push(
      `<h3>Creative Growth Action</h3><p>${escapeHtml(module.action)}</p>`,
    );
  }

  // Questions
  if (module.questions?.length) {
    parts.push(`<h3>Reflection Questions</h3>`);
    parts.push(
      `<ol>${module.questions
        .map((q: string) => `<li>${escapeHtml(q)}</li>`)
        .join("")}</ol>`,
    );
  }

  // Prayer
  if (module.prayer) {
    parts.push(
      `<h3>${escapeHtml(module.prayer.title || "A Prayer for Your Week")}</h3>`,
    );
    parts.push(`<p><em>${escapeHtml(module.prayer.text)}</em></p>`);
  }

  // Final Word
  if (module.finalWord) {
    parts.push(
      `<h3>${escapeHtml(module.finalWord.title || "A Final Word")}</h3>`,
    );
    parts.push(`<p>${escapeHtml(module.finalWord.text)}</p>`);
  }

  // Closing
  if (module.closing) {
    parts.push(
      `<h3>${escapeHtml(module.closing.title || "See You Next Week")}</h3>`,
    );
    parts.push(`<p>${escapeHtml(module.closing.text)}</p>`);
    if (module.closing.signature) {
      parts.push(
        `<p><strong>${escapeHtml(module.closing.signature)}</strong></p>`,
      );
    }
  }

  return parts.filter(Boolean).join("");
}

function renderTable(table: { headers: string[]; rows: string[][] }) {
  const headerRow = `<tr>${table.headers
    .map((h) => `<th>${escapeHtml(h)}</th>`)
    .join("")}</tr>`;
  const bodyRows = table.rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`,
    )
    .join("");
  return `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;margin:1em 0;">
    <thead>${headerRow}</thead>
    <tbody>${bodyRows}</tbody>
  </table>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function htmlToText(value: string) {
  return value
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\s*\/p\s*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function paragraphs(value: string | string[] | null | undefined): string {
  if (!value) return "";

  const lines = Array.isArray(value) ? value : value.split("\n");

  return lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
}

// function paragraphs(value: string) {
//   return value
//     .split("\n")
//     .map((line) => line.trim())
//     .filter(Boolean)
//     .map((line) => `<p>${escapeHtml(line)}</p>`)
//     .join("");
// }

function coerceOpeningCopy(value: WorkbookImportModuleInput) {
  if (Array.isArray(value.openingCopy)) {
    return value.openingCopy
      .map((line) => normalizeString(line))
      .filter(Boolean);
  }

  if (typeof value.openingCopy === "string") {
    return value.openingCopy
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  if (value.contentHtml) {
    return htmlToText(value.contentHtml)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 4);
  }

  return [];
}

function coerceScriptures(value: WorkbookImportModuleInput) {
  if (Array.isArray(value.scriptures)) {
    return value.scriptures
      .map((scripture) => ({
        text: normalizeString(scripture.text),
        reference: normalizeString(scripture.reference),
      }))
      .filter((scripture) => scripture.text || scripture.reference);
  }

  const scriptureText = normalizeString(value.scriptureText);
  const scriptureReference = normalizeString(value.scriptureReference);
  if (!scriptureText && !scriptureReference) return [];

  const texts = scriptureText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const references = scriptureReference
    .split(";")
    .map((line) => line.trim())
    .filter(Boolean);

  return texts.map((text, index) => ({
    text,
    reference: references[index] ?? "",
  }));
}

function scriptureText(
  module: Pick<
    WorkbookImportModuleInput,
    "scriptures" | "scriptureText" | "scriptureReference"
  >,
) {
  return coerceScriptures(module as WorkbookImportModuleInput)
    .map((scripture) => scripture.text)
    .join("\n");
}

function scriptureReference(
  module: Pick<
    WorkbookImportModuleInput,
    "scriptures" | "scriptureText" | "scriptureReference"
  >,
) {
  return coerceScriptures(module as WorkbookImportModuleInput)
    .map((scripture) => scripture.reference)
    .join("; ");
}

function defaultModuleByNumber(moduleNumber: number) {
  return AHREN_WORKBOOK_PROGRAM.modules.find(
    (module) => module.moduleNumber === moduleNumber,
  );
}

function normalizeImportedModule(
  input: WorkbookImportModuleInput,
): NormalizedWorkbookModule {
  const moduleNumber = normalizeInteger(input.moduleNumber, 0);
  const fallback = defaultModuleByNumber(moduleNumber);
  const openingCopy = coerceOpeningCopy(input);
  const scriptures = coerceScriptures(input);
  const contentText = input.contentHtml ? htmlToText(input.contentHtml) : "";

  const fallbackQuestions: WorkbookImportQuestionInput[] =
    fallback?.questions.map((prompt) => ({ prompt })) ?? [];
  const normalized: NormalizedWorkbookModule = {
    moduleKey: normalizeString(
      input.moduleKey,
      fallback?.moduleKey ?? `module-${moduleNumber}`,
    ),
    moduleNumber,
    weekNumber: normalizeInteger(
      input.weekNumber,
      fallback?.weekNumber ?? Math.ceil(moduleNumber / 2),
    ),
    sendOffsetDays: normalizeInteger(
      input.sendOffsetDays,
      fallback?.sendOffsetDays ?? Math.max(0, (moduleNumber - 1) * 4),
    ),
    sendDayLabel: normalizeString(
      input.sendDayLabel,
      fallback?.sendDayLabel ?? "Monday",
    ),
    title: normalizeString(input.title, fallback?.title ?? "Untitled module"),
    subtitle: input.subtitle ?? fallback?.subtitle ?? null,
    subject: normalizeString(input.subject, fallback?.subject ?? input.title),
    previewText: input.previewText ?? fallback?.previewText ?? null,
    openingCopy: openingCopy.length
      ? openingCopy
      : (fallback?.openingCopy ?? []),
    scriptureText:
      scriptureText({
        scriptures,
        scriptureText: input.scriptureText,
        scriptureReference: input.scriptureReference,
      }) ||
      (fallback
        ? fallback.scriptures.map((scripture) => scripture.text).join("\n")
        : ""),
    scriptureReference:
      scriptureReference({
        scriptures,
        scriptureText: input.scriptureText,
        scriptureReference: input.scriptureReference,
      }) ||
      (fallback
        ? fallback.scriptures.map((scripture) => scripture.reference).join("; ")
        : ""),
    reflection: normalizeString(
      input.reflection,
      fallback?.reflection ?? contentText,
    ),
    focus: normalizeString(
      input.focus,
      fallback?.focus ?? input.summary ?? "Complete this workbook module.",
    ),
    action: normalizeString(
      input.action,
      fallback?.action ?? "Complete the workbook questions for this module.",
    ),
    summary: input.summary ?? fallback?.focus ?? null,
    contentHtml: input.contentHtml ?? "",
    status: normalizeString(input.status, "published"),
    scriptures: scriptures.length ? scriptures : (fallback?.scriptures ?? []),
    questions: (input.questions ?? fallbackQuestions)
      .map((question) => ({
        prompt: normalizeString(question.prompt),
        responseType: normalizeString(question.responseType, "long_text"),
        isRequired: normalizeBoolean(question.isRequired, true),
      }))
      .filter((question) => question.prompt),
  };

  if (!normalized.moduleKey)
    throw new Error("Workbook module is missing moduleKey.");
  if (
    !Number.isInteger(normalized.moduleNumber) ||
    normalized.moduleNumber <= 0
  ) {
    throw new Error(
      `Workbook module "${normalized.moduleKey}" needs a positive moduleNumber.`,
    );
  }
  if (!normalized.title)
    throw new Error(
      `Workbook module "${normalized.moduleKey}" is missing a title.`,
    );
  if (!normalized.openingCopy.length) {
    throw new Error(
      `Workbook module "${normalized.moduleKey}" is missing opening copy.`,
    );
  }
  if (!normalized.reflection) {
    throw new Error(
      `Workbook module "${normalized.moduleKey}" is missing reflection content.`,
    );
  }
  if (!normalized.focus)
    throw new Error(
      `Workbook module "${normalized.moduleKey}" is missing focus content.`,
    );
  if (!normalized.action)
    throw new Error(
      `Workbook module "${normalized.moduleKey}" is missing action content.`,
    );
  if (!normalized.questions.length) {
    throw new Error(
      `Workbook module "${normalized.moduleKey}" must include at least one question.`,
    );
  }

  return normalized;
}

export function parseWorkbookImportDefinition(
  raw: string,
): WorkbookImportDefinition {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Workbook import JSON must be valid JSON.");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(
      "Workbook import JSON must be an object with a modules array.",
    );
  }

  const source = parsed as Record<string, unknown>;
  if (!Array.isArray(source.modules) || !source.modules.length) {
    throw new Error("Workbook import JSON must include at least one module.");
  }

  const modules = source.modules.map((module, index) => {
    if (!module || typeof module !== "object" || Array.isArray(module)) {
      throw new Error(`Workbook module ${index + 1} must be an object.`);
    }
    return normalizeImportedModule(module as WorkbookImportModuleInput);
  });

  const keys = new Set<string>();
  const numbers = new Set<number>();
  for (const module of modules) {
    if (keys.has(module.moduleKey))
      throw new Error(
        `Workbook module key "${module.moduleKey}" is duplicated.`,
      );
    if (numbers.has(module.moduleNumber))
      throw new Error(
        `Workbook module number "${module.moduleNumber}" is duplicated.`,
      );
    keys.add(module.moduleKey);
    numbers.add(module.moduleNumber);
  }

  return {
    program:
      source.program &&
      typeof source.program === "object" &&
      !Array.isArray(source.program)
        ? (source.program as WorkbookImportDefinition["program"])
        : undefined,
    modules,
  };
}

export async function ensureAhrenWorkbookProgram() {
  return ensureAhrenWorkbookProgramCore();
}

export async function upsertWorkbookFromDefinition(
  definition: WorkbookImportDefinition,
) {
  const programInput = definition.program ?? {};
  const modules = definition.modules.map(normalizeImportedModule);

  const [program] = await db
    .insert(programs)
    .values({
      slug: normalizeProgramSlug(programInput.slug),
      name: normalizeString(programInput.name, DEFAULT_WORKBOOK_PROGRAM.name),
      summary: normalizeString(
        programInput.summary,
        DEFAULT_WORKBOOK_PROGRAM.summary,
      ),
      startsAfterDays: normalizeInteger(
        programInput.startsAfterDays,
        AHREN_WORKBOOK_PROGRAM.startsAfterDays,
      ),
      status: normalizeString(programInput.status, "published"),
      isActive: normalizeBoolean(programInput.isActive, true),
      payload: {
        ...(programInput.payload ?? {}),
        source: "workbook-import",
        sourceSlug: LEGACY_WORKBOOK_PROGRAM_SLUGS.has(
          normalizeString(programInput.slug),
        )
          ? normalizeString(programInput.slug)
          : undefined,
        moduleCount: modules.length,
      },
    })
    .onConflictDoUpdate({
      target: programs.slug,
      set: {
        name: normalizeString(programInput.name, DEFAULT_WORKBOOK_PROGRAM.name),
        summary: normalizeString(
          programInput.summary,
          DEFAULT_WORKBOOK_PROGRAM.summary,
        ),
        startsAfterDays: normalizeInteger(
          programInput.startsAfterDays,
          AHREN_WORKBOOK_PROGRAM.startsAfterDays,
        ),
        status: normalizeString(programInput.status, "published"),
        isActive: normalizeBoolean(programInput.isActive, true),
        updatedAt: new Date(),
        payload: {
          ...(programInput.payload ?? {}),
          source: "workbook-import",
          sourceSlug: LEGACY_WORKBOOK_PROGRAM_SLUGS.has(
            normalizeString(programInput.slug),
          )
            ? normalizeString(programInput.slug)
            : undefined,
          moduleCount: modules.length,
        },
      },
    })
    .returning();

  const moduleRows: Array<typeof programModules.$inferSelect> = [];

  for (const moduleInput of modules) {
    const [moduleRow] = await db
      .insert(programModules)
      .values({
        programId: program.id,
        moduleKey: moduleInput.moduleKey,
        moduleNumber: moduleInput.moduleNumber,
        weekNumber: moduleInput.weekNumber,
        sendOffsetDays: moduleInput.sendOffsetDays,
        sendDayLabel: moduleInput.sendDayLabel,
        title: moduleInput.title,
        subtitle: moduleInput.subtitle,
        subject: moduleInput.subject,
        previewText: moduleInput.previewText,
        openingCopy: moduleInput.openingCopy.join("\n"),
        scriptureText: moduleInput.scriptureText,
        scriptureReference: moduleInput.scriptureReference,
        reflection: moduleInput.reflection,
        focus: moduleInput.focus,
        action: moduleInput.action,
        sortOrder: moduleInput.moduleNumber,
        status: moduleInput.status,
        payload: {
          scriptures: moduleInput.scriptures,
          contentHtml: moduleInput.contentHtml,
          summary: moduleInput.summary,
        },
      })
      .onConflictDoUpdate({
        target: [programModules.programId, programModules.moduleKey],
        set: {
          moduleNumber: moduleInput.moduleNumber,
          weekNumber: moduleInput.weekNumber,
          sendOffsetDays: moduleInput.sendOffsetDays,
          sendDayLabel: moduleInput.sendDayLabel,
          title: moduleInput.title,
          subtitle: moduleInput.subtitle,
          subject: moduleInput.subject,
          previewText: moduleInput.previewText,
          openingCopy: moduleInput.openingCopy.join("\n"),
          scriptureText: moduleInput.scriptureText,
          scriptureReference: moduleInput.scriptureReference,
          reflection: moduleInput.reflection,
          focus: moduleInput.focus,
          action: moduleInput.action,
          sortOrder: moduleInput.moduleNumber,
          status: moduleInput.status,
          updatedAt: new Date(),
          payload: {
            scriptures: moduleInput.scriptures,
            contentHtml: moduleInput.contentHtml,
            summary: moduleInput.summary,
          },
        },
      })
      .returning();

    moduleRows.push(moduleRow);

    for (let index = 0; index < moduleInput.questions.length; index += 1) {
      const question = moduleInput.questions[index];
      await db
        .insert(moduleQuestions)
        .values({
          moduleId: moduleRow.id,
          questionNumber: index + 1,
          prompt: question.prompt,
          responseType: question.responseType,
          isRequired: question.isRequired,
        })
        .onConflictDoUpdate({
          target: [moduleQuestions.moduleId, moduleQuestions.questionNumber],
          set: {
            prompt: question.prompt,
            responseType: question.responseType,
            isRequired: question.isRequired,
            updatedAt: new Date(),
          },
        });
    }

    await db
      .delete(moduleQuestions)
      .where(
        and(
          eq(moduleQuestions.moduleId, moduleRow.id),
          gt(moduleQuestions.questionNumber, moduleInput.questions.length),
        ),
      );
  }

  return { program, modules: moduleRows };
}

export async function getActiveWorkbookProgram() {
  await ensureAhrenWorkbookProgram();

  const [program] = await db
    .select()
    .from(programs)
    .where(
      and(
        eq(programs.slug, DEFAULT_WORKBOOK_PROGRAM.slug),
        eq(programs.isActive, true),
      ),
    )
    .orderBy(desc(programs.updatedAt))
    .limit(1);

  return program ?? null;
}

export async function getWorkbookModulesForProgram(programId: string) {
  return db
    .select()
    .from(programModules)
    .where(eq(programModules.programId, programId))
    .orderBy(asc(programModules.sortOrder), asc(programModules.moduleNumber));
}

export async function getWorkbookModuleById(moduleId: string) {
  const [module] = await db
    .select({ module: programModules, program: programs })
    .from(programModules)
    .innerJoin(programs, eq(programs.id, programModules.programId))
    .where(eq(programModules.id, moduleId))
    .limit(1);

  if (!module) return null;

  const questions = await db
    .select()
    .from(moduleQuestions)
    .where(eq(moduleQuestions.moduleId, module.module.id))
    .orderBy(asc(moduleQuestions.questionNumber));

  return { module: module.module, program: module.program, questions };
}

export async function getWorkbookMemberDashboard(programMemberId: string) {
  const activeProgram = await getActiveWorkbookProgram();

  if (!activeProgram) {
    return {
      program: null,
      modules: [],
      availableModules: [],
      lockedModules: [],
      submissions: [],
      deliveries: [],
      completedModuleIds: new Set<string>(),
      currentModule: null,
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
      availableModules: [],
      lockedModules: [],
      submissions: [],
      deliveries: [],
      completedModuleIds: new Set<string>(),
      currentModule: null,
    };
  }

  await syncMemberWorkbookDeliveries(programMemberId);

  const [modules, submissions, deliveries] = await Promise.all([
    getWorkbookModulesForProgram(activeProgram.id),
    db
      .select()
      .from(moduleSubmissions)
      .where(eq(moduleSubmissions.programMemberId, programMemberId))
      .orderBy(desc(moduleSubmissions.submittedAt)),
    db
      .select()
      .from(moduleDeliveries)
      .where(eq(moduleDeliveries.programMemberId, programMemberId))
      .orderBy(asc(moduleDeliveries.scheduledFor)),
  ]);

  const now = new Date();
  const deliveryByModuleId = new Map(
    deliveries.map((delivery) => [delivery.moduleId, delivery]),
  );
  const completedModuleIds = new Set(
    submissions.map((submission) => submission.moduleId),
  );
  const availableModules = modules.filter((module) => {
    const delivery = deliveryByModuleId.get(module.id);
    if (!delivery) return false;
    return delivery.scheduledFor <= now || completedModuleIds.has(module.id);
  });
  const lockedModules = modules.filter(
    (module) =>
      !availableModules.some((available) => available.id === module.id),
  );
  const currentModule =
    availableModules.find((module) => !completedModuleIds.has(module.id)) ??
    availableModules.at(-1) ??
    null;

  return {
    program: activeProgram,
    modules,
    availableModules,
    lockedModules,
    submissions,
    deliveries,
    completedModuleIds,
    currentModule,
  };
}

export async function getWorkbookModulePageData(
  moduleId: string,
  programMemberId: string,
) {
  const module = await getWorkbookModuleById(moduleId);
  if (!module) return null;

  await syncMemberWorkbookDeliveries(programMemberId);

  const [[submission], [delivery]] = await Promise.all([
    db
      .select()
      .from(moduleSubmissions)
      .where(
        and(
          eq(moduleSubmissions.moduleId, module.module.id),
          eq(moduleSubmissions.programMemberId, programMemberId),
        ),
      )
      .orderBy(desc(moduleSubmissions.submittedAt))
      .limit(1),
    db
      .select()
      .from(moduleDeliveries)
      .where(
        and(
          eq(moduleDeliveries.moduleId, module.module.id),
          eq(moduleDeliveries.programMemberId, programMemberId),
        ),
      )
      .orderBy(desc(moduleDeliveries.scheduledFor))
      .limit(1),
  ]);

  const isAvailable =
    Boolean(delivery && delivery.scheduledFor <= new Date()) ||
    Boolean(submission);
  if (!isAvailable) return null;

  const answers = submission
    ? await db
        .select()
        .from(moduleSubmissionAnswers)
        .where(eq(moduleSubmissionAnswers.submissionId, submission.id))
        .orderBy(asc(moduleSubmissionAnswers.createdAt))
    : [];

  return {
    ...module,
    delivery: delivery ?? null,
    submission: submission ?? null,
    answers,
  };
}

export async function getWorkbookSubmissionById(submissionId: string) {
  const [row] = await db
    .select({
      submission: moduleSubmissions,
      member: programMembers,
      module: programModules,
      program: programs,
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
    .innerJoin(programs, eq(programs.id, programModules.programId))
    .where(eq(moduleSubmissions.id, submissionId))
    .limit(1);

  if (!row) return null;

  const answers = await db
    .select({ answer: moduleSubmissionAnswers, question: moduleQuestions })
    .from(moduleSubmissionAnswers)
    .innerJoin(
      moduleQuestions,
      eq(moduleQuestions.id, moduleSubmissionAnswers.questionId),
    )
    .where(eq(moduleSubmissionAnswers.submissionId, submissionId))
    .orderBy(asc(moduleQuestions.questionNumber));

  return { ...row, answers };
}

export function renderWorkbookModuleHtml(
  module: any,
  // module: typeof programModules.$inferSelect,
) {
  const contentHtml = getWorkbookModuleContentHtml(module);
  if (contentHtml) return contentHtml;

  const m = module as any;
  // New rich structure path
  if (m.bodySections || m.thisWeeksActions || m.prayer) {
    return renderRichModuleHtml(module);
  }

  const scriptures = module.scriptureText
    .split("\n")
    .map((line: any) => line.trim())
    .filter(Boolean);
  const references = module.scriptureReference
    .split(";")
    .map((line: any) => line.trim())
    .filter(Boolean);

  return [
    `<h2>Module ${module.moduleNumber}: ${escapeHtml(module.title)}</h2>`,
    module.subtitle
      ? `<p><strong>${escapeHtml(module.subtitle)}</strong></p>`
      : "",
    paragraphs(module.openingCopy),
    scriptures.length
      ? `<h3>Key Scriptures</h3><ul>${scriptures
          .map((scripture: any, index: any) => {
            const reference = references[index]
              ? ` - ${references[index]}`
              : "";
            return `<li>${escapeHtml(`${scripture}${reference}`)}</li>`;
          })
          .join("")}</ul>`
      : "",
    `<h3>Reflection</h3><p>${escapeHtml(module.reflection)}</p>`,
    `<h3>Focus</h3><p>${escapeHtml(module.focus)}</p>`,
    `<h3>Creative Growth Action</h3><p>${escapeHtml(module.action)}</p>`,
  ]
    .filter(Boolean)
    .join("");
}
