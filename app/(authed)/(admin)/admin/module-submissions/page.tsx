import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function WorkbookSubmissionsCompatibilityRedirectPage() {
  redirect("/admin/workbook/submissions");
}
