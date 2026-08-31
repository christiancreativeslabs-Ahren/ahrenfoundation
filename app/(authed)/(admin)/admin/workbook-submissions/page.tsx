import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function OldWorkbookSubmissionsCompatibilityRedirectPage() {
  redirect("/admin/workbook/submissions");
}
