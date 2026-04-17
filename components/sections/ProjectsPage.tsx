"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Droplets, Globe2, ArrowUpRight, Sparkles, Layers } from "lucide-react";
import { SectionLabel, FadeUp, StaggerParent, StaggerChild, GradientOrb } from "@/components/ui";

const projects = [
  {
    id: "wells",
    name: "WELLS",
    tagline: "Living Water, Digital Streams",
    label: "Spiritual Resources Platform",
    href: "https://wells.bolt.host/",
    status: "Prototype",
    color: "#00c9ff",
    colorAlt: "#0ea5e9",
    icon: <Droplets size={28} />,
    emoji: "💧",
    description:
      "WELLS is a faith-driven platform designed to provide believers with curated spiritual resources, devotionals, and community-driven content — a digital wellspring for those thirsting for deeper connection with God.",
    longDesc:
      "Inspired by John 4:14 — 'But whoever drinks the water I give them will never thirst' — WELLS is being built as the go-to digital destination for believers who want to grow deeper in God. From curated devotionals and Spirit-led resources to community-driven content and worship tools, WELLS is designed to be a living, breathing stream of Kingdom content.",
    features: [
      "Curated daily devotionals",
      "Spirit-led spiritual resources",
      "Community-driven content",
      "Deeper connection with God",
    ],
    scripture: "John 4:14",
    scriptureText: "Whoever drinks the water I give them will never thirst.",
    gradient: "from-[#0ea5e9] to-[#00c9ff]",
    bgGlow: "rgba(0,201,255,0.07)",
    borderAccent: "rgba(0,201,255,0.3)",
  },
  {
    id: "praynations",
    name: "PRAYNATIONS",
    tagline: "Uniting Nations in Prayer",
    label: "Global Prayer Platform",
    href: "https://praynations.bolt.host/",
    status: "Prototype",
    color: "#00ff9d",
    colorAlt: "#10b981",
    icon: <Globe2 size={28} />,
    emoji: "🌍",
    description:
      "PrayNations is a global prayer platform for the lost, the unreached people groups, missions, and missionaries across the globe.",
    longDesc:
      "Born out of the Great Commission, PrayNations connects believers around the world in unified, strategic prayer for the lost, the unreached, and global missionaries. Every nation. Every tribe. Every tongue. PrayNations is building a digital infrastructure for the global prayer movement — so that no people group is left without intercession.",
    features: [
      "Prayer for unreached people groups",
      "Global missions & missionaries",
      "Unified intercession network",
      "Nations-focused prayer strategy",
    ],
    scripture: "1 Timothy 2:1",
    scriptureText: "I urge that petitions, prayers, intercession... be made for all people.",
    gradient: "from-[#10b981] to-[#00ff9d]",
    bgGlow: "rgba(0,255,157,0.07)",
    borderAccent: "rgba(0,255,157,0.3)",
  },
];

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Glow orb behind card */}
      <div
        className="absolute inset-0 rounded-[32px] blur-3xl pointer-events-none"
        style={{ background: project.bgGlow, transform: "scale(0.95)" }}
      />

      <div
        className="relative rounded-[32px] overflow-hidden"
        style={{
          background: "#111850",
          border: `1px solid ${project.borderAccent}`,
        }}
      >
        {/* Top accent bar */}
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, ${project.color}, ${project.colorAlt})` }}
        />

        <div className={`grid lg:grid-cols-2 gap-0 ${!isEven ? "lg:grid-flow-dense" : ""}`}>
          {/* Visual side */}
          <div
            className={`relative flex items-center justify-center min-h-[380px] overflow-hidden ${!isEven ? "lg:col-start-2" : ""}`}
            style={{
              background: `radial-gradient(ellipse at center, ${project.bgGlow.replace("0.07", "0.15")} 0%, rgba(8,13,46,0.9) 70%)`,
              borderRight: isEven ? `1px solid rgba(0,201,255,0.06)` : "none",
              borderLeft: !isEven ? `1px solid rgba(0,201,255,0.06)` : "none",
            }}
          >
            {/* Animated rings */}
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.06, 0.15] }}
                transition={{ duration: 4 + ring, repeat: Infinity, delay: ring * 0.8, ease: "easeInOut" }}
                className="absolute rounded-full border"
                style={{
                  width: 120 + ring * 90,
                  height: 120 + ring * 90,
                  borderColor: project.color + "30",
                }}
              />
            ))}

            {/* Central icon */}
            <div className="relative z-10 text-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex items-center justify-center w-28 h-28 rounded-3xl mb-6"
                style={{
                  background: `linear-gradient(135deg, ${project.color}20, ${project.colorAlt}15)`,
                  border: `2px solid ${project.color}30`,
                  boxShadow: `0 0 60px ${project.color}20`,
                }}
              >
                <span style={{ fontSize: 52 }}>{project.emoji}</span>
              </motion.div>

              <div
                className="text-4xl font-black tracking-[-0.04em] mb-2"
                style={{
                  fontFamily: "var(--font-display)",
                  background: `linear-gradient(135deg, ${project.color}, ${project.colorAlt})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {project.name}
              </div>
              <p className="text-[#8892b0] text-sm italic">{project.tagline}</p>
            </div>

            {/* Status badge */}
            <div className="absolute top-5 right-5">
              <span
                className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1.5 rounded-full"
                style={{
                  background: project.color + "15",
                  border: `1px solid ${project.color}35`,
                  color: project.color,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: project.color }}
                />
                {project.status}
              </span>
            </div>

            {/* Scripture watermark */}
            <div className="absolute bottom-5 left-0 right-0 text-center">
              <p className="text-[10px] italic opacity-30" style={{ color: project.color }}>
                {project.scripture}
              </p>
            </div>
          </div>

          {/* Content side */}
          <div className={`p-10 lg:p-12 flex flex-col justify-center ${!isEven ? "lg:col-start-1 lg:row-start-1" : ""}`}>
            {/* Label */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-full tracking-[0.1em] uppercase"
                style={{
                  background: project.color + "12",
                  border: `1px solid ${project.color}25`,
                  color: project.color,
                }}
              >
                {project.label}
              </span>
              <span className="flex items-center gap-1 text-[#8892b0] text-xs">
                <Layers size={12} />
                CCLabs Project
              </span>
            </div>

            {/* Name */}
            <h3
              className="text-white text-4xl font-black mb-3 tracking-tight"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
            >
              {project.name}
            </h3>
            <p
              className="font-semibold mb-6 italic"
              style={{
                background: `linear-gradient(135deg, ${project.color}, ${project.colorAlt})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: "clamp(15px, 1.8vw, 18px)",
              }}
            >
              {project.tagline}
            </p>

            {/* Description */}
            <p className="text-[#8892b0] text-[15px] leading-relaxed mb-6">
              {project.longDesc}
            </p>

            {/* Features */}
            <ul className="space-y-2.5 mb-8">
              {project.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: project.color + "20" }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: project.color }} />
                  </div>
                  <span className="text-[#e8eeff] text-sm">{f}</span>
                </li>
              ))}
            </ul>

            {/* Scripture */}
            <div
              className="p-4 rounded-2xl mb-8 relative overflow-hidden"
              style={{ background: project.color + "08", border: `1px solid ${project.color}18` }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-full"
                style={{ background: `linear-gradient(to bottom, ${project.color}, ${project.colorAlt})` }}
              />
              <p className="text-[#8892b0] text-xs italic leading-relaxed pl-3">
                &ldquo;{project.scriptureText}&rdquo;
              </p>
              <p className="text-xs font-bold pl-3 mt-1" style={{ color: project.color }}>
                — {project.scripture}
              </p>
            </div>

            {/* CTA */}
            <motion.a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                scale: 1.03,
                boxShadow: `0 0 40px ${project.color}35`,
              }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-3 font-bold text-sm py-4 px-8 rounded-2xl transition-all duration-200 self-start"
              style={{
                background: `linear-gradient(135deg, ${project.color}, ${project.colorAlt})`,
                color: "#080d2e",
              }}
            >
              <ExternalLink size={16} />
              Visit Prototype
              <ArrowUpRight size={15} />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsPage() {
  return (
    <main className="bg-[#080d2e] overflow-hidden">
      {/* ── HEADER ── */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GradientOrb className="top-[-15%] left-[-5%]" size={700} color="cyan" />
        <GradientOrb className="top-[10%] right-[-5%]" size={500} color="mint" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FadeUp>
            <SectionLabel>CCLabs Projects</SectionLabel>
            <h1
              className="font-display text-white leading-[1.02] mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 7vw, 82px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Building for the{" "}
              <span className="grad-text">Kingdom</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p
              className="text-[#8892b0] leading-relaxed max-w-2xl"
              style={{ fontSize: "clamp(16px, 2vw, 20px)" }}
            >
              Digital tools and platforms crafted at the intersection of faith and technology —
              born in our Christian Creatives Labs, built by Spirit-led innovators, and launched
              for eternal Kingdom impact.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── INTRO STRIP ── */}
      <section
        className="py-10 relative"
        style={{ borderTop: "1px solid rgba(0,201,255,0.08)", borderBottom: "1px solid rgba(0,201,255,0.08)", background: "rgba(17,24,80,0.3)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <StaggerParent className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: <Sparkles size={18} />, label: "Spirit-Led", desc: "Every project is prayed over before the first line of code" },
              { icon: <Layers size={18} />, label: "CCLabs Built", desc: "Developed inside our Christian Creatives Labs community" },
              { icon: <Globe2 size={18} />, label: "Kingdom Impact", desc: "Designed to advance the Great Commission globally" },
            ].map((item, i) => (
              <StaggerChild key={i}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[#00c9ff] mb-1"
                    style={{ background: "rgba(0,201,255,0.1)" }}
                  >
                    {item.icon}
                  </div>
                  <span
                    className="text-white text-sm font-bold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.label}
                  </span>
                  <span className="text-[#8892b0] text-xs leading-relaxed max-w-[200px]">{item.desc}</span>
                </div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </section>

      {/* ── PROJECT CARDS ── */}
      <section className="py-24 relative">
        <GradientOrb className="left-[-10%] top-[20%]" size={600} color="cyan" />
        <GradientOrb className="right-[-10%] top-[60%]" size={600} color="mint" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-16">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* ── MORE COMING SOON ── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ borderTop: "1px solid rgba(0,201,255,0.08)", background: "linear-gradient(135deg, #0d1340 0%, #080d2e 100%)" }}
      >
        <GradientOrb className="left-1/2 -translate-x-1/2 top-0" size={700} color="cyan" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <FadeUp>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8"
              style={{ background: "rgba(0,201,255,0.08)", border: "1px solid rgba(0,201,255,0.2)" }}
            >
              <span className="w-2 h-2 rounded-full grad-bg animate-pulse" />
              <span className="text-[#00c9ff] text-xs font-bold tracking-widest uppercase">
                More in the Lab
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
              More Projects Are Being{" "}
              <span className="grad-text">Built Right Now</span>
            </h2>
            <p className="text-[#8892b0] text-lg max-w-lg mx-auto mb-12 leading-relaxed">
              Our Christian Creatives Labs are always working. More faith-based tech products
              are in development — built by Spirit-led innovators from our community.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/what-we-do">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(0,201,255,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  className="grad-bg text-[#080d2e] font-bold text-base px-8 py-4 rounded-full flex items-center gap-2"
                >
                  <Layers size={17} />
                  Learn About CCLabs
                </motion.button>
              </Link>
              <Link href="/join">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="font-bold text-sm px-8 py-4 rounded-full transition-all"
                  style={{ border: "1.5px solid #00c9ff", color: "#00c9ff" }}
                >
                  Build With Us
                </motion.button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
