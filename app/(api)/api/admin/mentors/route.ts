import { NextRequest, NextResponse } from "next/server";
import { getMentorListData } from "@/lib/admin/mentors";
import { requireAdminApiUser } from "@/lib/admin/api-auth";
import {
  parseMentorListInput,
  type RawMentorListParams,
} from "@/features/admin/mentors/list/_lib/parse-mentor-list-input";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdminApiUser();
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const searchParams = Object.fromEntries(
      url.searchParams.entries(),
    ) as RawMentorListParams;
    const input = parseMentorListInput(searchParams);
    const data = await getMentorListData(input);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to load mentors.",
      },
      { status: 500 },
    );
  }
}
