import { NextRequest, NextResponse } from "next/server";
import { getProjectShowcaseListData } from "@/lib/admin/project-showcases";
import {
  parseProjectShowcaseListInput,
  type RawProjectShowcaseListParams,
} from "@/features/admin/project-showcases/list/_lib/parse-project-showcase-list-input";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries()) as RawProjectShowcaseListParams;
    const input = parseProjectShowcaseListInput(searchParams);
    const data = await getProjectShowcaseListData(input);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Failed to load project showcases." }, { status: 500 });
  }
}
