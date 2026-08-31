import { NextRequest, NextResponse } from "next/server";
import { getMenteeListData } from "@/lib/admin/mentees";
import {
  parseMenteeListInput,
  type RawMenteeListParams,
} from "@/features/admin/mentees/list/_lib/parse-mentee-list-input";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(
      url.searchParams.entries(),
    ) as RawMenteeListParams;
    const input = parseMenteeListInput(searchParams);
    const data = await getMenteeListData(input);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to load mentees.",
      },
      { status: 500 },
    );
  }
}
