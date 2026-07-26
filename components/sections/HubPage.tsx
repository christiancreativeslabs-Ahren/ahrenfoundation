"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Lock, LogIn } from "lucide-react";
import { SectionLabel, FadeUp, GradientOrb } from "@/components/ui";

const APPLY_URL = "/training/apply";
const LOGIN_URL = "/hub/login";

const whoWeWant = [
  "Curious, creative & tech-inclined Christian",
  "Purpose-driven",
  "Open to the Holy Spirit",
  "Open to networking & collaborating with likeminds",
  "Godly Character, Teachable and Reliable",
  "Age 16–30",
];
const commit = [
  "12 Interactive Modules delivered to your Inbox",
  "3 Live Virtual Classes on AI & Tech for Creatives, Branding, Digital Content Creation & Digital Marketing — 3 Saturdays",
  "1-on-1 Virtual Mentor Meetings — 3 Saturdays",
];
const gain = [
  "Biblical understanding of how to use your skills and creativity to build impactful projects",
  "Practical Digital Skills Training in AI for Creatives, Branding, Digital Content Creation & Digital Marketing",
  "Real-life experience insights from creative mentors",
  "A Clear Path to Launch Your Creative Project",
  "Certificate of Completion",
  "Networking and Collaboration Opportunities",
  "Verified Membership Access to our Community Hub",
  "Pathway to Funding Opportunities",
];

