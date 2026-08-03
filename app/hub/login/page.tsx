import type { Metadata } from "next";
import LoginPage from "@/components/auth/login-page";

export const metadata: Metadata = {
  title: "Member Login - Ahren Foundation",
  description: "Log in to the Ahren Foundation member workspace.",
};

export default function MemberLoginPage() {
  return (
    <LoginPage
      sectionLabel="Member Access"
      heading={<>Log in to the <span className="grad-text">Ahren Foundation</span> workspace</>}
      description="Sign in with Google or your email and password to access private community features, member-only updates, and the next layer of the platform."
      homeHref="/"
      newUserHref="/training/apply"
      newUserLabel="Join the community"
      callbackURL="/dashboard"
      newUserCallbackURL="/training/apply"
      signedInRedirect="/dashboard"
      note="Use your email and password, or continue with Google."
    />
  );
}
