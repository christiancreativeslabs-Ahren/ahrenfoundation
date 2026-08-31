import Link from "next/link";
import { BookOpen, FileUp, LayoutGrid, ListChecks } from "lucide-react";
import { getActiveWorkbookProgram, getWorkbookModulesForProgram } from "@/lib/workbook";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminWorkbookPage() {
  const program = await getActiveWorkbookProgram();
  const modules = program ? await getWorkbookModulesForProgram(program.id) : [];

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
            Workbook
          </p>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Workbook administration
          </CardTitle>
          <CardDescription className="max-w-3xl text-slate-300">
            Manage the Workbook modules used by email delivery, Hub access, mentor review, and submissions.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link
            href="/email-preview/workbook"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] px-3 text-sm font-medium text-[#080d2e]"
          >
              <FileUp className="mr-2 h-4 w-4" />
              Preview emails
          </Link>
          <Link
            href="/admin/workbook/import"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm font-medium text-white hover:bg-white/[0.08]"
          >
              <FileUp className="mr-2 h-4 w-4" />
              Import Workbook
          </Link>
          <Link
            href="/admin/workbook/submissions"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm font-medium text-white hover:bg-white/[0.08]"
          >
              <ListChecks className="mr-2 h-4 w-4" />
              View submissions
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <CardTitle className="text-lg">Program state</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <p>Name: {program?.name ?? "No active Workbook"}</p>
              <p>Slug: {program?.slug ?? "-"}</p>
              <p>Status: {program?.status ?? "-"}</p>
              <p>Modules: {modules.length}</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <CardTitle className="text-lg">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-semibold text-white">List modules</p>
                <p className="mt-1 text-xs leading-6">
                  Open any module below to review its live Workbook content.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-semibold text-white">Single Workbook source</p>
                <p className="mt-1 text-xs leading-6">
                  Email delivery and Hub access now use the same Workbook module records.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg">Modules</CardTitle>
                <CardDescription className="text-slate-300">
                  Open a module to view it or edit it.
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-white/15 text-cyan-200">
                {modules.length} total
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {modules.length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {modules.map((module) => (
                  <div key={module.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                          Module {module.moduleNumber}
                        </p>
                        <h3 className="mt-2 text-xl font-bold text-white">{module.title}</h3>
                      </div>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
                        {module.status}
                      </span>
                    </div>
                    {module.focus ? (
                      <p className="mt-3 text-sm leading-6 text-slate-300">{module.focus}</p>
                    ) : null}
                    <p className="mt-2 text-xs text-slate-400">{module.moduleKey}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/admin/workbook/${module.id}`}
                        className="inline-flex h-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] px-3 text-sm font-medium text-[#080d2e]"
                      >
                          <BookOpen className="mr-2 h-4 w-4" />
                          View
                      </Link>
                      <Link
                        href={`/admin/workbook/${module.id}/edit`}
                        className="inline-flex h-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm font-medium text-white hover:bg-white/[0.08]"
                      >
                          <LayoutGrid className="mr-2 h-4 w-4" />
                          Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-300">
                No Workbook modules are published yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
