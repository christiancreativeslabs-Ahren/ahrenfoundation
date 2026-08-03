import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LoginPage from "@/components/auth/login-page";
import { auth } from "@/lib/auth/auth";
import { getAdminEmails } from "@/lib/validations/join";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "christiancreativeslabs@gmail.com";
const DEV_FALLBACK_PASSWORD = "AhrenAdmin123!";

export default async function AdminLoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.email) {
    if (getAdminEmails().includes(session.user.email)) {
      redirect("/admin/home");
    }

    redirect("/dashboard");
  }

  return (
    <LoginPage
      sectionLabel="Admin access"
      heading={<>Admin portal for Ahren Foundation.</>}
      description="Use the seeded admin account or your approved admin email to review applications, onboarding, and operational logs."
      homeHref="/"
      newUserHref="/hub/login"
      newUserLabel="Member Login"
      callbackURL="/admin/home"
      newUserCallbackURL="/hub/login"
      signedInRedirect="/admin/home"
      defaultEmail={ADMIN_EMAIL}
      defaultPassword={DEV_FALLBACK_PASSWORD}
      note={`Admin access only. Seeded login: ${ADMIN_EMAIL} / ${DEV_FALLBACK_PASSWORD}. If you need member access, use the member portal instead.`}
    />
  );
}
