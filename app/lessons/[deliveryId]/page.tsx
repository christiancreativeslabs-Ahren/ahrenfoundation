import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WorkbookTokenCompatibilityRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ deliveryId: string }>;
  searchParams: Promise<{ token?: string; submitted?: string; error?: string }>;
}) {
  const { deliveryId } = await params;
  const query = await searchParams;
  const search = new URLSearchParams();

  if (query.token) search.set("token", query.token);
  if (query.submitted) search.set("submitted", query.submitted);
  if (query.error) search.set("error", query.error);

  const suffix = search.toString() ? `?${search.toString()}` : "";
  redirect(`/workbook/${deliveryId}${suffix}`);
}
