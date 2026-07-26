import { NextRequest, NextResponse } from "next/server";
import { getEventListData } from "@/lib/admin/events";
import {
  parseEventListInput,
  type RawEventListParams,
} from "@/features/admin/events/list/_lib/parse-event-list-input";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(
      url.searchParams.entries(),
    ) as RawEventListParams;
    const input = parseEventListInput(searchParams);
    const data = await getEventListData(input);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to load events.",
      },
      { status: 500 },
    );
  }
}
