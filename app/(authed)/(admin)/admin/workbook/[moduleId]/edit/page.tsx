import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { saveWorkbookModuleAction } from "@/actions/workbook";
import { getWorkbookModuleById, renderWorkbookModuleHtml } from "@/lib/workbook";
import { WorkbookModuleEditor } from "@/components/admin/workbook-module-editor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const initialActionState = { ok: false, message: "" };

async function saveWorkbookAction(formData: FormData) {
  "use server";
  await saveWorkbookModuleAction(initialActionState, formData);
}

export default async function AdminWorkbookModuleEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ moduleId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { moduleId } = await params;
  const query = await searchParams;
  const data = await getWorkbookModuleById(moduleId);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/admin/workbook/${data.module.id}`}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          <ArrowLeft size={14} />
          Back to module
        </Link>
        <Link
          href="/admin/workbook"
          className="inline-flex h-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm font-medium text-white hover:bg-white/[0.08]"
        >
          Workbook modules
        </Link>
      </div>

      {query.error ? (
        <Card className="border-rose-400/20 bg-rose-400/10 text-rose-100">
          <CardContent className="p-4 text-sm font-medium">{query.error}</CardContent>
        </Card>
      ) : null}

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
            Workbook module editor
          </p>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Edit module {data.module.moduleNumber}
          </CardTitle>
          <CardDescription className="max-w-3xl text-slate-300">
            Update the Workbook content used in the Hub, email delivery, mentor review, and submissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorkbookModuleEditor
            action={saveWorkbookAction}
            module={{
              id: data.module.id,
              moduleKey: data.module.moduleKey,
              moduleNumber: data.module.moduleNumber,
              weekNumber: data.module.weekNumber,
              sendOffsetDays: data.module.sendOffsetDays,
              sendDayLabel: data.module.sendDayLabel,
              title: data.module.title,
              subtitle: data.module.subtitle,
              subject: data.module.subject,
              previewText: data.module.previewText,
              openingCopy: data.module.openingCopy,
              scriptureText: data.module.scriptureText,
              scriptureReference: data.module.scriptureReference,
              reflection: data.module.reflection,
              focus: data.module.focus,
              action: data.module.action,
              contentHtml: renderWorkbookModuleHtml(data.module),
              status: data.module.status,
            }}
            questions={data.questions.map((question) => ({
              prompt: question.prompt,
              responseType: question.responseType,
              isRequired: question.isRequired,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
