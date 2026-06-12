"use client";

import { motion } from "framer-motion";
import { Flame, Cpu, Users2, BookOpen, Globe2, Rocket, Target } from "lucide-react";
import { SectionLabel, FadeUp, StaggerParent, StaggerChild, GradientOrb } from "@/components/ui";

const objectives = [
  {
    number: "01",
    icon: <Flame size={20} />,
    title: "Raise Holy Spirit-Led Innovators",
    color: "#00c9ff",
    desc: "Identify, equip, and release young believers who are surrendered to the Holy Spirit — building tech products not just with technical skill, but with divine inspiration and Kingdom purpose.",
  },
  {
    number: "02",
    icon: <Cpu size={20} />,
    title: "Build Faith-Based Tech Products",
    color: "#00ff9d",
    desc: "Develop and launch real-world digital tools that serve local churches, global missions, discipleship, and ministry administration — products that carry the Kingdom and reveal Jesus Christ.",
  },
  {
    number: "03",
    icon: <Users2 size={20} />,
    title: "Create a Global Mentorship Network",
    color: "#00c9ff",
    desc: "Connect young believers with seasoned Kingdom professionals across 7 continents — building intergenerational relationships that accelerate both spiritual and professional growth.",
  },
  {
    number: "04",
    icon: <BookOpen size={20} />,
    title: "Provide Free World-Class Tech Training",
    color: "#00ff9d",
    desc: "Run free seasonal workshops and structured learning programs that close the skills gap for youths — making world-class tech education a Kingdom gift, not a luxury.",
  },
  {
    number: "05",
    icon: <Globe2 size={20} />,
    title: "Advance the Great Commission Through Technology",
    color: "#00c9ff",
    desc: "Use technology as a vehicle to fulfil the Great Commission — creating digital tools and platforms that reach the unreached, disciple nations, and make Jesus known to every people group.",
  },
  {
    number: "06",
    icon: <Users2 size={20} />,
    title: "Build the Believers in Tech Community",
    color: "#00ff9d",
    desc: "Cultivate a thriving, Spirit-filled global community of believers in tech through fellowship, collaboration, creative discussions, networking, and shared Kingdom vision.",
  },
  {
    number: "07",
    icon: <Rocket size={20} />,
    title: "Showcase & Amplify Kingdom Tech Products",
    color: "#00c9ff",
    desc: "Actively promote and showcase our members' faith-based tech products to the wider body of Christ and the world — creating a Kingdom marketplace of Spirit-led innovation.",
  },
  {
    number: "08",
    icon: <Target size={20} />,
    title: "Foster Strategic Kingdom Collaborations",
    color: "#00ff9d",
    desc: "Form strategic partnerships with churches, ministries, missions organisations, and Christian tech leaders to multiply Kingdom impact through aligned collaboration.",
  },
];

export default function ObjectivesSection() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}
    >
      <GradientOrb className="left-[-5%] top-[20%]" size={500} color="cyan" />
      <GradientOrb className="right-[-5%] top-[60%]" size={500} color="mint" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <FadeUp className="text-center mb-14">
          <div className="flex justify-center">
            <SectionLabel>Our Direction</SectionLabel>
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
            Our <span className="grad-text">Objectives</span>
          </h2>
          <p className="text-[#8892b0] mt-4 max-w-xl mx-auto text-base leading-relaxed">
            Eight clear, Spirit-led objectives that define how Ahren Foundation moves from
            vision to Kingdom impact — one believer, one product, one community at a time.
          </p>
        </FadeUp>

        <StaggerParent className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {objectives.map((obj, i) => (
            <StaggerChild key={i}>
              <motion.div
                whileHover={{ y: -6, borderColor: obj.color + "44" }}
                className="relative p-8 rounded-3xl transition-all duration-300 overflow-hidden group h-full"
                style={{ background: "#111850", border: "1px solid rgba(0,201,255,0.1)" }}
              >
                <div
                  className="absolute top-4 right-6 text-7xl font-black opacity-[0.04] pointer-events-none select-none"
                  style={{ fontFamily: "var(--font-display)", color: obj.color, lineHeight: 1 }}
                >
                  {obj.number}
                </div>

                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: obj.color + "15", border: `1px solid ${obj.color}25`, color: obj.color }}
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
                    <h3 className="text-white font-bold text-lg leading-snug" style={{ fontFamily: "var(--font-display)" }}>
                      {obj.title}
                    </h3>
                  </div>
                </div>

                <p className="text-[#8892b0] text-[14px] leading-relaxed">{obj.desc}</p>

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
  );
}
