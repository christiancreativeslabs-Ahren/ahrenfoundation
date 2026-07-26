import { NextRequest, NextResponse } from "next/server";
import { getJoinApplicationListData } from "@/lib/admin/join-applications";
import {
  parseJoinApplicationListInput,
  type RawJoinApplicationListParams,
} from "@/features/admin/join-applications/list/_lib/parse-join-application-list-input";

export const dynamic = "force-dynamic";

/*
Why this route exists:
- The join-applications screen is a client-side fast list that refetches on search, cursor paging, and filter changes.
- Client components cannot call the DB helper in `lib/admin/join-applications.ts` directly, so this route acts as the thin HTTP bridge.
- The route does not contain business logic; it only parses URL search params, calls the shared server helper, and returns JSON in the exact shape the client hook expects.
- This keeps the reusable data logic in `lib/admin/join-applications.ts` while still giving React Query a network endpoint to fetch from.
*/
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(
      url.searchParams.entries()
    ) as RawJoinApplicationListParams;
    const input = parseJoinApplicationListInput(searchParams);
    const data = await getJoinApplicationListData(input);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to load join applications.",
      },
      { status: 500 }
    );
  }
}
