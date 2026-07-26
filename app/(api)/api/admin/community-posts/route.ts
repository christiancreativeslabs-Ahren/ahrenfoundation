import { NextRequest, NextResponse } from "next/server";
import { getCommunityPostListData } from "@/lib/admin/community-posts";
import {
  parseCommunityPostListInput,
  type RawCommunityPostListParams,
} from "@/features/admin/community-posts/list/_lib/parse-community-post-list-input";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries()) as RawCommunityPostListParams;
    const input = parseCommunityPostListInput(searchParams);
    const data = await getCommunityPostListData(input);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to load community posts." },
      { status: 500 },
    );
  }
}
