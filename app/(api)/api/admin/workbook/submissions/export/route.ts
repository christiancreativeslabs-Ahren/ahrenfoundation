import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import {
  moduleQuestions,
  moduleSubmissionAnswers,
  moduleSubmissions,
  programMembers,
  programModules,
} from "@/db/schema";
import { getAdminEmails } from "@/lib/validations/join";

function csvEscape(value: string) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export async function GET() {
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

    const rows = await db
      .select({
        submissionId: moduleSubmissions.id,
        submissionStatus: moduleSubmissions.status,
        submittedAt: moduleSubmissions.submittedAt,
        memberName: programMembers.fullName,
        memberEmail: programMembers.email,
        moduleNumber: programModules.moduleNumber,
        moduleTitle: programModules.title,
        questionNumber: moduleQuestions.questionNumber,
        prompt: moduleQuestions.prompt,
        answer: moduleSubmissionAnswers.answer,
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
      .innerJoin(
        moduleSubmissionAnswers,
        eq(moduleSubmissionAnswers.submissionId, moduleSubmissions.id),
      )
      .innerJoin(
        moduleQuestions,
        eq(moduleQuestions.id, moduleSubmissionAnswers.questionId),
      )
      .orderBy(
        asc(programMembers.fullName),
        asc(programModules.moduleNumber),
        asc(moduleQuestions.questionNumber),
      );

    // Align joins with getWorkbookSubmissionReviewData if column names differ

    const header = [
      "Submission id",
      "Submission status",
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
      ...rows.map((r) => {
        const submittedAt =
          r.submittedAt instanceof Date
            ? r.submittedAt.toISOString()
            : String(r.submittedAt ?? "");

        return [
          r.submissionId,
          r.submissionStatus ?? "",
          r.memberName,
          r.memberEmail,
          String(r.moduleNumber),
          r.moduleTitle,
          submittedAt,
          String(r.questionNumber),
          r.prompt,
          r.answer,
        ]
          .map(csvEscape)
          .join(",");
      }),
    ];

    const csv = lines.join("\n");
    const date = new Date().toISOString().slice(0, 10);
    const filename = `workbook-submissions-all-${date}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("export all submissions failed", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
