import type { Metadata } from "next";
import { getMentorListData } from "@/lib/admin/mentors";
import { getMentorAssignmentMenteeCandidates } from "@/lib/admin/mentor-assignments";
import {
  parseMentorListInput,
  type RawMentorListParams,
} from "@/features/admin/mentors/list/_lib/parse-mentor-list-input";
import { MentorTable } from "@/features/admin/mentors/list/_components/mentor.table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mentors - Admin | Ahren Foundation",
  robots: "noindex, nofollow",
};

export default async function MentorsAdminPage({
  searchParams,
}: {
  searchParams: Promise<RawMentorListParams>;
}) {
  const params = await searchParams;
  const initialFilters = parseMentorListInput(params);
  const [initialData, mentees] = await Promise.all([
    getMentorListData(initialFilters),
    getMentorAssignmentMenteeCandidates(),
  ]);

  return (
    <div className="w-full min-h-full -mt-5 pb-6 pt-0">
      <MentorTable
        initialData={initialData}
        initialFilters={initialFilters}
        mentees={mentees}
      />
    </div>
  );
}
