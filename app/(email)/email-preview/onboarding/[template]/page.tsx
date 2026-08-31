import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WorkbookEmailTemplateCompatibilityRedirectPage({
  params,
}: {
  params: Promise<{ template: string }>;
}) {
  const { template } = await params;
  redirect(`/email-preview/workbook/${template}`);
}
