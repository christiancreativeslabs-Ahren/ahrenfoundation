"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LogIn, UserPlus, HelpCircle } from "lucide-react";
import { SectionLabel, FadeUp, GradientOrb } from "@/components/ui/custom";

export default function CommunityHubPage() {
  return (
    <main className="bg-[#080d2e] overflow-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-36">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GradientOrb
          className="top-[-15%] right-[-5%]"
          size={600}
          color="cyan"
        />
        <GradientOrb className="bottom-0 left-[-5%]" size={500} color="mint" />

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <FadeUp>
            <SectionLabel>Community Hub</SectionLabel>
            <h1
              className="mb-6 font-display leading-[1.02] text-white"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 6vw, 72px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Welcome to Ahren Community Hub
            </h1>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p
              className="mb-4 max-w-2xl font-semibold text-[#00c9ff]"
              style={{ fontSize: "clamp(16px, 2vw, 20px)" }}
            >
              Your Digital Home for Purpose, Community, and Opportunity
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p
              className="max-w-2xl leading-relaxed text-[#8892b0]"
              style={{ fontSize: "clamp(15px, 1.8vw, 18px)" }}
            >
              Join a global network of Christian creatives who are using their
              skills and creativity to build value, serve their generation, and
              advance the Kingdom of God. Whether you&apos;re here to learn,
              connect, or build — you belong here.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Pathways */}
      <section
        className="relative pb-20"
        style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}
      >
        <div className="mx-auto grid max-w-5xl gap-6 px-6 pt-14 md:grid-cols-2">
          {/* Pathway 1 — Sign up */}
          <FadeUp>
            <div
              className="card flex h-full flex-col p-8"
              style={{ borderRadius: 28 }}
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#00c9ff]/20 bg-[#00c9ff]/10 text-[#00c9ff]">
                <UserPlus size={22} />
              </div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#00c9ff]">
                Pathway 1 · New members
              </p>
              <h2
                className="mb-3 text-2xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Are you new here?
              </h2>
              <p className="mb-8 flex-1 text-sm leading-relaxed text-[#8892b0]">
                Sign up to become part of our global community of Christian
                creatives. Get access to free empowerment programs, community
                forums, mentorship opportunities, and more.
              </p>
              <Link href="/hub/join">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="grad-bg inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-[#080d2e]"
                >
                  Join our community
                  <ArrowRight size={16} />
                </motion.span>
              </Link>
            </div>
          </FadeUp>

          {/* Pathway 2 — Login */}
          <FadeUp delay={0.1}>
            <div
              className="card flex h-full flex-col p-8"
              style={{ borderRadius: 28 }}
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#00ff9d]/20 bg-[#00ff9d]/10 text-[#00ff9d]">
                <LogIn size={22} />
              </div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#00ff9d]">
                Pathway 2 · Existing members
              </p>
              <h2
                className="mb-3 text-2xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Already a member?
              </h2>
              <p className="mb-8 flex-1 text-sm leading-relaxed text-[#8892b0]">
                Welcome back. Log in to access your dashboard, programs,
                mentorship, and community features.
              </p>
              <Link href="/login">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-white"
                  style={{
                    border: "1px solid rgba(0,201,255,0.25)",
                    background: "rgba(0,201,255,0.08)",
                  }}
                >
                  Log in
                  <ArrowRight size={16} />
                </motion.span>
              </Link>
              <p className="mt-4 text-center text-xs text-[#8892b0]">
                <Link href="/login" className="text-[#00c9ff] hover:underline">
                  Forgot password?
                </Link>
              </p>
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.15}>
          <p className="mx-auto mt-10 max-w-2xl px-6 text-center text-sm leading-relaxed text-[#8892b0]">
            Only registered members can access our community hub. If you
            haven&apos;t signed up yet, please click{" "}
            <Link
              href="/hub/join"
              className="font-semibold text-[#00c9ff] hover:underline"
            >
              Join our community
            </Link>{" "}
            above.
          </p>
        </FadeUp>
      </section>

      {/* Need help */}
      <section className="pb-28">
        <div className="mx-auto max-w-3xl px-6">
          <FadeUp>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 text-center">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[#00c9ff]">
                <HelpCircle size={20} />
              </div>
              <h3
                className="mb-3 text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Need help?
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-[#8892b0]">
                If you are having trouble signing up or logging in, please
                contact us:
              </p>
              <p className="text-sm text-[#e8eeff]">
                Email:{" "}
                <a
                  href="mailto:hello@ahrenfoundation.org"
                  className="text-[#00c9ff] hover:underline"
                >
                  hello@ahrenfoundation.org
                </a>
              </p>
              <p className="mt-2 text-sm text-[#e8eeff]">
                Phone:{" "}
                <a
                  href="https://wa.me/2347047555064"
                  className="text-[#00c9ff] hover:underline"
                >
                  +234 704 755 5064
                </a>
              </p>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
