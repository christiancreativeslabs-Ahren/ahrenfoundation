import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { getAdminEmails } from "@/lib/validations/join";

export async function requireAdminApiUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email || !getAdminEmails().includes(session.user.email)) {
    return null;
  }

  return session.user;
}
