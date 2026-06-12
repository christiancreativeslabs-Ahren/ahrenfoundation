"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, MapPin, Users, Heart, Megaphone } from "lucide-react";
import { SectionLabel, FadeUp, StaggerParent, StaggerChild, GradientOrb } from "@/components/ui";

const SIGNUP_URL = "https://forms.gle/4oJCXTBQb5PLNsBY8";

export default function CitiReachPage() {
  const whoWeWant = [
    "Love Jesus Christ and want others to know Him",
    "Are tired of giving excuses and ready to start preaching Jesus Christ boldly",
    "Can commit 8 hours per month to preaching Jesus Christ for 3 months",
    "Are willing to step out of their comfort zone",
  ];

  const whatYouDo = [
    "1 hour: Pre-outreach prayer & briefing (Virtual)",
    "8 hours per month (2 outings of 4 hours each) for 3 months with other believers",
    "Share the Gospel, get people saved, filled with the Holy Spirit, connect the unchurched with a Bible-believing Church, pray for people, heal the sick, cast out devils, give tracts, and more",
    "Get at least 4 souls saved, filled with the Holy Spirit & connected to a Bible-believing Church by the end of 3 months",
  ];

  const whatWeProvide = [
    "Training, tracts, CitiReach branded wearables, logistics support if needed, prayer coverage",
    "A community of bold and passionate soul-winning believers from different churches",
  ];

  return (
    <main className="bg-[#080d2e] overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GradientOrb className="top-[-15%] left-[-5%]" size={700} color="mint" />
        <GradientOrb className="top-[10%] right-[-5%]" size={500} color="cyan" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FadeUp>
            <SectionLabel>Quarterly Edition</SectionLabel>
            <h1
              className="font-display text-white leading-[1.02] mb-6"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 7vw, 84px)", fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              Citi<span className="grad-text">Reach</span>
            </h1>
            <p className="text-white text-xl md:text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Street Gospel Initiative
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div
              className="inline-block px-6 py-4 rounded-2xl mb-6"
              style={{ background: "rgba(0,255,157,0.06)", border: "1px solid rgba(0,255,157,0.18)" }}
            >
              <p className="text-[#e8eeff] text-base md:text-lg italic leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                &ldquo;Go into all the world and preach the gospel to every creature.&rdquo;
              </p>
              <p className="grad-text text-sm font-bold mt-2">— Mark 16:15</p>
            </div>
            <p className="text-[#8892b0] text-lg leading-relaxed max-w-2xl">
              United believers. Different churches. One mission. Taking the Gospel to the streets —
              your feet could be beautiful.
            </p>
          </FadeUp>
          <FadeUp delay={0.25}>
            <div className="mt-8">
              <motion.a
                href={SIGNUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(0,255,157,0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="grad-bg text-[#080d2e] font-bold text-base px-10 py-4 rounded-full inline-flex items-center gap-2"
              >
                Join the Next Outreach <ArrowRight size={17} />
              </motion.a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── VISION & MISSION ── */}
      <section className="py-20 relative" style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <StaggerParent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StaggerChild>
              <div className="card p-9 h-full" style={{ borderRadius: 24, borderTop: "3px solid #00c9ff" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-[#00c9ff]" style={{ background: "rgba(0,201,255,0.12)" }}>
                  <MapPin size={22} />
                </div>
                <h3 className="text-white font-bold text-xl mb-3" style={{ fontFamily: "var(--font-display)" }}>Our Vision</h3>
                <p className="text-[#8892b0] text-[15px] leading-relaxed">
                  A city where no street is left unreached and no heart is left without an opportunity
                  to hear about the love of Jesus Christ.
                </p>
              </div>
            </StaggerChild>
            <StaggerChild>
              <div className="card p-9 h-full" style={{ borderRadius: 24, borderTop: "3px solid #00ff9d" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-[#00ff9d]" style={{ background: "rgba(0,255,157,0.12)" }}>
                  <Megaphone size={22} />
                </div>
                <h3 className="text-white font-bold text-xl mb-3" style={{ fontFamily: "var(--font-display)" }}>Our Mission</h3>
                <p className="text-[#8892b0] text-[15px] leading-relaxed">
                  We are on a mission to boldly preach Jesus Christ and reveal His love to people in
                  every corner of the city — saving the lost and getting the unchurched churched.
                </p>
              </div>
            </StaggerChild>
          </StaggerParent>
        </div>
      </section>

      {/* ── WHO WE ARE ── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d1340 0%, #080d2e 100%)", borderTop: "1px solid rgba(0,201,255,0.08)" }}
      >
        <GradientOrb className="right-[-10%] top-1/2" size={500} color="mint" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <FadeUp>
            <div className="flex items-center gap-3 mb-6">
              <Users size={20} className="text-[#00ff9d]" />
              <h2 className="text-white font-bold text-2xl md:text-3xl" style={{ fontFamily: "var(--font-display)" }}>Who We Are</h2>
            </div>
            <div className="space-y-4 text-[#8892b0] text-base leading-relaxed">
              <p>
                We are young believers from different churches, different backgrounds, but one passion —
                to see souls saved and lives transformed by the love of Jesus Christ.
              </p>
              <p>We don&apos;t just talk about revival. We go out and demonstrate it.</p>
              <p>
                We gather. We pray. We go. We boldly share Jesus Christ &amp; minister to people — on the
                streets, in markets, at bars, gardens, bus stops, and everywhere people are.
              </p>
              <p>
                We don&apos;t argue. We don&apos;t force. We love. We listen. We preach Jesus Christ. We pray.
                We plant the seeds of God&apos;s word. And we trust God for the harvest.
              </p>
            </div>

            <div className="mt-8 p-6 rounded-2xl" style={{ background: "rgba(0,255,157,0.05)", border: "1px solid rgba(0,255,157,0.15)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Heart size={16} className="text-[#00ff9d]" />
                <h4 className="text-white font-bold text-base" style={{ fontFamily: "var(--font-display)" }}>Our Goal</h4>
              </div>
              <p className="text-[#8892b0] text-[15px] leading-relaxed">
                To mobilize young believers into active, consistent soul-winning — collaborating with
                believers from different churches, breaking every excuse that holds us back, turning
                timid hearts into bold witnesses, and spreading a burning passion to see the lost saved.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── WHO WE WANT / WHAT YOU DO / WHAT WE PROVIDE ── */}
      <section className="py-20 relative" style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}>
        <GradientOrb className="left-[-5%] top-[20%]" size={500} color="cyan" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <FadeUp className="text-center mb-12">
            <SectionLabel>Join the Movement</SectionLabel>
            <h2
              className="font-display text-white"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              We&apos;re Looking for Young Believers <span className="grad-text">(16–35)</span>
            </h2>
          </FadeUp>

          <StaggerParent className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: "Who We Want", items: whoWeWant, color: "#00c9ff" },
              { title: "What You'll Do (Monthly, 3 Months)", items: whatYouDo, color: "#00ff9d" },
              { title: "What We Provide", items: whatWeProvide, color: "#00c9ff" },
            ].map((col, i) => (
              <StaggerChild key={i}>
                <div className="card p-7 h-full" style={{ borderRadius: 20, borderTop: `3px solid ${col.color}` }}>
                  <h3 className="text-white font-bold text-base mb-5" style={{ fontFamily: "var(--font-display)" }}>{col.title}</h3>
                  <ul className="space-y-3">
                    {col.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: col.color + "20" }}>
                          <Check size={10} style={{ color: col.color }} />
                        </span>
                        <span className="text-[#8892b0] text-[13px] leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d1340 0%, #080d2e 100%)", borderTop: "1px solid rgba(0,201,255,0.08)" }}
      >
        <GradientOrb className="left-1/2 -translate-x-1/2 top-0" size={700} color="mint" />
        <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
          <FadeUp>
            <div className="p-6 rounded-2xl mb-8 inline-block" style={{ background: "rgba(0,255,157,0.05)", border: "1px solid rgba(0,255,157,0.15)" }}>
              <p className="text-[#e8eeff] text-base md:text-lg italic leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                &ldquo;How beautiful are the feet of those who preach the gospel of peace!&rdquo;
              </p>
              <p className="grad-text text-sm font-bold mt-2">— Romans 10:15</p>
            </div>

            <h2
              className="font-display text-white mb-4"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 50px)", fontWeight: 800, letterSpacing: "-0.025em" }}
            >
              Your Feet Could Be <span className="grad-text">Beautiful!</span>
            </h2>
            <p className="text-[#8892b0] text-lg mb-3 leading-relaxed">Ready to win souls for Christ? Join us.</p>
            <p className="text-[#8892b0] text-sm mb-10">
              <span className="text-white font-semibold">Next outreach:</span> October – December 2026
            </p>

            <motion.a
              href={SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(0,255,157,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="grad-bg text-[#080d2e] font-bold text-base px-12 py-4 rounded-full inline-flex items-center gap-2"
            >
              Sign Up Here <ArrowRight size={17} />
            </motion.a>

            <p className="text-[#8892b0] text-xs mt-10 tracking-wide">Powered by Ahren Foundation</p>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
