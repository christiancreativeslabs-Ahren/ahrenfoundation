import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import CommunitySignupForm from "@/components/sections/CommunitySignupForm";
import { SectionLabel, FadeUp, GradientOrb } from "@/components/ui/custom";

export const metadata: Metadata = {
  title: "Join the Community — Ahren Foundation",
  description:
    "Sign up for the Ahren Foundation community of Christian creatives. Access programs, forums, mentorship, and more.",
};

export default function HubJoinPage() {
  return (
    <PageTransition>
      <>
        <Navbar />
        <main className="bg-[#080d2e] overflow-hidden">
          <section className="relative overflow-hidden pb-10 pt-36">
            <div className="absolute inset-0 grid-bg opacity-40" />
            <GradientOrb
              className="top-[-15%] right-[-5%]"
              size={560}
              color="cyan"
            />
            <div className="relative z-10 mx-auto max-w-3xl px-6">
              <FadeUp>
                <SectionLabel>Community Hub</SectionLabel>
                <h1
                  className="mb-4 font-display leading-[1.05] text-white"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(36px, 5vw, 56px)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                  }}
                >
                  Join our community
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-[#8892b0]">
                  Create your account to become part of our global network of
                  Christian creatives.
                </p>
              </FadeUp>
            </div>
          </section>

          <section className="relative pb-28">
            <div className="mx-auto max-w-3xl px-6">
              <div className="card p-8 md:p-10" style={{ borderRadius: 28 }}>
                <CommunitySignupForm />
              </div>
              <p className="mt-8 text-center text-sm text-[#8892b0]">
                Already a member?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#00c9ff] hover:underline"
                >
                  Log in
                </Link>
                {" · "}
                <Link
                  href="/hub"
                  className="font-semibold text-[#8892b0] hover:text-white"
                >
                  Back to Hub
                </Link>
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    </PageTransition>
  );
}
