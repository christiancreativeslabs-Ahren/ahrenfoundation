import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/admin-shell";
import { auth } from "@/lib/auth/auth";
import { getAdminEmails } from "@/lib/validations/join";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const adminEmails = getAdminEmails();
  if (!session.user.email || !adminEmails.includes(session.user.email)) {
    redirect("/dashboard");
  }

  return (
    <AdminShell email={session.user.email}>{children}</AdminShell>
  );
}
