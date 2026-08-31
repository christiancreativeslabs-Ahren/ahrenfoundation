import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { programMembers } from "@/db/schema";
import LoginPage from "@/components/auth/login-page";

export const metadata: Metadata = {
  title: "Mentor Login - Ahren Foundation",
  description: "Log in as an Ahren Foundation mentor.",
};

export const dynamic = "force-dynamic";

export default async function MentorLoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.email) {
    const [member] = await db
      .select({ role: programMembers.role })
      .from(programMembers)
      .where(eq(programMembers.email, session.user.email))
      .limit(1);

    if (member?.role === "mentor") {
      redirect("/mentor/dashboard");
    }

    redirect("/dashboard");
  }

  return (
    <LoginPage
      sectionLabel="Mentor Access"
      heading={<>Log in as an <span className="grad-text">Ahren Mentor</span></>}
      description="Use your mentor account to access the shared workspace, private updates, and your journey records."
      homeHref="/mentors"
      newUserHref="/become-a-mentor"
      newUserLabel="Become a mentor"
      callbackURL="/mentor/dashboard"
      newUserCallbackURL="/become-a-mentor"
      signedInRedirect="/mentor/dashboard"
      note="Use your email and password, or continue with Google."
    />
  );
}
