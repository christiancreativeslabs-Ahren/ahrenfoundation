"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionLabel, GlowButton, FadeUp, StaggerParent, StaggerChild, GradientOrb } from "@/components/ui";

export default function AboutPage() {
  const pillars = [
    {
      icon: "🔭",
      label: "Our Vision",
      color: "#00c9ff",
      content:
        "We envision a generation where young believers align their use of tech skills, tools and creativity with God's purpose — partnering with the Holy Spirit to use them for creating value that impacts lives and reveals Jesus Christ to the world.",
    },
    {
      icon: "🎯",
      label: "Our Mission",
      color: "#00ff9d",
      content:
        "To build a global community of believers in tech who are using their tech skills, gifts and creativity in line with God's plans and purposes on earth — from mission fields to marketplaces, equipping every believer to build what matters.",
    },
    {
      icon: "🕊️",
      label: "Our Anchor",
      color: "#00c9ff",
      content:
        "We believe our best work happens not in our own strength, but in genuine dependence on the Holy Spirit. He is our ultimate Creative Director. We collaborate with Him to steward every skill, every spark of creativity, and every technology at our disposal.",
    },
  ];

  return (
    <main className="bg-[#080d2e] overflow-hidden">
      {/* Page Header */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <GradientOrb className="top-[-20%] right-[-10%]" size={700} color="cyan" />
        <GradientOrb className="bottom-[-10%] left-[-10%]" size={500} color="mint" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FadeUp>
            <SectionLabel>Our Story</SectionLabel>
            <h1
              className="font-display text-white leading-[1.02] mb-6 text-balance"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 7vw, 80px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Who We Are
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p
              className="text-[#8892b0] leading-relaxed max-w-3xl"
              style={{ fontSize: "clamp(16px, 2vw, 20px)" }}
            >
              Ahren Foundation is a platform that empowers youths for societal impact and
              purposeful living through tech programs, mentorship, and strategic
              collaborations — helping them align their tech skills and creativity with
              God&apos;s purpose. From mission fields to marketplaces, from code to
              creativity, we are building a global network of believers in tech who hone
              their skills to create value and reach the world for Jesus Christ.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Pillars */}
      <section
        className="py-24 relative"
        style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp className="text-center mb-16">
            <SectionLabel>Foundation Pillars</SectionLabel>
            <h2
              className="font-display text-white"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              Vision, Mission &amp; Anchor
            </h2>
          </FadeUp>

          <StaggerParent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <StaggerChild key={i}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="card p-10 h-full flex flex-col transition-all duration-300"
                  style={{
                    borderRadius: 28,
                    borderTop: `3px solid ${p.color}`,
                  }}
                >
                  <div className="text-5xl mb-6">{p.icon}</div>
                  <div
                    className="text-xs font-bold tracking-[0.15em] uppercase mb-4"
                    style={{ color: p.color }}
                  >
                    {p.label}
                  </div>
                  <p className="text-[#8892b0] text-[15px] leading-relaxed flex-1">{p.content}</p>
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </section>

      {/* Taglines */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d1340 0%, #080d2e 100%)", borderTop: "1px solid rgba(0,201,255,0.08)" }}
      >
        <GradientOrb className="left-1/2 -translate-x-1/2 top-0" size={600} color="cyan" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FadeUp className="text-center mb-16">
            <SectionLabel>In Our Own Words</SectionLabel>
            <h2
              className="font-display text-white"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Our Taglines
            </h2>
          </FadeUp>
          <StaggerParent className="space-y-5">
            {[
              "Building tech that reveals Jesus.",
              "Tech skills. Kingdom purpose. Global impact.",
              "Partnering with the Holy Spirit to build what matters.",
            ].map((tagline, i) => (
              <StaggerChild key={i}>
                <motion.div
                  whileHover={{ x: 8 }}
                  className="flex items-center gap-6 p-8 rounded-2xl transition-all duration-300"
                  style={{
                    background: "rgba(17,24,80,0.6)",
                    border: "1px solid rgba(0,201,255,0.1)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex-shrink-0 grad-bg flex items-center justify-center text-[#080d2e] font-bold text-sm"
                  >
                    {i + 1}
                  </div>
                  <p
                    className="text-white font-semibold italic"
                    style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px, 2.2vw, 22px)" }}
                  >
                    &ldquo;{tagline}&rdquo;
                  </p>
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </section>

      {/* What makes us different */}
      <section className="py-24 relative">
        <GradientOrb className="right-[-10%] top-1/2" size={500} color="mint" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <SectionLabel>Our Belief</SectionLabel>
              <h2
                className="font-display text-white leading-tight mb-6"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px, 3.5vw, 44px)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                The Holy Spirit is Our{" "}
                <span className="grad-text">Ultimate Creative Director</span>
              </h2>
              <p className="text-[#8892b0] text-base leading-relaxed mb-6">
                We don&apos;t just build software — we build with the Spirit. Every program,
                every product, every mentorship session is saturated with prayer and
                dependence on the Holy Spirit&apos;s guidance.
              </p>
              <p className="text-[#8892b0] text-base leading-relaxed mb-10">
                We believe when believers consecrate their tech skills to God, they become
                instruments through which He builds His Kingdom on earth — one line of code,
                one design, one conversation at a time.
              </p>
              <Link href="/what-we-do">
                <GlowButton>
                  See What We Build <ArrowRight size={16} />
                </GlowButton>
              </Link>
            </FadeUp>

            <StaggerParent className="space-y-4">
              {[
                { num: "01", title: "Prayer before code", body: "Every project, workshop, and fellowship starts with prayer. We build on the altar, not just the terminal." },
                { num: "02", title: "Community over competition", body: "We celebrate each other's wins. In the Kingdom, your growth is our growth." },
                { num: "03", title: "Excellence for the King", body: "We pursue the highest quality in everything — because the King deserves our best work." },
                { num: "04", title: "Missions through tech", body: "Technology is our language to preach the Gospel to the digital generation." },
              ].map((item, i) => (
                <StaggerChild key={i}>
                  <motion.div
                    whileHover={{ x: 6 }}
                    className="flex gap-5 p-6 rounded-xl transition-all duration-300"
                    style={{ background: "rgba(17,24,80,0.6)", border: "1px solid rgba(0,201,255,0.08)" }}
                  >
                    <span className="grad-text text-lg font-bold flex-shrink-0" style={{ fontFamily: "var(--font-display)" }}>
                      {item.num}
                    </span>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1" style={{ fontFamily: "var(--font-display)" }}>
                        {item.title}
                      </h4>
                      <p className="text-[#8892b0] text-sm leading-relaxed">{item.body}</p>
                    </div>
                  </motion.div>
                </StaggerChild>
              ))}
            </StaggerParent>
          </div>
        </div>
      </section>
    </main>
  );
}
