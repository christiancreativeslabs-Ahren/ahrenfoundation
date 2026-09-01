import type { Metadata } from "next";
import QuickLoginPage from "@/components/auth/quick-login-page";

export const metadata: Metadata = {
  title: "Member Login - Ahren Foundation",
  description: "Log in to the Ahren Foundation member workspace.",
};

export default function MemberLoginPage() {
  return (
    <QuickLoginPage
      sectionLabel="Member Access"
      heading={
        <>
          Log in to the <span className="grad-text">Ahren Foundation</span>{" "}
          workspace
        </>
      }
      description="Sign in using your email address and lastname to access your modules, assignments, and program materials. Please log in as soon as possible to get started with the program."
      homeHref="/"
      newUserHref="/training/apply"
      newUserLabel="Join the community"
      callbackURL="/dashboard"
      newUserCallbackURL="/training/apply"
      signedInRedirect="/dashboard"
      note="Use your email and lastname."
    />
  );
}
