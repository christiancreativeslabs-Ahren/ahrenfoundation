import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ActivateYouthForm from "@/components/sections/ActivateYouthForm";
import { FadeUp, GradientOrb, SectionLabel } from "@/components/ui/custom";

export const metadata: Metadata = {
  title: "Activate Account — Ahren Foundation",
  description:
    "Set a password for your Ahren Foundation youth membership and access the Community Hub.",
};

export default function ActivateYouthPage() {
  return (
    <PageTransition>
      <>
        <Navbar />
        <main className="overflow-hidden bg-[#080d2e]">
          <section className="relative overflow-hidden pb-10 pt-36">
            <div className="absolute inset-0 grid-bg opacity-40" />
            <GradientOrb
              className="right-[-5%] top-[-15%]"
              size={560}
              color="cyan"
            />
            <div className="relative z-10 mx-auto max-w-xl px-6">
              <FadeUp>
                <SectionLabel>Community Hub</SectionLabel>
                <h1
                  className="mb-4 font-display text-white"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(36px, 5vw, 52px)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                  }}
                >
                  Activate your account
                </h1>
                <p className="mb-8 text-base leading-relaxed text-[#8892b0]">
                  Already applied as a youth member? Enter the email you used
                  when you applied. We’ll send a secure link (valid for 24
                  hours) so you can set a password and log in.
                </p>
              </FadeUp>
              <div className="card p-8" style={{ borderRadius: 28 }}>
                <ActivateYouthForm />
              </div>
              <p className="mt-8 text-center text-sm text-[#8892b0]">
                <Link
                  href="/hub/login"
                  className="font-semibold text-[#00c9ff] hover:underline"
                >
                  Log in
                </Link>
                {" · "}
                <Link href="/hub" className="hover:text-white">
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
