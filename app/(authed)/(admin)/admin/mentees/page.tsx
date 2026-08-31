import type { Metadata } from "next";
import { getMenteeListData } from "@/lib/admin/mentees";
import { getMentorAssignmentCandidates } from "@/lib/admin/mentor-assignments";
import {
  parseMenteeListInput,
  type RawMenteeListParams,
} from "@/features/admin/mentees/list/_lib/parse-mentee-list-input";
import { MenteeTable } from "@/features/admin/mentees/list/_components/mentee.table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mentees - Admin | Ahren Foundation",
  robots: "noindex, nofollow",
};

export default async function MenteesAdminPage({
  searchParams,
}: {
  searchParams: Promise<RawMenteeListParams>;
}) {
  const params = await searchParams;
  const initialFilters = parseMenteeListInput(params);
  const [initialData, mentors] = await Promise.all([
    getMenteeListData(initialFilters),
    getMentorAssignmentCandidates(),
  ]);

  return (
    <div className="w-full min-h-full -mt-5 pb-6 pt-0">
      <MenteeTable
        initialData={initialData}
        initialFilters={initialFilters}
        mentors={mentors}
      />
    </div>
  );
}
