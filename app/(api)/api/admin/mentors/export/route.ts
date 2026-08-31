import { NextRequest, NextResponse } from "next/server";
import { getMentorExportRows, MENTOR_EXPORT_HEADERS } from "@/lib/admin/mentors";
import { requireAdminApiUser } from "@/lib/admin/api-auth";
import {
  parseMentorListInput,
  type RawMentorListParams,
} from "@/features/admin/mentors/list/_lib/parse-mentor-list-input";

export const dynamic = "force-dynamic";

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function toCsv(rows: Record<string, unknown>[]) {
  const headers = [...MENTOR_EXPORT_HEADERS];
  return [
    headers.map(csvCell).join(","),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(",")),
  ].join("\n");
}

export async function GET(request: NextRequest) {
  const admin = await requireAdminApiUser();
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const input = parseMentorListInput(
    Object.fromEntries(url.searchParams.entries()) as RawMentorListParams,
  );
  const rows = await getMentorExportRows({
    search: input.search,
    status: input.status,
  });

  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ahren-mentors-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
