import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ResetPasswordForm from "@/components/auth/reset-password-form";
import { FadeUp, GradientOrb, SectionLabel } from "@/components/ui/custom";

export const metadata: Metadata = {
  title: "Set Password — Ahren Foundation",
  description: "Choose a new password for your Ahren Foundation account.",
};

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const params = await searchParams;
  const token = params.token?.trim() ?? "";

  return (
    <PageTransition>
      <>
        <Navbar />
        <main className="overflow-hidden bg-[#080d2e]">
          <section className="relative min-h-screen overflow-hidden pb-20 pt-36">
            <div className="absolute inset-0 grid-bg opacity-40" />
            <GradientOrb
              className="right-[-5%] top-[-10%]"
              size={560}
              color="cyan"
            />
            <div className="relative z-10 mx-auto max-w-md px-6">
              <FadeUp>
                <SectionLabel>Account access</SectionLabel>
                <h1
                  className="mb-3 font-display text-white"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(32px, 5vw, 44px)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                  }}
                >
                  Set your password
                </h1>
                <p className="mb-8 text-sm leading-relaxed text-[#8892b0]">
                  Choose a password for the Community Hub. This link expires in
                  24 hours.
                </p>
              </FadeUp>

              <div className="card p-8" style={{ borderRadius: 28 }}>
                <ResetPasswordForm token={token} />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    </PageTransition>
  );
}
