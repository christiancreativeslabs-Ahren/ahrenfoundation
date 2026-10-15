"use client";

import { Button } from "@/components/ui/button";

type AnswerRow = {
  questionNumber: number;
  prompt: string;
  answer: string;
};

export function ExportSubmissionButton({
  memberName,
  memberEmail,
  moduleTitle,
  moduleNumber,
  submittedAt,
  answers,
}: {
  memberName: string;
  memberEmail: string;
  moduleTitle: string;
  moduleNumber: number;
  submittedAt: string;
  answers: AnswerRow[];
}) {
  function handleExport() {
    const header = [
      "Member name",
      "Member email",
      "Module number",
      "Module title",
      "Submitted at",
      "Question number",
      "Question",
      "Answer",
    ];

    const rows = answers.map((a) => [
      memberName,
      memberEmail,
      String(moduleNumber),
      moduleTitle,
      submittedAt,
      String(a.questionNumber),
      a.prompt,
      a.answer,
    ]);

    const escape = (value: string) => {
      const v = value.replaceAll('"', '""');
      return `"${v}"`;
    };

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => escape(cell ?? "")).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeName = memberName.replace(/[^\w.-]+/g, "_").slice(0, 40);
    a.href = url;
    a.download = `workbook-submission-m${moduleNumber}-${safeName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="border-white/15 bg-transparent text-white hover:bg-white/10"
      onClick={handleExport}
    >
      Export responses
    </Button>
  );
}
