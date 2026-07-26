import type { Metadata } from "next";
import { getOpportunityListData } from "@/lib/admin/opportunities";
import {
  parseOpportunityListInput,
  type RawOpportunityListParams,
} from "@/features/admin/opportunities/list/_lib/parse-opportunity-list-input";
import { OpportunityTable } from "@/features/admin/opportunities/list/_components/opportunity.table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Opportunities - Admin | Ahren Foundation",
  robots: "noindex, nofollow",
};

export default async function OpportunitiesAdminPage({
  searchParams,
}: {
  searchParams: Promise<RawOpportunityListParams>;
}) {
  const params = await searchParams;
  const initialFilters = parseOpportunityListInput(params);
  const initialData = await getOpportunityListData(initialFilters);

  return (
    <div className="min-h-full w-full -mt-5 pt-0 pb-6">
      <OpportunityTable initialData={initialData} initialFilters={initialFilters} />
    </div>
  );
}
