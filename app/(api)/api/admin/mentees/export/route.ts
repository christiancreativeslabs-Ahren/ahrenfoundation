import { NextRequest, NextResponse } from "next/server";
import { getMenteeExportRows } from "@/lib/admin/mentees";
import {
  parseMenteeListInput,
  type RawMenteeListParams,
} from "@/features/admin/mentees/list/_lib/parse-mentee-list-input";

export const dynamic = "force-dynamic";

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  return [
    headers.map(csvCell).join(","),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(",")),
  ].join("\n");
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const input = parseMenteeListInput(
    Object.fromEntries(url.searchParams.entries()) as RawMenteeListParams,
  );
  const rows = await getMenteeExportRows({
    search: input.search,
    status: input.status,
  });

  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ahren-mentees-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
