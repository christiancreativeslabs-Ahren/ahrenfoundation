import { importWorkbookFromJson } from "@/actions/workbook";
import { getActiveWorkbookProgram, getWorkbookModulesForProgram } from "@/lib/workbook";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input-fields";

export const dynamic = "force-dynamic";

const initialActionState = { ok: false, message: "" };

async function importWorkbookAction(formData: FormData) {
  "use server";
  await importWorkbookFromJson(initialActionState, formData);
}

export default async function AdminWorkbookPage({
  searchParams,
}: {
  searchParams: Promise<{ imported?: string; error?: string }>;
}) {
  const query = await searchParams;
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
            Import the workbook structure, review the active program, and prepare the content that mentees will read inside the app.
          </CardDescription>
        </CardHeader>
      </Card>

      {query.imported === "1" ? (
        <Card className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100">
          <CardContent className="p-4 text-sm font-medium">
            Workbook imported successfully.
          </CardContent>
        </Card>
      ) : null}

      {query.error ? (
        <Card className="border-rose-400/20 bg-rose-400/10 text-rose-100">
          <CardContent className="p-4 text-sm font-medium">{query.error}</CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="text-lg">Import workbook JSON</CardTitle>
            <CardDescription className="text-slate-300">
              Paste the workbook structure here when you are ready to seed the lesson content. The import will create the workbook program, modules, and 5 questions per module from your file data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={importWorkbookAction} className="space-y-4">
              <Textarea
                name="workbook_json"
                className="min-h-[340px] border-white/10 bg-white/[0.04] font-mono text-xs text-white placeholder:text-slate-500"
                placeholder={`{
  "program": {
    "slug": "ahren-workbook",
    "name": "Ahren Workbook",
    "summary": "Weekly workbook lessons and assessments",
    "isActive": true
  },
  "modules": [
    {
      "moduleKey": "module-1",
      "moduleNumber": 1,
      "title": "Module title",
      "contentHtml": "<p>Workbook lesson content</p>",
      "questions": [
        { "prompt": "Question 1" },
        { "prompt": "Question 2" },
        { "prompt": "Question 3" },
        { "prompt": "Question 4" },
        { "prompt": "Question 5" }
      ]
    }
  ]
}`}
              />
              <Button type="submit" className="bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]">
                Import workbook
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <CardTitle className="text-lg">Program state</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <p>Name: {program?.name ?? "No active workbook"}</p>
              <p>Slug: {program?.slug ?? "-"}</p>
              <p>Status: {program?.status ?? "-"}</p>
              <p>Modules: {modules.length}</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <CardTitle className="text-lg">Imported modules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {modules.map((module) => (
                <div key={module.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-white">
                    Module {module.moduleNumber}: {module.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{module.moduleKey}</p>
                  {module.summary ? (
                    <p className="mt-2 text-xs leading-6 text-slate-300">{module.summary}</p>
                  ) : null}
                </div>
              ))}
              {!modules.length ? (
                <p className="text-sm text-slate-400">
                  No workbook modules have been imported yet.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
