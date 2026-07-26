import type { Metadata } from "next";
import LoginPage from "@/components/auth/login-page";

export const metadata: Metadata = {
  title: "Mentor Login - Ahren Foundation",
  description: "Log in as an Ahren Foundation mentor.",
};

export default function MentorLoginPage() {
  return (
    <LoginPage
      sectionLabel="Mentor Access"
      heading={<>Log in as an <span className="grad-text">Ahren Mentor</span></>}
      description="Use your mentor account to access the shared workspace, private updates, and your journey records."
      homeHref="/mentors"
      newUserHref="/become-a-mentor"
      newUserLabel="Become a mentor"
      callbackURL="/mentor/welcome"
      newUserCallbackURL="/become-a-mentor"
      signedInRedirect="/mentor/welcome"
      note="Use your email and password, or continue with Google."
    />
  );
}
