"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Heart, Rocket, Users2, Zap, Package, Clock } from "lucide-react";
import { SectionLabel, FadeUp, StaggerParent, StaggerChild, GradientOrb } from "@/components/ui";

const MENTOR_FORM_URL = "https://forms.gle/XPf3hbKNxS5y8LEL8";

export default function BecomeMentorPage() {
  const whoWeWant = [
    { icon: <Heart size={20} />, title: "Spirit-filled Believers", desc: "You have a genuine relationship with Jesus Christ and depend on the Holy Spirit in your work and life." },
    { icon: <Rocket size={20} />, title: "Creatives & Entrepreneurs", desc: "You build things — products, software, designs, systems, media, content, or businesses." },
    { icon: <Package size={20} />, title: "Product Builders", desc: "You have created a product, service, or project that exists in the world (paid or free, side or full-time)." },
    { icon: <Users2 size={20} />, title: "Passionate About Youths", desc: "You genuinely want to see the next generation succeed — willing to invest time, wisdom, and prayer into a young person." },
    { icon: <Clock size={20} />, title: "Available", desc: "You can commit 1–2 hours bi-weekly for 6 weeks." },
  ];

  const whatYouDo = [
    { step: "Apply", desc: "Fill out a simple application form." },
    { step: "Match", desc: "We pair you with a small group of young creatives." },
    { step: "Weekly Emails", desc: "Your mentees receive a weekly lesson via email. You review their answers before your session." },
    { step: "Bi-weekly Session", desc: "Meet virtually with assigned mentees bi-weekly for 6 weeks (3 sessions total)." },
    { step: "Review & Guide", desc: "Discuss their lessons, share your wisdom, ask questions, and pray." },
    { step: "Launch", desc: "Help your mentee identify and build their Kingdom project." },
    { step: "Verify", desc: "After 6 weeks, you become a Verified Ahren Mentor." },
  ];

  const responsibilities = [
    { task: "Attend a 15 mins virtual onboarding meeting with Ahren Foundation leaders", time: "Once (before matching)" },
    { task: "Review your mentee's weekly email lesson responses", time: "10–15 minutes/week" },
    { task: "Meet with your mentees virtually bi-weekly", time: "60–90 minutes/session (3 total)" },
    { task: "Pray for your mentees", time: "10 minutes/week (optional)" },
    { task: "Respond to messages within 48 hours", time: "As needed" },
    { task: "Complete a brief feedback form after each session", time: "Bi-weekly" },
  ];

  const gains = [
    { icon: <Sparkles size={20} />, title: "Verified Mentor Status", desc: "Recognition as an official Ahren mentor." },
    { icon: <Users2 size={20} />, title: "Community Access", desc: "Login to our online platform to connect with other mentors." },
    { icon: <Package size={20} />, title: "Resource Library", desc: "Access to toolkits, training, and other resources." },
    { icon: <Zap size={20} />, title: "Opportunities", desc: "Organize paid trainings or masterclasses. Network, collaborate & partner with other Creative Mentors & Mentees." },
    { icon: <Rocket size={20} />, title: "Events", desc: "Invitations to speak or partner in our Believers in Tech Meet-ups, Seminars, and Annual Conference." },
    { icon: <Heart size={20} />, title: "Kingdom Impact", desc: "The joy of investing in the next generation." },
  ];

  return (
    <main className="bg-[#080d2e] overflow-hidden">
      {/* HERO */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GradientOrb className="top-[-15%] left-[-5%]" size={700} color="cyan" />
        <GradientOrb className="top-[10%] right-[-5%]" size={500} color="mint" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FadeUp>
            <SectionLabel>Become a Mentor</SectionLabel>
            <h1
              className="font-display text-white leading-[1.02] mb-6 text-balance"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px, 6.5vw, 76px)", fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              Your Skills &amp; Gifts Could{" "}
              <span className="grad-text">Shape a Generation</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-[#8892b0] leading-relaxed max-w-2xl mb-8" style={{ fontSize: "clamp(16px, 2vw, 20px)" }}>
              Mentor young Christian creatives. Your skills. Their future. Kingdom impact.
            </p>
            <motion.a
              href={MENTOR_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(0,201,255,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="grad-bg text-[#080d2e] font-bold text-base px-10 py-4 rounded-full inline-flex items-center gap-2"
            >
              Apply to Mentor <ArrowRight size={17} />
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* WHY MENTOR */}
      <section className="py-20 relative" style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <FadeUp>
            <SectionLabel>Why Mentor With Us?</SectionLabel>
            <h2
              className="font-display text-white mb-6"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Why Mentor with Ahren Foundation?
            </h2>
            <div className="space-y-4 text-[#8892b0] text-base leading-relaxed">
              <p>
                Ahren Foundation is a development platform for youths, where Christian creatives find
                purpose, community, and opportunity. We are building a global network of believers in
                tech who create value, serve their generation, and advance the Kingdom of God.
              </p>
              <p>
                We believe the next generation of Christian creatives needs mentors — people like you
                who have walked the path, built the skills, and know the challenges. Your experience,
                wisdom, and faith can shape a young person&apos;s life for eternity.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* WHO WE'RE LOOKING FOR */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d1340 0%, #080d2e 100%)", borderTop: "1px solid rgba(0,201,255,0.08)" }}
      >
        <GradientOrb className="right-[-10%] top-1/3" size={500} color="mint" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <FadeUp className="text-center mb-12">
            <div className="flex justify-center"><SectionLabel>Who We Want</SectionLabel></div>
            <h2 className="font-display text-white" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Who We Are Looking For
            </h2>
          </FadeUp>
          <StaggerParent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whoWeWant.map((item, i) => (
              <StaggerChild key={i}>
                <motion.div whileHover={{ y: -6 }} className="card p-7 h-full" style={{ borderRadius: 20 }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-[#00c9ff]" style={{ background: "rgba(0,201,255,0.12)" }}>
                    {item.icon}
                  </div>
                  <h3 className="text-white font-bold text-base mb-2" style={{ fontFamily: "var(--font-display)" }}>{item.title}</h3>
                  <p className="text-[#8892b0] text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </section>

      {/* WHAT YOU'LL DO */}
      <section className="py-20 relative" style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}>
        <GradientOrb className="left-[-5%] top-1/4" size={500} color="cyan" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <FadeUp className="mb-10">
            <SectionLabel>The Process</SectionLabel>
            <h2 className="font-display text-white mb-4" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
              What You Will Do as a Mentor
            </h2>
            <p className="text-[#8892b0] text-base leading-relaxed">
              You are not expected to be a technical teacher or a career coach. The weekly lessons do the
              heavy lifting. You are an encourager, a question-asker, a storyteller, and a prayer partner.
            </p>
          </FadeUp>
          <StaggerParent className="space-y-3">
            {whatYouDo.map((item, i) => (
              <StaggerChild key={i}>
                <motion.div
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-5 p-5 rounded-2xl transition-all duration-300"
                  style={{ background: "#111850", border: "1px solid rgba(0,201,255,0.08)" }}
                >
                  <div className="w-9 h-9 rounded-full grad-bg flex items-center justify-center flex-shrink-0 text-[#080d2e] font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <span className="text-white font-bold text-sm mr-2" style={{ fontFamily: "var(--font-display)" }}>{item.step}</span>
                    <span className="text-[#8892b0] text-sm">— {item.desc}</span>
                  </div>
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </section>

      {/* RESPONSIBILITIES */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d1340 0%, #080d2e 100%)", borderTop: "1px solid rgba(0,201,255,0.08)" }}
      >
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <FadeUp className="text-center mb-10">
            <div className="flex justify-center"><SectionLabel>Your Commitment</SectionLabel></div>
            <h2 className="font-display text-white" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Your Commitment
            </h2>
          </FadeUp>
          <StaggerParent className="space-y-3">
            {responsibilities.map((item, i) => (
              <StaggerChild key={i}>
                <div className="flex items-center justify-between gap-4 p-5 rounded-xl" style={{ background: "#111850", border: "1px solid rgba(0,201,255,0.08)" }}>
                  <div className="flex items-start gap-3">
                    <Check size={16} className="text-[#00ff9d] flex-shrink-0 mt-0.5" />
                    <span className="text-[#e8eeff] text-sm">{item.task}</span>
                  </div>
                  <span className="text-[#8892b0] text-xs whitespace-nowrap flex-shrink-0 hidden sm:block">{item.time}</span>
                </div>
              </StaggerChild>
            ))}
          </StaggerParent>
          <FadeUp className="text-center mt-8">
            <div className="inline-block px-6 py-3 rounded-full" style={{ background: "rgba(0,201,255,0.08)", border: "1px solid rgba(0,201,255,0.2)" }}>
              <span className="text-[#8892b0] text-sm">Total Commitment: </span>
              <span className="grad-text font-bold text-sm">~1–2 hours bi-weekly (6-week duration)</span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* WHAT YOU GAIN */}
      <section className="py-20 relative" style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}>
        <GradientOrb className="right-[-5%] top-1/3" size={500} color="mint" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <FadeUp className="text-center mb-12">
            <div className="flex justify-center"><SectionLabel>The Rewards</SectionLabel></div>
            <h2 className="font-display text-white" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
              What You Gain as a Mentor
            </h2>
          </FadeUp>
          <StaggerParent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {gains.map((item, i) => (
              <StaggerChild key={i}>
                <motion.div whileHover={{ y: -6 }} className="card p-7 h-full" style={{ borderRadius: 20, borderTop: "3px solid #00ff9d" }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-[#00ff9d]" style={{ background: "rgba(0,255,157,0.12)" }}>
                    {item.icon}
                  </div>
                  <h3 className="text-white font-bold text-base mb-2" style={{ fontFamily: "var(--font-display)" }}>{item.title}</h3>
                  <p className="text-[#8892b0] text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d1340 0%, #080d2e 100%)", borderTop: "1px solid rgba(0,201,255,0.08)" }}
      >
        <GradientOrb className="left-1/2 -translate-x-1/2 top-0" size={700} color="cyan" />
        <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
          <FadeUp>
            <div className="p-6 rounded-2xl mb-8 inline-block" style={{ background: "rgba(0,255,157,0.05)", border: "1px solid rgba(0,255,157,0.15)" }}>
              <p className="text-[#e8eeff] text-base md:text-lg italic leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                &ldquo;The harvest is plentiful, but the laborers are few.&rdquo;
              </p>
              <p className="grad-text text-sm font-bold mt-2">— Matthew 9:37</p>
            </div>
            <h2 className="font-display text-white mb-6" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 50px)", fontWeight: 800, letterSpacing: "-0.025em" }}>
              Ready to Shape a <span className="grad-text">Generation?</span>
            </h2>
            <motion.a
              href={MENTOR_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(0,201,255,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="grad-bg text-[#080d2e] font-bold text-base px-12 py-4 rounded-full inline-flex items-center gap-2"
            >
              Apply to Mentor <ArrowRight size={17} />
            </motion.a>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
