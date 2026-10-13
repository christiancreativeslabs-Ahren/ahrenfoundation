import type { Metadata } from "next";
import LoginPage from "@/components/auth/login-page";

export const metadata: Metadata = {
  title: "Member Login — Ahren Foundation",
  description: "Log in to the Ahren Foundation Community Hub.",
};

export default function HubLoginPage() {
  return (
    <LoginPage
      sectionLabel="Community Hub"
      heading={
        <>
          Log in to the <span className="grad-text">Community Hub</span>
        </>
      }
      description="Sign in with the email and password from community signup, or continue with Google."
      homeHref="/hub"
      newUserHref="/hub/join"
      newUserLabel="Join the community"
      callbackURL="/dashboard"
      newUserCallbackURL="/hub/join"
      signedInRedirect="/dashboard"
      note="Community members can log in right after signup. Training applicants still need admin verification."
    />
  );
}