export default function HubPage() {
  return (
    <main className="bg-[#080d2e] overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GradientOrb
          className="top-[-15%] right-[-5%]"
          size={600}
          color="cyan"
        />
        <GradientOrb className="bottom-0 left-[-5%]" size={500} color="mint" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FadeUp>
            <SectionLabel>Community Hub</SectionLabel>
            <h1
              className="font-display text-white leading-[1.04] mb-6 text-balance"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 5vw, 60px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Welcome to <span className="grad-text">Ahren Hub</span>
              <br className="hidden sm:block" /> Your Gateway to our Global
              Community of Christian Creatives
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p
              className="text-[#8892b0] leading-relaxed max-w-3xl"
              style={{ fontSize: "clamp(16px, 2vw, 19px)" }}
            >
              Ahren Hub is your gateway to our Youth Empowerment &amp;
              Mentorship Programs — whether you&apos;re joining the 6-Week Tech
              &amp; Creativity Mentorship or continuing as a verified member.
              Connect, learn, and grow with like-minded believers using tech and
              creativity to build, serve and impact this generation for Jesus
              Christ.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── JOIN THE PROGRAM ── */}
      <section
        className="pb-8 pt-4 relative"
        style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}
      >
        <div className="max-w-4xl mx-auto px-6 pt-14">
          {/* Program banner */}
          <FadeUp>
            <div
              className="rounded-3xl p-8 md:p-10 mb-6 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,201,255,0.08) 0%, rgba(0,255,157,0.05) 100%)",
                border: "1px solid rgba(0,201,255,0.2)",
              }}
            >
              <div
                className="absolute right-[-50px] top-[-50px] w-56 h-56 rounded-full blur-3xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(0,255,157,0.1), transparent 70%)",
                }}
              />
              <div className="relative z-10">
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4"
                  style={{
                    background: "rgba(0,201,255,0.1)",
                    border: "1px solid rgba(0,201,255,0.2)",
                  }}
                >
                  <Sparkles size={12} className="text-[#00c9ff]" />
                  <span className="text-[#00c9ff] text-[11px] font-bold tracking-widest uppercase">
                    Join the Program
                  </span>
                </div>
                <h2
                  className="text-white text-2xl md:text-3xl font-bold mb-3 leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  6-Weeks Tech &amp; Creativity Masterclass Program
                </h2>
                <p className="text-[#8892b0] text-base leading-relaxed">
                  Are you a curious, creative, tech-inclined believer ready to
                  learn how to steward your skills, gifts and creative prowess
                  for God&apos;s purposes on earth? Then this program is for you
                  — we invite you to apply.
                </p>
              </div>
            </div>
          </FadeUp>

          {/* New cohort box */}
          <FadeUp delay={0.08}>
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 rgba(0,255,157,0)",
                  "0 0 28px rgba(0,255,157,0.18)",
                  "0 0 0 rgba(0,255,157,0)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl p-6 md:p-7 mb-8 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,255,157,0.09) 0%, rgba(0,201,255,0.06) 100%)",
                border: "1px solid rgba(0,255,157,0.28)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff9d] opacity-70" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00ff9d]" />
                  </span>
                  <span className="text-[#00ff9d] text-[11px] font-bold tracking-[0.16em] uppercase whitespace-nowrap">
                    New Cohort Now Open
                  </span>
                </div>
                <p className="text-[#e8eeff] text-sm md:text-[15px] leading-relaxed">
                  The program kicks off virtually in{" "}
                  <span className="text-white font-bold">September 2026</span>,{" "}
                  running over 6 Saturdays. Application deadline:{" "}
                  <span className="text-white font-bold">August 22, 2026</span>.
                  Spots are limited!
                </p>
              </div>
            </motion.div>
          </FadeUp>

          {/* Apply CTA */}
          <FadeUp delay={0.12}>
            <div className="text-center mb-12">
              <motion.a
                href={APPLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 0 40px rgba(0,201,255,0.35)",
                }}
                whileTap={{ scale: 0.97 }}
                className="grad-bg text-[#080d2e] font-bold text-base px-12 py-4 rounded-full inline-flex items-center gap-2"
              >
                Apply Now <ArrowRight size={17} />
              </motion.a>
            </div>
          </FadeUp>

          {/* Info columns */}
          <FadeUp delay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {[
                { title: "Who We Want", items: whoWeWant, color: "#00c9ff" },
                {
                  title: "What You Commit To (6 Weeks)",
                  items: commit,
                  color: "#00ff9d",
                },
                { title: "What You'll Gain", items: gain, color: "#00c9ff" },
              ].map((col, i) => (
                <div
                  key={i}
                  className="card p-7"
                  style={{
                    borderRadius: 20,
                    borderTop: `3px solid ${col.color}`,
                  }}
                >
                  <h3
                    className="text-white font-bold text-base mb-5"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {col.title}
                  </h3>
                  <ul className="space-y-3">
                    {col.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: col.color + "20" }}
                        >
                          <Check size={10} style={{ color: col.color }} />
                        </span>
                        <span className="text-[#8892b0] text-[13px] leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* Not sure */}
          <FadeUp delay={0.18}>
            <div
              className="rounded-2xl p-6 mb-4 text-center"
              style={{
                background: "rgba(0,255,157,0.05)",
                border: "1px solid rgba(0,255,157,0.15)",
              }}
            >
              <h4
                className="text-white font-bold text-base mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Not sure if you fit?
              </h4>
              <p className="text-[#8892b0] text-sm leading-relaxed max-w-xl mx-auto">
                Apply anyway. We will help you discover how your creativity,
                gifts &amp; skills are valuable to God&apos;s purpose on earth.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── COMMUNITY ACCESS / LOGIN ── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0d1340 0%, #080d2e 100%)",
          borderTop: "1px solid rgba(0,201,255,0.08)",
        }}
      >
        <GradientOrb
          className="left-1/2 -translate-x-1/2 top-0"
          size={600}
          color="cyan"
        />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <FadeUp className="text-center mb-10">
            <div className="flex justify-center">
              <SectionLabel>Members Only</SectionLabel>
            </div>
            <h2
              className="font-display text-white"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(26px, 3.5vw, 44px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              Community Access <span className="grad-text">— Login</span>
            </h2>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="card p-8 md:p-10" style={{ borderRadius: 28 }}>
              {/* Lock notice */}
              <div
                className="flex items-start gap-4 mb-8 p-5 rounded-2xl"
                style={{
                  background: "rgba(0,201,255,0.05)",
                  border: "1px solid rgba(0,201,255,0.12)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-[#00c9ff]"
                  style={{ background: "rgba(0,201,255,0.12)" }}
                >
                  <Lock size={20} />
                </div>
                <p className="text-[#8892b0] text-sm leading-relaxed">
                  Access to our Community Hub is exclusively for verified
                  members. If you have not yet registered for our training
                  program, you will not be able to log in.
                </p>
              </div>

              {/* Steps to become verified */}
              <div className="mb-8">
                <h3
                  className="text-white font-bold text-base mb-5"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  To become a verified member:
                </h3>
                <div className="space-y-3">
                  {[
                    "Apply for the 6-Week Tech & Creativity Masterclass Program",
                    "Complete the program requirements",
                    "Receive your verified member status",
                  ].map((step, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-xl"
                      style={{
                        background: "#111850",
                        border: "1px solid rgba(0,201,255,0.08)",
                      }}
                    >
                      <span className="w-8 h-8 rounded-full grad-bg flex items-center justify-center flex-shrink-0 text-[#080d2e] font-bold text-sm">
                        {i + 1}
                      </span>
                      <span className="text-[#e8eeff] text-sm leading-snug">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[#8892b0] text-sm leading-relaxed mb-6">
                If you have already been accepted into our training program,
                please log in below to access your weekly modules, assignments
                and community resources.
              </p>

              {/* Login + Apply buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href={LOGIN_URL}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 36px rgba(0,201,255,0.35)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 grad-bg text-[#080d2e] font-bold text-base py-4 rounded-2xl inline-flex items-center justify-center gap-2"
                >
                  <LogIn size={18} />
                  Member Login
                </motion.a>
                <motion.a
                  href={APPLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 font-bold text-base py-4 rounded-2xl inline-flex items-center justify-center gap-2 transition-all"
                  style={{
                    border: "1.5px solid rgba(0,201,255,0.3)",
                    color: "#00c9ff",
                  }}
                >
                  Apply First <ArrowRight size={16} />
                </motion.a>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
