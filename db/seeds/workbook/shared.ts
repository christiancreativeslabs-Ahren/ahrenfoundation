import type { WorkbookModuleDefinition } from "@/lib/workbook/content";
import type { WorkbookImportModuleInput } from "@/lib/workbook";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paragraphText(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

export function renderWorkbookModuleHtml(
  module: WorkbookModuleDefinition,
): string {
  const scriptures = module.scriptures
    .map(
      (scripture) => `
        <li class="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
          <p class="text-sm leading-7 text-amber-50">${paragraphText(
            scripture.text,
          )}</p>
          <p class="mt-2 text-xs uppercase tracking-[0.3em] text-amber-200/70">${escapeHtml(
            scripture.reference,
          )}</p>
        </li>
      `,
    )
    .join("");

  const openingCopy = module.openingCopy
    .map(
      (paragraph) =>
        `<p class="text-sm leading-7 text-slate-200">${paragraphText(
          paragraph,
        )}</p>`,
    )
    .join("");

  return `
    <article class="space-y-8">
      <header class="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div class="flex flex-wrap gap-2 text-[11px] font-medium uppercase tracking-[0.35em] text-sky-200/80">
          <span>Week ${module.weekNumber}</span>
          <span>Module ${module.moduleNumber}</span>
          <span>${escapeHtml(module.sendDayLabel)}</span>
        </div>
        <div class="space-y-2">
          <h2 class="text-3xl font-semibold tracking-tight text-white">${escapeHtml(
            module.title,
          )}</h2>
          ${
            module.subtitle
              ? `<p class="text-sm leading-7 text-slate-300">${escapeHtml(
                  module.subtitle,
                )}</p>`
              : ""
          }
          <p class="text-sm leading-7 text-slate-300">${escapeHtml(
            module.previewText,
          )}</p>
        </div>
      </header>

      <section class="space-y-3">
        <h3 class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
          Opening
        </h3>
        <div class="space-y-3">${openingCopy}</div>
      </section>

      <section class="space-y-3">
        <h3 class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
          Key Scriptures
        </h3>
        <ul class="grid gap-3 md:grid-cols-2">${scriptures}</ul>
      </section>

      <section class="grid gap-4 md:grid-cols-2">
        <div class="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">
          <h3 class="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">
            Reflection
          </h3>
          <p class="mt-3 text-sm leading-7 text-slate-200">${paragraphText(
            module.reflection,
          )}</p>
        </div>
        <div class="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
          <h3 class="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200/70">
            This Week's Focus
          </h3>
          <p class="mt-3 text-sm leading-7 text-slate-200">${paragraphText(
            module.focus,
          )}</p>
          <h3 class="mt-5 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200/70">
            This Week's Action
          </h3>
          <p class="mt-3 text-sm leading-7 text-slate-200">${paragraphText(
            module.action,
          )}</p>
        </div>
      </section>
    </article>
  `;
}

export function toWorkbookImportModule(
  module: WorkbookModuleDefinition,
): WorkbookImportModuleInput {
  return {
    moduleKey: module.moduleKey,
    moduleNumber: module.moduleNumber,
    title: module.title,
    subtitle: module.subtitle ?? null,
    summary: module.previewText,
    contentHtml: renderWorkbookModuleHtml(module),
    status: "published",
    questions: module.questions.map((prompt) => ({
      prompt,
      responseType: "long_text",
      isRequired: true,
    })),
  };
}
