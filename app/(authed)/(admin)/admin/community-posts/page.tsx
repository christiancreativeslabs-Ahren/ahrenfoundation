import type { Metadata } from "next";
import { getCommunityPostListData } from "@/lib/admin/community-posts";
import {
  parseCommunityPostListInput,
  type RawCommunityPostListParams,
} from "@/features/admin/community-posts/list/_lib/parse-community-post-list-input";
import { CommunityPostTable } from "@/features/admin/community-posts/list/_components/community-post.table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community Posts - Admin | Ahren Foundation",
  robots: "noindex, nofollow",
};

export default async function CommunityPostsAdminPage({
  searchParams,
}: {
  searchParams: Promise<RawCommunityPostListParams>;
}) {
  const params = await searchParams;
  const initialFilters = parseCommunityPostListInput(params);
  const initialData = await getCommunityPostListData(initialFilters);

  return (
    <div className="min-h-full w-full -mt-5 pt-0 pb-6">
      <CommunityPostTable initialData={initialData} initialFilters={initialFilters} />
    </div>
  );
}
