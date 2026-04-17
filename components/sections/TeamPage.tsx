"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionLabel, FadeUp, StaggerParent, StaggerChild, GradientOrb } from "@/components/ui";
import { TEAM } from "@/lib/data";

export default function TeamPage() {
  return (
    <main className="bg-[#080d2e] overflow-hidden">
      {/* Header */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GradientOrb className="top-[-15%] right-[-5%]" size={700} color="cyan" />
        <GradientOrb className="bottom-0 left-[-5%]" size={500} color="mint" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FadeUp>
            <SectionLabel>Leadership</SectionLabel>
            <h1
              className="font-display text-white leading-[1.02] mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 7vw, 80px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Executive Team
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-[#8892b0] leading-relaxed max-w-2xl" style={{ fontSize: "clamp(16px, 2vw, 20px)" }}>
              Seasoned Kingdom professionals committed to raising Holy Spirit-led innovators
              who use their gifts to impact lives and reveal Jesus Christ to the world.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Featured leaders */}
      <section className="py-16 relative" style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <StaggerParent className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {TEAM.filter((m) => m.featured).map((member, i) => (
              <StaggerChild key={i}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="card overflow-hidden transition-all duration-300"
                  style={{ borderRadius: 28 }}
                >
                  {/* Photo */}
                  <div
                    className="relative overflow-hidden"
                    style={{ height: 340 }}
                  >
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #1a2565, #080d2e)" }}
                      >
                        <span className="text-6xl opacity-20">👤</span>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, #111850 0%, transparent 55%)" }}
                    />
                    {/* Label badge */}
                    <div className="absolute top-5 left-5">
                      <span
                        className="text-[11px] font-bold px-4 py-1.5 rounded-full grad-bg text-[#080d2e] tracking-widest uppercase"
                      >
                        {member.label}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-8">
                    <h3
                      className="text-white text-2xl font-bold mb-1"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {member.name}
                    </h3>
                    <p className="text-[#00c9ff] text-sm font-semibold mb-5">{member.role}</p>
                    {member.bio && (
                      <p className="text-[#8892b0] text-sm leading-relaxed">{member.bio}</p>
                    )}
                  </div>
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>

          {/* Supporting team */}
          <StaggerParent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TEAM.filter((m) => !m.featured).map((member, i) => (
              <StaggerChild key={i}>
                <motion.div
                  whileHover={{ y: -4, borderColor: "rgba(0,201,255,0.3)" }}
                  className="card p-7 flex items-center gap-5 transition-all duration-300"
                  style={{ borderRadius: 20 }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, rgba(0,201,255,0.15), rgba(0,255,157,0.15))" }}
                  >
                    <span className="text-2xl">💻</span>
                  </div>
                  <div>
                    <span
                      className="text-[10px] font-bold tracking-[0.15em] uppercase grad-text block mb-1"
                    >
                      {member.label}
                    </span>
                    <h4
                      className="text-white font-bold text-lg mb-0.5"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {member.name}
                    </h4>
                    <p className="text-[#8892b0] text-xs">{member.role}</p>
                  </div>
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </section>

      {/* Join the team CTA */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d1340 0%, #080d2e 100%)", borderTop: "1px solid rgba(0,201,255,0.08)" }}
      >
        <GradientOrb className="left-1/2 -translate-x-1/2 top-0" size={600} color="cyan" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <FadeUp>
            <SectionLabel>Get Involved</SectionLabel>
            <h2
              className="font-display text-white mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              Want to Partner <span className="grad-text">With Us?</span>
            </h2>
            <p className="text-[#8892b0] text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              We&apos;re always looking for mentors, collaborators, and Kingdom-minded professionals
              to join this movement.
            </p>
            <a href="/join">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(0,201,255,0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="grad-bg text-[#080d2e] font-bold text-base px-10 py-4 rounded-full"
              >
                Become a Mentor
              </motion.button>
            </a>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
