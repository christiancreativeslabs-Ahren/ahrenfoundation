import type { Metadata } from "next";
import WelcomePage from "@/components/auth/welcome-page";

export const metadata: Metadata = {
  title: "Mentor Welcome - Ahren Foundation",
  description: "Mentor welcome page for verified Ahren Foundation mentors.",
};

export default function MentorWelcomePage() {
  return (
    <WelcomePage
      sectionLabel="Mentor Welcome"
      heading={<>Welcome back, <span className="grad-text">mentor</span></>}
      description="You have successfully signed in as a mentor. Open your workspace to review assigned mentees, Workbook submissions, and session notes."
      ctaHref="/mentor/dashboard"
      ctaLabel="Go to Mentor Dashboard"
      expectedRole="mentor"
      fallbackLoginHref="/mentor/login"
    />
  );
}
