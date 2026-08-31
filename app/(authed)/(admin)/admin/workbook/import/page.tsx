import { importWorkbookFromJson } from "@/actions/workbook";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input-fields";

export const dynamic = "force-dynamic";

const initialActionState = { ok: false, message: "" };

async function importWorkbookAction(formData: FormData) {
  "use server";
  await importWorkbookFromJson(initialActionState, formData);
}

export default async function AdminWorkbookImportPage({
  searchParams,
}: {
  searchParams: Promise<{ imported?: string; error?: string }>;
}) {
  const query = await searchParams;

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
            Workbook
          </p>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Import Workbook JSON
          </CardTitle>
          <CardDescription className="max-w-3xl text-slate-300">
            Paste Workbook JSON here. The importer writes into the merged Workbook program, module, and question tables used by email delivery and Hub access.
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

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">Expected JSON shape</CardTitle>
          <CardDescription className="text-slate-300">
            The importer accepts the full Workbook module shape, including full contentHtml module bodies when supplied.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={importWorkbookAction} className="space-y-4">
            <Textarea
              name="workbook_json"
              className="min-h-[460px] border-white/10 bg-white/[0.04] font-mono text-xs text-white placeholder:text-slate-500"
              placeholder={`{
  "program": {
    "slug": "christian-creativity-masterclass",
    "name": "Ahren Christian Creativity Masterclass",
    "summary": "Workbook modules and assignments for Christian creatives.",
    "status": "published",
    "isActive": true
  },
  "modules": [
    {
      "moduleKey": "module-1",
      "moduleNumber": 1,
      "weekNumber": 1,
      "sendOffsetDays": 0,
      "sendDayLabel": "Monday",
      "title": "Module title",
      "subject": "Workbook module email subject",
      "previewText": "Short email preview text",
      "openingCopy": ["Opening paragraph"],
      "scriptures": [{ "text": "Scripture text", "reference": "Reference" }],
      "reflection": "Reflection content",
      "focus": "Module focus",
      "action": "Creative growth action",
      "contentHtml": "<h2>Full module body</h2><p>Optional formatted Workbook content.</p>",
      "questions": [
        { "prompt": "Question 1" }
      ]
    }
  ]
}`}
            />
            <Button type="submit" className="bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]">
              Validate and import
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
