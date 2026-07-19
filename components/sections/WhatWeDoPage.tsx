"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  SectionLabel,
  FadeUp,
  StaggerParent,
  StaggerChild,
  GradientOrb,
  GlowButton,
} from "@/components/ui/custom";
import ScripturesSection from "@/components/ScripturesSection";
import { WHAT_WE_DO } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export default function WhatWeDoPage() {
  return (
    <main className="bg-[#080d2e] overflow-hidden">
      {/* Header */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GradientOrb
          className="top-[-10%] left-[-5%]"
          size={600}
          color="cyan"
        />
        <GradientOrb
          className="bottom-[-20%] right-[-5%]"
          size={500}
          color="mint"
        />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FadeUp>
            <SectionLabel>Programs & Initiatives</SectionLabel>
            <h1
              className="font-display text-white leading-[1.02] mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 7vw, 80px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              What We Do
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p
              className="text-[#8892b0] leading-relaxed max-w-2xl"
              style={{ fontSize: "clamp(16px, 2vw, 20px)" }}
            >
              Rooted in faith, driven by purpose, and powered by the Holy Spirit
              — every initiative we run is designed to align tech skills,
              creativity, and community with God&apos;s eternal purpose.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Programs Grid - detailed cards */}
      <section
        className="py-20 relative"
        style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <StaggerParent className="space-y-6">
            {WHAT_WE_DO.map((item, i) => (
              <StaggerChild key={i}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="group p-10 rounded-3xl transition-all duration-300"
                  style={{
                    background: "#111850",
                    border: "1px solid rgba(0,201,255,0.1)",
                    borderLeft: `5px solid ${item.color}`,
                  }}
                >
                  <div className="grid lg:grid-cols-[auto_1fr_auto] gap-8 items-start">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                      style={{
                        background: item.color + "12",
                        border: `1px solid ${item.color}25`,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className="text-xs font-bold tracking-[0.15em] uppercase"
                          style={{ color: item.color }}
                        >
                          {item.shortTitle}
                        </span>
                        <span
                          className="w-1 h-1 rounded-full inline-block"
                          style={{ background: item.color }}
                        />
                        <span className="text-[#8892b0] text-xs">
                          Initiative {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3
                        className="text-white font-bold text-xl mb-4 group-hover:grad-text transition-all duration-300"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-[#8892b0] text-[15px] leading-relaxed max-w-2xl">
                        {item.desc}
                      </p>
                    </div>
                    <div className="hidden lg:flex">
                      <span
                        className="text-6xl font-bold opacity-10 flex-shrink-0"
                        style={{
                          fontFamily: "var(--font-display)",
                          color: item.color,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </section>

      {/* Fellowship Spotlight */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0d1340 0%, #080d2e 100%)",
          borderTop: "1px solid rgba(0,201,255,0.08)",
        }}
      >
        <GradientOrb
          className="left-[-10%] top-[-20%]"
          size={600}
          color="mint"
        />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <FadeUp>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8"
              style={{
                background: "rgba(0,255,157,0.08)",
                border: "1px solid rgba(0,255,157,0.2)",
              }}
            >
              <span className="text-2xl">🤝</span>
              <span className="text-[#00ff9d] text-xs font-bold tracking-widest uppercase">
                Community Spotlight
              </span>
            </div>
            <h2
              className="font-display text-white mb-6 text-balance"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              Believers in Tech <span className="grad-text">Fellowship</span>
            </h2>
            <p className="text-[#8892b0] text-lg max-w-2xl mx-auto leading-relaxed mb-12">
              More than a program — it&apos;s a thriving, Spirit-filled
              community. Our Believers in Tech Fellowship is where faith-driven
              technologists find genuine connection, sharpen each other, and
              build Kingdom products together in an atmosphere of fun, faith,
              and purpose.
            </p>
            <StaggerParent className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              {[
                { label: "Fellowship", emoji: "🙏" },
                { label: "Fun & Games", emoji: "🎮" },
                { label: "Creative Discussions", emoji: "💡" },
                { label: "Networking", emoji: "🌐" },
                { label: "Collaboration", emoji: "🛠️" },
                { label: "Product Showcase", emoji: "🚀" },
              ].map((item, i) => (
                <StaggerChild key={i}>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    className="p-5 rounded-2xl flex flex-col items-center gap-2"
                    style={{
                      background: "rgba(0,255,157,0.06)",
                      border: "1px solid rgba(0,255,157,0.15)",
                    }}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span
                      className="text-white text-sm font-semibold"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.label}
                    </span>
                  </motion.div>
                </StaggerChild>
              ))}
            </StaggerParent>
            <Link href="/join">
              <GlowButton>
                Join the Fellowship <ArrowRight size={16} />
              </GlowButton>
            </Link>
          </FadeUp>
        </div>
      </section>

      <ScripturesSection />

      {/* CTA */}
      <section className="py-24 relative">
        <GradientOrb
          className="left-1/2 -translate-x-1/2 top-0"
          size={600}
          color="cyan"
        />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <FadeUp>
            <h2
              className="font-display text-white mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 50px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              Ready to be Part of{" "}
              <span className="grad-text">Something Great?</span>
            </h2>
            <p className="text-[#8892b0] text-lg mb-10 leading-relaxed">
              Join a growing community of believers who are using their tech
              gifts to build for the Kingdom.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/join">
                <GlowButton>
                  Apply as Creative Youth <ArrowRight size={16} />
                </GlowButton>
              </Link>
              <Link href="/join">
                <GlowButton outline>Become a Mentor</GlowButton>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
