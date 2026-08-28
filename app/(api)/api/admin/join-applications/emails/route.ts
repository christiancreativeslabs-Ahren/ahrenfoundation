import { NextResponse } from "next/server";
import { getJoinApplicationEmails } from "@/lib/admin/join-applications";

export async function GET() {
  try {
    const emails = await getJoinApplicationEmails();

    return NextResponse.json({ emails });
  } catch (error) {
    console.error("Failed to fetch join application emails:", error);

    return NextResponse.json(
      { error: "Failed to fetch join application emails" },
      { status: 500 },
    );
  }
}
