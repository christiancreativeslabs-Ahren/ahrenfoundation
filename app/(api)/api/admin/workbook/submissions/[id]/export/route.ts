import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import {
  moduleSubmissionAnswers,
  moduleSubmissions,
  moduleQuestions,
  programMembers,
  programModules,
} from "@/db/schema";
import { getAdminEmails } from "@/lib/validations/join";

function csvEscape(value: string) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (
      !session?.user?.email ||
      !getAdminEmails().includes(session.user.email)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: submissionId } = await context.params;

    const [row] = await db
      .select({
        submissionId: moduleSubmissions.id,
        submittedAt: moduleSubmissions.submittedAt,
        memberName: programMembers.fullName,
        memberEmail: programMembers.email,
        moduleNumber: programModules.moduleNumber,
        moduleTitle: programModules.title,
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
      .where(eq(moduleSubmissions.id, submissionId))
      .limit(1);

    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const answers = await db
      .select({
        questionNumber: moduleQuestions.questionNumber,
        prompt: moduleQuestions.prompt,
        answer: moduleSubmissionAnswers.answer,
      })
      .from(moduleSubmissionAnswers)
      .innerJoin(
        moduleQuestions,
        eq(moduleQuestions.id, moduleSubmissionAnswers.questionId),
      )
      .where(eq(moduleSubmissionAnswers.submissionId, submissionId))
      .orderBy(moduleQuestions.questionNumber);

    // If your schema links answer → question differently, match getWorkbookSubmissionReviewData

    const submittedAt =
      row.submittedAt instanceof Date
        ? row.submittedAt.toISOString()
        : String(row.submittedAt ?? "");

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

    const lines = [
      header.map(csvEscape).join(","),
      ...answers.map((a) =>
        [
          row.memberName,
          row.memberEmail,
          String(row.moduleNumber),
          row.moduleTitle,
          submittedAt,
          String(a.questionNumber),
          a.prompt,
          a.answer,
        ]
          .map(csvEscape)
          .join(","),
      ),
    ];

    const csv = lines.join("\n");
    const safeName = row.memberName.replace(/[^\w.-]+/g, "_").slice(0, 40);
    const filename = `workbook-submission-m${row.moduleNumber}-${safeName}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("export submission failed", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}