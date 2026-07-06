"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import { SectionLabel, FadeUp, GradientOrb } from "@/components/ui";

const YOUTH_FORM_URL = "https://forms.gle/hovpD1RkfRnojULYA";

export default function JoinPage() {
  const whoWeWant = [
    "Curious, creative & tech-inclined Christian",
    "Purpose-driven",
    "Open to the Holy Spirit",
    "Open to networking & collaborating with likeminds",
    "Godly Character, Teachable and Reliable",
    "Age 16–30",
  ];
  const commit = [
    "Weekly Email lessons & mentor meeting (virtually)",
    "Build & launch a kingdom creative product/platform that positively impacts lives & reveals Jesus Christ",
    "Weekly workbook reflection",
    "80% – 100% attendance & participation",
    "Respond within 48 hours",
  ];
  const gain = [
    "A Spirit-filled experienced Creative mentor who believes in you",
    "Clarity on your Kingdom Creative Project",
    "Certificate of completion",
    "Path to Project funding, access to seasoned creative mentors, free & affordable high-impact trainings, a community of Believers in Tech, collaboration opportunities, incubation & lots more",
  ];

  return (
    <main className="bg-[#080d2e] overflow-hidden">
      {/* Header */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GradientOrb className="top-[-15%] right-[-5%]" size={600} color="cyan" />
        <GradientOrb className="bottom-0 left-[-5%]" size={500} color="mint" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FadeUp>
            <SectionLabel>Get Involved</SectionLabel>
            <h1
              className="font-display text-white leading-[1.02] mb-6"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px, 6vw, 68px)", fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              Join Ahren Foundation
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-[#8892b0] leading-relaxed max-w-2xl" style={{ fontSize: "clamp(16px, 2vw, 19px)" }}>
              Are you a curious, creative, tech-inclined young believer ready to align your gifts with
              God&apos;s purpose? Our 6-Weeks Christian Creatives Masterclass Program was built for you.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Content */}
      <section className="pb-28 relative" style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}>
        <div className="max-w-4xl mx-auto px-6 pt-12">
          {/* Program banner */}
          <FadeUp>
            <div
              className="rounded-3xl p-8 md:p-10 mb-8 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(0,201,255,0.08) 0%, rgba(0,255,157,0.05) 100%)", border: "1px solid rgba(0,201,255,0.2)" }}
            >
              <div className="absolute right-[-50px] top-[-50px] w-56 h-56 rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,255,157,0.1), transparent 70%)" }} />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4" style={{ background: "rgba(0,201,255,0.1)", border: "1px solid rgba(0,201,255,0.2)" }}>
                  <Sparkles size={12} className="text-[#00c9ff]" />
                  <span className="text-[#00c9ff] text-[11px] font-bold tracking-widest uppercase">6-Weeks Program</span>
                </div>
                <h2 className="text-white text-2xl md:text-3xl font-bold mb-3 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                  6-Weeks Christian Creatives Masterclass Program
                </h2>
                <p className="text-[#8892b0] text-base leading-relaxed">
                  On Creativity, Tech Skills &amp; God&apos;s Purpose — a guided journey to discover, sharpen, and
                  consecrate your gifts to build a Kingdom product that reveals Jesus Christ.
                </p>
              </div>
            </div>
          </FadeUp>

          {/* Three columns */}
          <FadeUp delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {[
                { title: "Who We Want", items: whoWeWant, color: "#00c9ff" },
                { title: "What You Commit To (6 Weeks)", items: commit, color: "#00ff9d" },
                { title: "What You Gain", items: gain, color: "#00c9ff" },
              ].map((col, i) => (
                <div key={i} className="card p-7" style={{ borderRadius: 20, borderTop: `3px solid ${col.color}` }}>
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
              ))}
            </div>
          </FadeUp>

          {/* Not sure */}
          <FadeUp delay={0.15}>
            <div className="rounded-2xl p-6 mb-8 text-center" style={{ background: "rgba(0,255,157,0.05)", border: "1px solid rgba(0,255,157,0.15)" }}>
              <h4 className="text-white font-bold text-base mb-2" style={{ fontFamily: "var(--font-display)" }}>Not sure if you fit?</h4>
              <p className="text-[#8892b0] text-sm leading-relaxed max-w-xl mx-auto">
                Apply anyway. We will help you discover how your creativity, gifts &amp; skills are valuable to
                God&apos;s purpose on earth.
              </p>
            </div>
          </FadeUp>

          {/* Apply button → Google Form */}
          <FadeUp delay={0.2}>
            <div className="text-center mb-16">
              <motion.a
                href={YOUTH_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(0,201,255,0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="grad-bg text-[#080d2e] font-bold text-base px-12 py-4 rounded-full inline-flex items-center gap-2"
              >
                Apply as a Creative Youth <ArrowRight size={17} />
              </motion.a>
              <p className="text-[#8892b0] text-xs mt-4">Opens our secure application form</p>
            </div>
          </FadeUp>

          {/* Strategic Partner — ILA */}
          <FadeUp delay={0.25}>
            <div className="pt-10" style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}>
              <div className="text-center mb-8">
                <div className="flex justify-center">
                  <SectionLabel>Strategic Partner</SectionLabel>
                </div>
                <h3 className="text-white text-xl md:text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  In Partnership With <span className="grad-text">ILA</span>
                </h3>
              </div>
              <div
                className="rounded-2xl p-8 flex flex-col md:flex-row items-start gap-6"
                style={{ background: "#111850", border: "1px solid rgba(0,201,255,0.1)" }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
                  style={{ background: "linear-gradient(135deg, rgba(0,201,255,0.15), rgba(0,255,157,0.12))", border: "1px solid rgba(0,201,255,0.2)" }}
                >
                  🎓
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "var(--font-display)" }}>
                    Immersive Leadership Academy (ILA)
                  </h4>
                  <p className="text-[#00c9ff] text-xs font-semibold mb-3 tracking-wide uppercase">
                    Leadership Development Partner
                  </p>
                  <p className="text-[#8892b0] text-sm leading-relaxed">
                    Immersive Leadership Academy (ILA) is a forward-thinking development initiative
                    dedicated to shaping the next generation of leaders. They empower young minds and
                    young professionals with the essential skills, mindset, and confidence needed to
                    excel in their careers, businesses, and personal lives. Through practical training,
                    mentorship, and transformative learning experiences, ILA is committed to building
                    capable, purpose-driven young individuals equipped to lead with clarity, creativity,
                    and impact.
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
