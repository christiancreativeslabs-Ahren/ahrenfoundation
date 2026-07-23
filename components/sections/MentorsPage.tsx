"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { SectionLabel, FadeUp, StaggerParent, StaggerChild, GradientOrb } from "@/components/ui";
import { MENTORS } from "@/lib/data";

export default function MentorsPage() {
  return (
    <main className="bg-[#080d2e] overflow-hidden">
      {/* Header */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GradientOrb className="top-[-15%] right-[-5%]" size={700} color="cyan" />
        <GradientOrb className="bottom-0 left-[-5%]" size={500} color="mint" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FadeUp>
            <SectionLabel>Our Mentors</SectionLabel>
            <h1
              className="font-display text-white leading-[1.02] mb-6 text-balance"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(34px, 5.5vw, 68px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Meet Some of Our{" "}
              <span className="grad-text">Mentors &amp; Facilitators</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p
              className="text-[#8892b0] leading-relaxed max-w-3xl"
              style={{ fontSize: "clamp(16px, 2vw, 20px)" }}
            >
              Our mentors and facilitators are Christian creatives, tech professionals, industry
              experts, entrepreneurs, and product builders who have said yes to investing in the
              next generation of Christian Creatives.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Mentors grid */}
      <section className="py-16 relative" style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}>
        <GradientOrb className="left-[-5%] top-[15%]" size={500} color="cyan" />
        <GradientOrb className="right-[-5%] top-[50%]" size={500} color="mint" />
        <GradientOrb className="left-[-5%] top-[80%]" size={400} color="cyan" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <StaggerParent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MENTORS.map((mentor, i) => (
              <StaggerChild key={i}>
                <motion.div
                  whileHover={{ y: -8, borderColor: "rgba(0,201,255,0.35)" }}
                  className="card overflow-hidden h-full flex flex-col transition-all duration-300"
                  style={{ borderRadius: 22 }}
                >
                  {/* Photo */}
                  <div className="relative overflow-hidden bg-[#0d1340]" style={{ aspectRatio: "1 / 1" }}>
                    <Image
                      src={mentor.photo}
                      alt={mentor.name}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(to top, rgba(17,24,80,0.95) 0%, transparent 40%)" }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] font-bold px-3 py-1.5 rounded-full grad-bg text-[#080d2e] tracking-widest uppercase">
                        Mentor
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3
                      className="text-white text-lg font-bold mb-1 leading-snug"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {mentor.name}
                    </h3>
                    {"role" in mentor && mentor.role ? (
                      <p className="text-[#00c9ff] text-xs font-semibold mb-3">{mentor.role}</p>
                    ) : (
                      <div className="mb-2" />
                    )}
                    <p className="text-[#8892b0] text-[13px] leading-relaxed flex-1">{mentor.bio}</p>
                  </div>
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>

          {/* More coming */}
          <FadeUp className="text-center mt-14">
            <div
              className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl"
              style={{ background: "rgba(17,24,80,0.6)", border: "1px solid rgba(0,201,255,0.12)" }}
            >
              <span className="w-2 h-2 rounded-full grad-bg animate-pulse flex-shrink-0" />
              <p className="text-[#8892b0] text-sm">
                More mentors joining soon — we&apos;re onboarding Christian creatives and industry
                experts from around the world.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Join Our Team of Mentors */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ borderTop: "1px solid rgba(0,201,255,0.08)", background: "rgba(13,19,64,0.35)" }}
      >
        <GradientOrb className="right-[-5%] top-1/4" size={500} color="mint" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <FadeUp>
            <div
              className="rounded-3xl p-10 md:p-12 text-center relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(0,255,157,0.07) 0%, rgba(0,201,255,0.05) 100%)",
                border: "1px solid rgba(0,255,157,0.22)",
              }}
            >
              <div
                className="absolute left-[-50px] bottom-[-50px] w-56 h-56 rounded-full blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(0,255,157,0.1), transparent 70%)" }}
              />
              <div className="relative z-10">
                <div className="text-[10px] font-bold tracking-[0.18em] uppercase grad-text mb-3">
                  Become a Mentor
                </div>
                <h2
                  className="text-white text-2xl md:text-3xl font-bold mb-5"
                  style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
                >
                  Join Our Team of Mentors
                </h2>
                <p className="text-[#8892b0] text-base leading-relaxed max-w-2xl mx-auto mb-8">
                  Are you a Christian creative, tech professional, industry expert, a product builder
                  or an entrepreneur with a heart for investing in the next generation of young
                  creatives? We would love to have you on our team as a mentor or facilitator.
                </p>
                <motion.a
                  href="mailto:mentors@ahrenfoundation.org"
                  whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(0,255,157,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  className="grad-bg text-[#080d2e] font-bold text-sm px-8 py-4 rounded-full inline-flex items-center gap-2"
                >
                  <Mail size={16} />
                  mentors@ahrenfoundation.org
                </motion.a>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0d1340 0%, #080d2e 100%)",
          borderTop: "1px solid rgba(0,201,255,0.08)",
        }}
      >
        <GradientOrb className="left-1/2 -translate-x-1/2 top-0" size={600} color="cyan" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <FadeUp>
            <SectionLabel>Get Involved</SectionLabel>
            <h2
              className="font-display text-white mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 50px)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
              }}
            >
              Want to Be Mentored by <span className="grad-text">These Leaders?</span>
            </h2>
            <p className="text-[#8892b0] text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              Join our 6-Weeks Christian Creatives Masterclass Program and be paired with a
              Spirit-filled mentor who believes in you.
            </p>
            <a href="/apply">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(0,201,255,0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="grad-bg text-[#080d2e] font-bold text-base px-10 py-4 rounded-full inline-flex items-center gap-2"
              >
                Apply as a Creative Youth <ArrowRight size={17} />
              </motion.button>
            </a>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
