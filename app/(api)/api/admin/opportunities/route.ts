import { NextRequest, NextResponse } from "next/server";
import { getOpportunityListData } from "@/lib/admin/opportunities";
import {
  parseOpportunityListInput,
  type RawOpportunityListParams,
} from "@/features/admin/opportunities/list/_lib/parse-opportunity-list-input";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(
      url.searchParams.entries(),
    ) as RawOpportunityListParams;
    const input = parseOpportunityListInput(searchParams);
    const data = await getOpportunityListData(input);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to load opportunities.",
      },
      { status: 500 },
    );
  }
}
