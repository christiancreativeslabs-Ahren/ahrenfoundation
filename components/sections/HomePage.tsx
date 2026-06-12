"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Users, Zap, Globe2 } from "lucide-react";
import { SectionLabel, GlowButton, FadeUp, StaggerParent, StaggerChild, GradientOrb } from "@/components/ui";
import { STATS, WHAT_WE_DO, BLOGS } from "@/lib/data";
import MarqueeTicker from "@/components/MarqueeTicker";
import ScripturesSection from "@/components/ScripturesSection";
import TechShowcase from "@/components/TechShowcase";

function FloatingParticle({ delay = 0, size = 3, top = "20%", left = "10%" }) {
  return (
    <motion.div
      animate={{ y: [0, -24, 0], opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay, ease: "easeInOut" }}
      className="absolute rounded-full grad-bg pointer-events-none"
      style={{ width: size, height: size, top, left }}
    />
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <main className="bg-[#080d2e] overflow-hidden">
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background layers */}
        <div className="absolute inset-0 grid-bg opacity-60" />

        {/* Glowing orbs */}
        <GradientOrb className="top-[-10%] left-[-10%]" size={700} color="cyan" />
        <GradientOrb className="bottom-[-10%] right-[-10%]" size={600} color="mint" />
        <GradientOrb className="top-[30%] left-[40%]" size={400} color="cyan" />

        {/* Radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, #080d2e 100%)" }}
        />

        {/* Floating particles */}
        {[
          { delay: 0, size: 4, top: "15%", left: "12%" },
          { delay: 1, size: 3, top: "70%", left: "8%" },
          { delay: 2, size: 5, top: "25%", left: "85%" },
          { delay: 0.5, size: 3, top: "80%", left: "78%" },
          { delay: 1.5, size: 4, top: "45%", left: "5%" },
          { delay: 3, size: 3, top: "60%", left: "92%" },
        ].map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}

        {/* Hero content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center max-w-5xl mx-auto px-6 pt-24"
        >
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-balance leading-[1.02] mb-6"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(46px, 7.5vw, 88px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            <span className="text-white">Tech, </span>
            <span className="grad-text">Creativity</span>
            <br />
            <span className="text-white">&amp; </span>
            <span
              className="grad-text relative inline-block"
              style={{
                textShadow: "0 0 80px rgba(0,201,255,0.3)",
              }}
            >
              Purpose
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="text-[#8892b0] max-w-2xl mx-auto leading-relaxed mb-12 text-balance"
            style={{ fontSize: "clamp(16px, 2vw, 20px)" }}
          >
            Partnering with the Holy Spirit to create value that impacts lives and reveals
            Jesus Christ — from mission fields to marketplaces, from code to creativity,
            building a global network of believers in tech.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap gap-4 justify-center mb-20"
          >
            <Link href="/join">
              <GlowButton>
                Join the Community <ArrowRight size={16} />
              </GlowButton>
            </Link>
            <Link href="/what-we-do">
              <GlowButton outline>
                Discover What We Do
              </GlowButton>
            </Link>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[#8892b0] text-[10px] tracking-[0.2em] uppercase">Scroll</span>
            <div
              className="w-px h-12"
              style={{ background: "linear-gradient(to bottom, #00c9ff, transparent)" }}
            />
          </motion.div>
        </motion.div>

        {/* Decorative horizontal line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(0,201,255,0.3), transparent)" }}
        />
      </section>

      {/* ── MARQUEE TICKER ── */}
      <MarqueeTicker />

      {/* ── STATS ── */}
      <section
        className="py-16 relative"
        style={{ borderBottom: "1px solid rgba(0,201,255,0.08)", background: "rgba(13,19,64,0.4)" }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <StaggerParent className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <StaggerChild key={s.label}>
                <div
                  className="text-5xl md:text-6xl font-bold grad-text leading-none mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.value}
                </div>
                <div className="text-[#8892b0] text-sm font-medium">{s.label}</div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </section>

      {/* ── WHAT WE DO ── */}
      <section className="py-28 relative">
        <GradientOrb className="top-1/2 right-[-5%]" size={500} color="mint" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeUp className="text-center mb-16">
            <SectionLabel>Our Initiatives</SectionLabel>
            <h2
              className="font-display text-white leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(30px, 4.5vw, 52px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              What We Do
            </h2>
            <p className="text-[#8892b0] mt-4 max-w-lg mx-auto text-base leading-relaxed">
              Four focused initiatives, all designed to align tech skills and creativity with God&apos;s eternal purpose.
            </p>
          </FadeUp>

          <StaggerParent className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {WHAT_WE_DO.map((item, i) => (
              <StaggerChild key={i}>
                <motion.div
                  whileHover={{ y: -6, borderColor: item.color + "44" }}
                  className="card p-8 h-full flex flex-col transition-all duration-300 group cursor-default"
                  style={{ borderRadius: 24 }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 flex-shrink-0"
                    style={{ background: item.color + "15", border: `1px solid ${item.color}25` }}
                  >
                    {item.icon}
                  </div>
                  <h3
                    className="text-white font-bold text-lg mb-3 leading-snug group-hover:grad-text transition-all"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[#8892b0] text-sm leading-relaxed flex-1">{item.desc}</p>
                  <div
                    className="mt-6 text-xs font-bold tracking-widest uppercase"
                    style={{ color: item.color }}
                  >
                    {item.shortTitle} →
                  </div>
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>

          <FadeUp className="text-center mt-12">
            <Link href="/what-we-do">
              <GlowButton outline>See All Programs</GlowButton>
            </Link>
          </FadeUp>
        </div>
      </section>


      {/* ── PROJECTS ANNOUNCEMENT ── */}
      <section
        className="py-14 relative"
        style={{ borderTop: "1px solid rgba(0,201,255,0.08)", background: "rgba(13,19,64,0.35)" }}
      >
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FadeUp>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative overflow-hidden rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center gap-8"
              style={{
                background: "linear-gradient(135deg, rgba(0,201,255,0.06) 0%, rgba(0,255,157,0.04) 100%)",
                border: "1px solid rgba(0,201,255,0.2)",
              }}
            >
              {/* Glow blob */}
              <div
                className="absolute right-[-60px] top-[-60px] w-64 h-64 rounded-full blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(0,255,157,0.1), transparent 70%)" }}
              />
              {/* Pulsing icon */}
              <div
                className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-2xl relative"
                style={{ background: "rgba(0,201,255,0.08)", border: "1px solid rgba(0,201,255,0.2)" }}
              >
                <span style={{ fontSize: 38 }}>🛠️</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full grad-bg animate-pulse" />
              </div>
              {/* Text */}
              <div className="flex-1 text-center md:text-left">
                <div className="text-[10px] font-bold tracking-[0.18em] uppercase grad-text mb-2">
                  CCLabs — Live Now
                </div>
                <h3
                  className="text-white text-2xl md:text-3xl font-bold mb-3"
                  style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
                >
                  We&apos;re Building for the Kingdom
                </h3>
                <p className="text-[#8892b0] text-base leading-relaxed max-w-xl">
                  Our Christian Creatives Labs have launched their first faith-based tech projects.
                  Discover the digital tools we&apos;re crafting to advance the Great Commission.
                </p>
              </div>
              {/* CTA */}
              <Link href="/projects" className="flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 36px rgba(0,201,255,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  className="grad-bg text-[#080d2e] font-bold text-sm px-8 py-4 rounded-full flex items-center gap-2 whitespace-nowrap"
                >
                  See Our Projects <ArrowRight size={16} />
                </motion.button>
              </Link>
            </motion.div>
          </FadeUp>
        </div>
      </section>

      {/* ── VISION STATEMENT ── */}
      <section
        className="py-28 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d1340 0%, #080d2e 100%)", borderTop: "1px solid rgba(0,201,255,0.08)", borderBottom: "1px solid rgba(0,201,255,0.08)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(0,201,255,0.06) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <GradientOrb className="left-[-5%] top-[-20%]" size={500} color="cyan" />
        <GradientOrb className="right-[-5%] bottom-[-20%]" size={500} color="mint" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <FadeUp>
            <div
              className="text-8xl leading-none mb-8 grad-text"
              style={{ fontFamily: "var(--font-display)", opacity: 0.3 }}
            >
              &ldquo;
            </div>
            <p
              className="text-white leading-relaxed mb-8 text-balance"
              style={{
                fontSize: "clamp(20px, 2.8vw, 32px)",
                fontWeight: 600,
                fontStyle: "italic",
                fontFamily: "var(--font-display)",
              }}
            >
              We envision a generation where young believers align their use of tech skills,
              tools and creativity with God&apos;s purpose — partnering with the Holy Spirit
              to create value that impacts lives and reveals Jesus Christ to the world.
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-px grad-bg" />
              <span className="grad-text text-sm font-bold tracking-widest uppercase">
                Ahren Foundation Vision
              </span>
              <div className="w-12 h-px grad-bg" />
            </div>
          </FadeUp>
        </div>
      </section>

      <ScripturesSection />

      {/* ── WHY AHREN ── */}
      <section className="py-28 relative">
        <GradientOrb className="top-0 left-1/4" size={500} color="cyan" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <SectionLabel>Our Anchor</SectionLabel>
              <h2
                className="font-display text-white leading-tight mb-6"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px, 4vw, 48px)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                The Holy Spirit is Our{" "}
                <span className="grad-text">Creative Director</span>
              </h2>
              <p className="text-[#8892b0] text-base leading-relaxed mb-6">
                We believe our best work happens not in our own strength, but in genuine
                dependence on the Holy Spirit. He is our ultimate Creative Director. We
                collaborate with Him to steward every skill, every spark of creativity, and
                every technology at our disposal.
              </p>
              <p className="text-[#8892b0] text-base leading-relaxed mb-10">
                From mission fields to marketplaces, from code to creativity — we are building
                a global network of believers who hone their gifts to create value and reach
                the world for Jesus Christ.
              </p>
              <Link href="/about">
                <GlowButton>
                  Our Full Story <ArrowRight size={16} />
                </GlowButton>
              </Link>
            </FadeUp>

            <StaggerParent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <Zap size={20} />, title: "Spirit-Led Innovation", desc: "Every project begins with dependence on the Holy Spirit, not just technical ability." },
                { icon: <Users size={20} />, title: "Global Community", desc: "A worldwide network of believers building together for Kingdom impact." },
                { icon: <Globe2 size={20} />, title: "Kingdom-First Mindset", desc: "Technology as a tool for mission, ministry, and revealing Jesus to the world." },
                { icon: <Sparkles size={20} />, title: "Free Access", desc: "Our workshops and programs are free — because the Kingdom is for everyone." },
              ].map((item, i) => (
                <StaggerChild key={i}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="card p-6 transition-all duration-300"
                    style={{ borderRadius: 18 }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-[#00c9ff]"
                      style={{ background: "rgba(0,201,255,0.1)" }}
                    >
                      {item.icon}
                    </div>
                    <h4 className="text-white font-bold text-sm mb-2" style={{ fontFamily: "var(--font-display)" }}>
                      {item.title}
                    </h4>
                    <p className="text-[#8892b0] text-xs leading-relaxed">{item.desc}</p>
                  </motion.div>
                </StaggerChild>
              ))}
            </StaggerParent>
          </div>
        </div>
      </section>

      <TechShowcase />

      {/* ── BLOG PREVIEW ── */}
      <section
        className="py-28 relative"
        style={{ background: "rgba(13,19,64,0.4)", borderTop: "1px solid rgba(0,201,255,0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14">
            <FadeUp>
              <SectionLabel>Stories & Insights</SectionLabel>
              <h2
                className="font-display text-white"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px, 4vw, 46px)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                From the Blog
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <Link href="/blog">
                <GlowButton outline>View All Posts</GlowButton>
              </Link>
            </FadeUp>
          </div>

          <StaggerParent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BLOGS.slice(0, 2).map((post) => (
              <StaggerChild key={post.id}>
                <Link href="/blog">
                  <motion.div
                    whileHover={{ y: -6, borderColor: "rgba(0,201,255,0.3)" }}
                    className="card p-8 cursor-pointer transition-all duration-300 h-full flex flex-col"
                    style={{ borderRadius: 24 }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{ background: "rgba(0,201,255,0.1)", border: "1px solid rgba(0,201,255,0.2)", color: "#00c9ff" }}
                      >
                        {post.tag}
                      </span>
                      <span className="text-[#8892b0] text-xs">{post.readTime}</span>
                    </div>
                    <h3
                      className="text-white font-bold text-xl leading-snug mb-3 flex-1"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {post.title}
                    </h3>
                    <p className="text-[#8892b0] text-sm leading-relaxed mb-6">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#8892b0] text-xs">{post.date} · {post.author}</span>
                      <span className="grad-text text-sm font-bold">Read →</span>
                    </div>
                  </motion.div>
                </Link>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 relative overflow-hidden">
        <GradientOrb className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={800} color="cyan" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <FadeUp>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8"
              style={{ background: "rgba(0,255,157,0.08)", border: "1px solid rgba(0,255,157,0.2)" }}
            >
              <span className="w-2 h-2 rounded-full bg-[#00ff9d]" />
              <span className="text-[#00ff9d] text-xs font-bold tracking-widest uppercase">Ready to Begin?</span>
            </div>
            <h2
              className="font-display text-white mb-6 text-balance"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 5vw, 60px)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
              }}
            >
              Ready to Build for{" "}
              <span className="grad-text">the Kingdom?</span>
            </h2>
            <p className="text-[#8892b0] text-lg max-w-lg mx-auto mb-12 leading-relaxed">
              Are you a creative, tech-inclined young believer ready to align your gifts with God&apos;s purpose? There&apos;s a place for you in this movement.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/join">
                <GlowButton>Apply as Creative Youth <ArrowRight size={16} /></GlowButton>
              </Link>
              <Link href="/citireach">
                <GlowButton outline>Join CitiReach</GlowButton>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
