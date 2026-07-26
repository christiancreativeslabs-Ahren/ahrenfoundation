"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Mail, Phone, ArrowRight, Handshake } from "lucide-react";
import { SectionLabel, FadeUp, StaggerParent, StaggerChild, GradientOrb } from "@/components/ui";

const REASONS = [
  "Invest in the next generation of young Christian creatives",
  "Support our free mentorship and training programs",
  "Partner with a growing global movement of believers in tech",
  "See lives transformed through kingdom tech and creativity",
  "Support the Great Commission by empowering young creatives to reach their generation",
  "Support our CCLabs projects where we build faith-based tech products for missions and ministries",
  "Support our outreaches including CitiReach street evangelism and Believers in Tech Fellowship",
  "Receive regular impact reports and prayer updates",
];

export default function PartnersPage() {
  return (
    <main className="bg-[#080d2e] overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GradientOrb className="top-[-15%] left-[-5%]" size={700} color="cyan" />
        <GradientOrb className="top-[10%] right-[-5%]" size={500} color="mint" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FadeUp>
            <SectionLabel>Partnership</SectionLabel>
            <h1
              className="font-display text-white leading-[1.02] mb-6 text-balance"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(38px, 6.5vw, 76px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Partner <span className="grad-text">With Us</span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.15}>
            <p className="text-white text-xl md:text-2xl font-semibold mb-5" style={{ fontFamily: "var(--font-display)" }}>
              We cannot do this alone.
            </p>
            <p className="text-[#8892b0] leading-relaxed max-w-3xl mb-8" style={{ fontSize: "clamp(16px, 2vw, 19px)" }}>
              We invite you to partner with us — whether as an individual, a ministry, or a corporate
              organisation — to help us equip the next generation of young Christian creatives with
              the skills, confidence, and spiritual foundation they need to build impactful projects
              that glorify Jesus Christ.
            </p>
          </FadeUp>

          <FadeUp delay={0.25}>
            <div
              className="inline-block px-6 py-5 rounded-2xl mb-8"
              style={{ background: "rgba(0,201,255,0.06)", border: "1px solid rgba(0,201,255,0.2)" }}
            >
              <p className="text-[#e8eeff] text-base md:text-lg italic leading-relaxed max-w-2xl" style={{ fontFamily: "Georgia, serif" }}>
                &ldquo;Therefore go and make disciples of all nations, baptizing them in the name of
                the Father and of the Son and of the Holy Spirit.&rdquo;
              </p>
              <p className="grad-text text-sm font-bold mt-2">— Matthew 28:19</p>
            </div>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className="flex flex-wrap gap-4">
              <motion.a
                href="mailto:partners@ahrenfoundation.org"
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(0,201,255,0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="grad-bg text-[#080d2e] font-bold text-base px-8 py-4 rounded-full inline-flex items-center gap-2"
              >
                <Handshake size={17} />
                Become a Partner
              </motion.a>
              <motion.a
                href="https://wa.me/2347047555064"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="font-bold text-sm px-8 py-4 rounded-full inline-flex items-center gap-2 transition-all"
                style={{ border: "1.5px solid #00ff9d", color: "#00ff9d" }}
              >
                <Phone size={16} />
                WhatsApp Us
              </motion.a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── HERO IMAGE ── */}
      <section className="relative overflow-hidden" style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}>
        <div className="relative" style={{ height: "clamp(260px, 40vw, 420px)" }}>
          <Image
            src="/showcase/collaborate-whiteboard.jpg"
            alt="Young Christian creatives collaborating"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(8,13,46,0.95) 0%, rgba(8,13,46,0.35) 50%, rgba(8,13,46,0.7) 100%)",
            }}
          />
          <div className="absolute inset-0 flex items-end justify-center pb-10 px-6">
            <p
              className="text-center text-white font-bold text-balance"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px, 2.6vw, 30px)", letterSpacing: "-0.02em" }}
            >
              Equipping a generation to build{" "}
              <span className="grad-text">for the Kingdom</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── WHY PARTNER ── */}
      <section className="py-24 relative" style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}>
        <GradientOrb className="left-[-5%] top-1/4" size={500} color="cyan" />
        <GradientOrb className="right-[-5%] bottom-1/4" size={500} color="mint" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <FadeUp className="text-center mb-14">
            <div className="flex justify-center">
              <SectionLabel>The Impact</SectionLabel>
            </div>
            <h2
              className="font-display text-white"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              Why Partner <span className="grad-text">With Us?</span>
            </h2>
          </FadeUp>

          <StaggerParent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REASONS.map((reason, i) => (
              <StaggerChild key={i}>
                <motion.div
                  whileHover={{ x: 5, borderColor: "rgba(0,201,255,0.3)" }}
                  className="flex items-start gap-4 p-6 rounded-2xl h-full transition-all duration-300"
                  style={{ background: "#111850", border: "1px solid rgba(0,201,255,0.1)" }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: i % 2 === 0 ? "rgba(0,201,255,0.15)" : "rgba(0,255,157,0.15)" }}
                  >
                    <Check size={14} style={{ color: i % 2 === 0 ? "#00c9ff" : "#00ff9d" }} />
                  </div>
                  <span className="text-[#e8eeff] text-[15px] leading-relaxed">{reason}</span>
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </section>

      {/* ── SCRIPTURE + GRATITUDE ── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0d1340 0%, #080d2e 100%)",
          borderTop: "1px solid rgba(0,201,255,0.08)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(0,201,255,0.06) 1px, transparent 1px)", backgroundSize: "30px 30px" }}
        />
        <GradientOrb className="left-1/2 -translate-x-1/2 top-0" size={600} color="cyan" />

        <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
          <FadeUp>
            <p className="text-[#8892b0] text-base md:text-lg leading-relaxed mb-10">
              We are grateful for the partners who have already said yes to this vision. If you would
              like to join them, reach out to us today.
            </p>

            <div
              className="p-7 rounded-2xl"
              style={{ background: "rgba(0,255,157,0.05)", border: "1px solid rgba(0,255,157,0.18)" }}
            >
              <p className="text-[#e8eeff] text-base md:text-lg italic leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                &ldquo;For the earnest expectation of the creature waiteth for the manifestation of
                the sons of God.&rdquo;
              </p>
              <p className="grad-text text-sm font-bold mt-3">— Romans 8:19</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── READY TO PARTNER ── */}
      <section className="py-24 relative overflow-hidden">
        <GradientOrb className="left-1/2 -translate-x-1/2 top-1/4" size={700} color="mint" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <FadeUp>
            <h2
              className="font-display text-white mb-10"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
              }}
            >
              Ready to <span className="grad-text">Partner?</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              <motion.a
                href="https://wa.me/2347047555064"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, borderColor: "rgba(0,255,157,0.4)" }}
                className="flex flex-col items-center gap-3 p-8 rounded-2xl transition-all duration-300"
                style={{ background: "#111850", border: "1px solid rgba(0,201,255,0.12)" }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#00ff9d]"
                  style={{ background: "rgba(0,255,157,0.12)" }}
                >
                  <Phone size={22} />
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#8892b0]">
                  Call / WhatsApp
                </span>
                <span className="text-white text-base font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  +234 704 755 5064
                </span>
              </motion.a>

              <motion.a
                href="mailto:partners@ahrenfoundation.org"
                whileHover={{ y: -5, borderColor: "rgba(0,201,255,0.4)" }}
                className="flex flex-col items-center gap-3 p-8 rounded-2xl transition-all duration-300"
                style={{ background: "#111850", border: "1px solid rgba(0,201,255,0.12)" }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#00c9ff]"
                  style={{ background: "rgba(0,201,255,0.12)" }}
                >
                  <Mail size={22} />
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#8892b0]">
                  Email Us
                </span>
                <span className="text-white text-sm font-bold break-all" style={{ fontFamily: "var(--font-display)" }}>
                  partners@ahrenfoundation.org
                </span>
              </motion.a>
            </div>

            <div className="mt-12">
              <a href="/about">
                <motion.span
                  whileHover={{ x: 4 }}
                  className="inline-flex items-center gap-2 text-[#8892b0] text-sm font-semibold hover:text-[#00c9ff] transition-colors cursor-pointer"
                >
                  Learn more about our mission <ArrowRight size={15} />
                </motion.span>
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
