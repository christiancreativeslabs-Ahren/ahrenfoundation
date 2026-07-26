import { NextRequest, NextResponse } from "next/server";
import { getResourceListData } from "@/lib/admin/resources";
import {
  parseResourceListInput,
  type RawResourceListParams,
} from "@/features/admin/resources/list/_lib/parse-resource-list-input";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(
      url.searchParams.entries(),
    ) as RawResourceListParams;
    const input = parseResourceListInput(searchParams);
    const data = await getResourceListData(input);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to load resources.",
      },
      { status: 500 },
    );
  }
}
