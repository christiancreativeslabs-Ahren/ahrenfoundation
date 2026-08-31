import Link from "next/link";
import { ArrowLeft, BookOpen, Mail } from "lucide-react";
import { getWorkbookPreviewTemplates } from "@/lib/workbook/email-shared";

export const dynamic = "force-dynamic";

export default function WorkbookEmailPreviewIndexPage() {
  const templates = getWorkbookPreviewTemplates();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 rounded-2xl border border-white/10 bg-white/[0.04] p-8">
          <Link
            href="/email-preview"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#00ff9d] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to template index
          </Link>
          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Workbook Email Templates
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Preview the Ahren welcome emails, all 12 Workbook module emails,
            and the completion letter.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => {
            const Icon = template.templateKey.startsWith("module-")
              ? BookOpen
              : Mail;

            return (
              <Link
                key={template.templateKey}
                href={`/email-preview/workbook/${template.templateKey}`}
                className="group rounded-lg border border-white/10 bg-white/[0.04] p-5 transition hover:border-[#00c9ff]/45 hover:bg-white/[0.07]"
              >
                <div className="mb-4 inline-flex rounded-lg bg-[#00c9ff]/10 p-3 text-[#00c9ff] transition group-hover:bg-[#00ff9d]/10 group-hover:text-[#00ff9d]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {template.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {template.description}
                </p>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-[#00c9ff]">
                  {template.templateKey}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
