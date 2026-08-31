import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getWorkbookModuleById, renderWorkbookModuleHtml } from "@/lib/workbook";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminWorkbookModulePage({
  params,
  searchParams,
}: {
  params: Promise<{ moduleId: string }>;
  searchParams: Promise<{ updated?: string }>;
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
          href="/admin/workbook"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          <ArrowLeft size={14} />
          Back to workbook
        </Link>
        <Link
          href={`/admin/workbook/${data.module.id}/edit`}
          className="inline-flex h-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] px-3 text-sm font-medium text-[#080d2e]"
        >
          Edit Workbook module
        </Link>
      </div>

      {query.updated === "1" ? (
        <Card className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100">
          <CardContent className="p-4 text-sm font-medium">
            Workbook module updated successfully.
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
            Workbook module
          </p>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Module {data.module.moduleNumber}: {data.module.title}
          </CardTitle>
          <CardDescription className="max-w-3xl text-slate-300">
            This is the admin view of the Workbook content that mentees read in the Hub and receive by email.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="text-lg">Workbook content</CardTitle>
            <CardDescription className="text-slate-300">
              {data.module.subtitle ?? "No subtitle provided"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-200 prose-p:leading-8 prose-a:text-[#00c9ff] prose-strong:text-white prose-li:text-slate-200 prose-blockquote:border-[#00ff9d]/50 prose-blockquote:text-slate-200"
              dangerouslySetInnerHTML={{ __html: renderWorkbookModuleHtml(data.module) }}
            />
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="text-lg">Module details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300">
            <p>Program: {data.program.name}</p>
            <p>Slug: {data.program.slug}</p>
            <p>Status: {data.module.status}</p>
            <p>Module key: {data.module.moduleKey}</p>
            <p>Questions: {data.questions.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">Questions</CardTitle>
          <CardDescription className="text-slate-300">
            Assignment prompts shown to mentees after the Workbook reading.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {data.questions.map((question) => (
            <div key={question.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <p className="max-w-4xl text-base font-semibold leading-7 text-white">
                  {question.questionNumber}. {question.prompt}
                </p>
                <Badge variant="outline" className="w-fit border-white/15 text-cyan-200">
                  {question.responseType}
                </Badge>
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                {question.isRequired ? "Required" : "Optional"}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
