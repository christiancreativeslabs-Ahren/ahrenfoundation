import type { Metadata } from "next";
import WelcomePage from "@/components/auth/welcome-page";

export const metadata: Metadata = {
  title: "Member Welcome - Ahren Foundation",
  description: "Member welcome page for verified Ahren Foundation users.",
};

export default function MemberWelcomePage() {
  return (
    <WelcomePage
      sectionLabel="Member Welcome"
      heading={<>Welcome to the <span className="grad-text">Ahren Creative</span> journey</>}
      description="You have successfully signed in as a member. For now, we’re showing your contact details and role while we continue building the rest of your experience."
      ctaHref="/dashboard"
      ctaLabel="Go to Dashboard"
      expectedRole="youth"
      fallbackLoginHref="/hub/login"
    />
  );
}
