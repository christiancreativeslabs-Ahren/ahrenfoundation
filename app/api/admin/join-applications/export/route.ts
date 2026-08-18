import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";
import { getAdminEmails } from "@/lib/validations/join";
import {
  getJoinApplicationExportRows,
  type JoinApplicationListInput,
} from "@/lib/admin/join-applications";
import { convertToCSV, generateExportFilename } from "@/components/shared/table/csv-utils";

function parseParams(searchParams: URLSearchParams): Pick<JoinApplicationListInput, "search" | "applicationType" | "status"> {
  const applicationType = searchParams.get("applicationType");
  const status = searchParams.get("status");

  return {
    search: searchParams.get("search")?.trim() || undefined,
    applicationType:
      applicationType === "youth" || applicationType === "mentor"
        ? applicationType
        : "all",
    status:
      status === "pending" ||
      status === "reviewing" ||
      status === "approved" ||
      status === "rejected"
        ? status
        : undefined,
  };
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    return NextResponse.json({ message: "You must be signed in." }, { status: 401 });
  }

  if (!getAdminEmails().includes(session.user.email)) {
    return NextResponse.json({ message: "You do not have admin access." }, { status: 403 });
  }

  const url = new URL(request.url);
  const filters = parseParams(url.searchParams);
  const rows = await getJoinApplicationExportRows(filters);

  const csv = convertToCSV(rows);
  const filename = generateExportFilename("join-applications", "all", true, "csv");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
