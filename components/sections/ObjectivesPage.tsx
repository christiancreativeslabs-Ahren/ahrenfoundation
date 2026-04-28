"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Target, Flame, Cpu, Users2, BookOpen, Globe2, Rocket } from "lucide-react";
import { SectionLabel, FadeUp, StaggerParent, StaggerChild, GradientOrb, GlowButton } from "@/components/ui";

const objectives = [
  {
    number: "01",
    icon: <Flame size={22} />,
    title: "Raise Holy Spirit-Led Innovators",
    color: "#00c9ff",
    desc: "Identify, equip, and release young believers who are surrendered to the Holy Spirit — building tech products not just with technical skill, but with divine inspiration and Kingdom purpose.",
  },
  {
    number: "02",
    icon: <Cpu size={22} />,
    title: "Build Faith-Based Tech Products",
    color: "#00ff9d",
    desc: "Develop and launch real-world digital tools that serve local churches, global missions, discipleship, and ministry administration — products that carry the Kingdom and reveal Jesus Christ.",
  },
  {
    number: "03",
    icon: <Users2 size={22} />,
    title: "Create a Global Mentorship Network",
    color: "#00c9ff",
    desc: "Connect young believers with seasoned Kingdom professionals across 7 continents — building intergenerational relationships that accelerate both spiritual and professional growth.",
  },
  {
    number: "04",
    icon: <BookOpen size={22} />,
    title: "Provide Free World-Class Tech Training",
    color: "#00ff9d",
    desc: "Run free seasonal workshops and structured learning programs that close the skills gap for youths in underserved communities — making world-class tech education a Kingdom gift, not a luxury.",
  },
  {
    number: "05",
    icon: <Globe2 size={22} />,
    title: "Advance the Great Commission Through Technology",
    color: "#00c9ff",
    desc: "Use technology as a vehicle to fulfil the Great Commission — creating digital tools and platforms that reach the unreached, disciple nations, and make Jesus known to every people group.",
  },
  {
    number: "06",
    icon: <Users2 size={22} />,
    title: "Build the Believers in Tech Community",
    color: "#00ff9d",
    desc: "Cultivate a thriving, Spirit-filled global community of believers in tech through fellowship, collaboration, creative discussions, networking, and shared Kingdom vision.",
  },
  {
    number: "07",
    icon: <Rocket size={22} />,
    title: "Showcase & Amplify Kingdom Tech Products",
    color: "#00c9ff",
    desc: "Actively promote and showcase our members' faith-based tech products to the wider body of Christ and the world — creating a Kingdom marketplace of Spirit-led innovation.",
  },
  {
    number: "08",
    icon: <Target size={22} />,
    title: "Foster Strategic Kingdom Collaborations",
    color: "#00ff9d",
    desc: "Form strategic partnerships with churches, ministries, missions organisations, and Christian tech leaders to multiply Kingdom impact through aligned collaboration and shared resources.",
  },
];

export default function ObjectivesPage() {
  return (
    <main className="bg-[#080d2e] overflow-hidden">
      {/* ── HEADER ── */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GradientOrb className="top-[-15%] right-[-5%]" size={700} color="mint" />
        <GradientOrb className="bottom-0 left-[-5%]" size={500} color="cyan" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FadeUp>
            <SectionLabel>Our Direction</SectionLabel>
            <h1
              className="font-display text-white leading-[1.02] mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 7vw, 82px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Our <span className="grad-text">Objectives</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-[#8892b0] leading-relaxed max-w-2xl" style={{ fontSize: "clamp(16px, 2vw, 20px)" }}>
              Eight clear, Spirit-led objectives that define how Ahren Foundation
              moves from vision to Kingdom impact — one believer, one product,
              one community at a time.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── OBJECTIVES GRID ── */}
      <section
        className="py-20 relative"
        style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}
      >
        <GradientOrb className="left-[-5%] top-[30%]" size={500} color="cyan" />
        <GradientOrb className="right-[-5%] top-[60%]" size={500} color="mint" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <StaggerParent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {objectives.map((obj, i) => (
              <StaggerChild key={i}>
                <motion.div
                  whileHover={{ y: -6, borderColor: obj.color + "44" }}
                  className="relative p-8 rounded-3xl transition-all duration-300 overflow-hidden group"
                  style={{
                    background: "#111850",
                    border: "1px solid rgba(0,201,255,0.1)",
                  }}
                >
                  {/* Background number watermark */}
                  <div
                    className="absolute top-4 right-6 text-7xl font-black opacity-[0.04] pointer-events-none select-none"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: obj.color,
                      lineHeight: 1,
                    }}
                  >
                    {obj.number}
                  </div>

                  {/* Top row */}
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: obj.color + "15",
                        border: `1px solid ${obj.color}25`,
                        color: obj.color,
                      }}
                    >
                      {obj.icon}
                    </div>
                    <div className="pt-0.5">
                      <span
                        className="text-[10px] font-bold tracking-[0.18em] uppercase block mb-1"
                        style={{ color: obj.color }}
                      >
                        Objective {obj.number}
                      </span>
                      <h3
                        className="text-white font-bold text-lg leading-snug"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {obj.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-[#8892b0] text-[14px] leading-relaxed">
                    {obj.desc}
                  </p>

                  {/* Bottom accent line on hover */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 rounded-b-3xl"
                    initial={{ width: "0%" }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ background: `linear-gradient(90deg, ${obj.color}, transparent)` }}
                  />
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </section>

      {/* ── NORTH STAR ── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0d1340 0%, #080d2e 100%)",
          borderTop: "1px solid rgba(0,201,255,0.08)",
        }}
      >
        <GradientOrb className="left-1/2 -translate-x-1/2 top-0" size={700} color="cyan" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <FadeUp>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8"
              style={{ background: "rgba(0,201,255,0.08)", border: "1px solid rgba(0,201,255,0.2)" }}
            >
              <Target size={13} className="text-[#00c9ff]" />
              <span className="text-[#00c9ff] text-xs font-bold tracking-widest uppercase">
                Our North Star
              </span>
            </div>
            <h2
              className="font-display text-white mb-6 text-balance"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
              }}
            >
              Every objective points to{" "}
              <span className="grad-text">one mission</span>
            </h2>
            <p className="text-[#8892b0] text-lg max-w-2xl mx-auto leading-relaxed mb-12">
              To build a global community of believers in tech who are using their tech
              skills, gifts, and creativity in line with God&apos;s plans and purposes on
              earth — revealing Jesus Christ to every nation, tribe, and tongue.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/join">
                <GlowButton>
                  Be Part of This <ArrowRight size={16} />
                </GlowButton>
              </Link>
              <Link href="/what-we-do">
                <GlowButton outline>
                  See How We Work
                </GlowButton>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
