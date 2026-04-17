"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { SectionLabel, FadeUp, GradientOrb } from "@/components/ui";
import { EXPERTISE_OPTIONS } from "@/lib/data";

const inputCls =
  "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(0,201,255,0.12)] rounded-xl px-4 py-3 text-white text-sm placeholder-[#8892b0] focus:border-[#00c9ff] focus:bg-[rgba(0,201,255,0.04)] transition-all duration-200 outline-none";

const selectCls =
  "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(0,201,255,0.12)] rounded-xl px-4 py-3 text-[#8892b0] text-sm focus:border-[#00c9ff] transition-all duration-200 outline-none appearance-none cursor-pointer";

const textareaCls =
  "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(0,201,255,0.12)] rounded-xl px-4 py-3 text-white text-sm placeholder-[#8892b0] focus:border-[#00c9ff] focus:bg-[rgba(0,201,255,0.04)] transition-all duration-200 outline-none resize-none";

function FormLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-[#e8eeff] text-[13px] font-semibold mb-2">
      {label}
      {required && <span className="text-[#00c9ff] ml-1">*</span>}
    </label>
  );
}

function FieldGroup({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <FormLabel label={label} required={required} />
      {children}
    </div>
  );
}

function CheckboxOption({ label, name }: { label: string; name: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        name={name}
        className="w-4 h-4 rounded accent-[#00c9ff] cursor-pointer"
      />
      <span className="text-[#8892b0] text-sm group-hover:text-[#e8eeff] transition-colors">
        {label}
      </span>
    </label>
  );
}

function RadioOption({ label, name }: { label: string; name: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="radio"
        name={name}
        className="w-4 h-4 accent-[#00c9ff] cursor-pointer"
      />
      <span className="text-[#8892b0] text-sm group-hover:text-[#e8eeff] transition-colors">
        {label}
      </span>
    </label>
  );
}

const FAITH_QUESTIONS = [
  "Are you Born-Again?",
  "Have you received the Baptism of the Holy Spirit with the evidence of speaking in tongues?",
  "Do you believe in depending on the Holy Spirit and collaborating with Him to improve and utilize your skills and creativity?",
];

function SuccessScreen({ type, onBack }: { type: "youth" | "mentor"; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-center py-20"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 grad-bg"
      >
        <CheckCircle2 size={36} className="text-[#080d2e]" />
      </motion.div>
      <h2
        className="text-white text-3xl font-bold mb-4"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {type === "mentor" ? "Application Submitted!" : "Welcome to Ahren Foundation!"}
      </h2>
      <p className="text-[#8892b0] text-base leading-relaxed max-w-lg mx-auto mb-4">
        {type === "mentor"
          ? "We have received your application. Our team will review it and contact you within 5–7 business days to schedule an executive one-on-one virtual meeting. We look forward to partnering with you to raise the next generation of Holy Spirit-led innovators."
          : "Your application has been received. We are excited to walk with you as you learn to use your talents, tech skills and creativity for God's glory. A team member will reach out within 5–7 business days to schedule a virtual chat. Keep an eye on your email and phone."}
      </p>
      <p className="grad-text text-sm font-bold mb-10">— Ahren Foundation Team</p>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onBack}
        className="text-[#8892b0] text-sm font-semibold px-6 py-3 rounded-full transition-colors hover:text-white"
        style={{ border: "1px solid rgba(0,201,255,0.15)" }}
      >
        ← Back to form
      </motion.button>
    </motion.div>
  );
}

function YouthForm({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div>
      <h3 className="grad-text text-lg font-bold mb-8" style={{ fontFamily: "var(--font-display)" }}>
        Apply as a Creative Youth
      </h3>

      {/* Personal */}
      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00c9ff] mb-5">
          Personal Information
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldGroup label="Full Name" required>
            <input className={inputCls} placeholder="Your full name" />
          </FieldGroup>
          <FieldGroup label="Email Address" required>
            <input className={inputCls} type="email" placeholder="your@email.com" />
          </FieldGroup>
          <FieldGroup label="Phone Number" required>
            <input className={inputCls} placeholder="+234..." />
          </FieldGroup>
          <FieldGroup label="Age Range" required>
            <select className={selectCls}>
              <option value="">Select age range</option>
              {["16-18", "19-22", "23-26", "27-30", "31-35"].map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </FieldGroup>
        </div>
        <FieldGroup label="Country / State" required>
          <input className={inputCls} placeholder="e.g. Lagos, Nigeria" />
        </FieldGroup>
      </div>

      {/* Skills */}
      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00c9ff] mb-5">
          Skills & Interests
        </div>
        <FieldGroup label="Current Skills / Area(s) of Interest" required>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 rounded-xl" style={{ background: "rgba(0,201,255,0.04)", border: "1px solid rgba(0,201,255,0.1)" }}>
            {EXPERTISE_OPTIONS.map((opt) => (
              <CheckboxOption key={opt} label={opt} name={`skill-${opt}`} />
            ))}
            <div className="sm:col-span-2 mt-2">
              <label className="flex items-center gap-2.5 cursor-pointer group mb-2">
                <input type="checkbox" name="skill-other" className="w-4 h-4 rounded accent-[#00c9ff] cursor-pointer" />
                <span className="text-[#8892b0] text-sm group-hover:text-[#e8eeff] transition-colors">Other</span>
              </label>
              <input
                className={inputCls}
                placeholder="Please specify..."
              />
            </div>
          </div>
        </FieldGroup>
        <FieldGroup label="What skills do you want to learn or improve?" required>
          <textarea className={textareaCls} rows={3} placeholder="Tell us what you'd like to grow in..." />
        </FieldGroup>
      </div>

      {/* Motivation */}
      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00c9ff] mb-5">
          Motivation
        </div>
        <FieldGroup label="Why do you want to join us at Ahren Foundation?" required>
          <textarea className={textareaCls} rows={4} placeholder="Share your heart..." />
        </FieldGroup>
        <FieldGroup label="Have you built any project before? (Optional)">
          <textarea className={textareaCls} rows={3} placeholder="Tell us about it..." />
        </FieldGroup>
        <FieldGroup label="Preferred Participation Format" required>
          <div className="flex flex-wrap gap-5 p-4 rounded-xl" style={{ background: "rgba(0,201,255,0.04)", border: "1px solid rgba(0,201,255,0.1)" }}>
            {["Virtual (online only)", "Physical centre (if available)", "Both virtual and physical"].map((f) => (
              <CheckboxOption key={f} label={f} name={`format-${f}`} />
            ))}
          </div>
        </FieldGroup>
      </div>

      {/* Faith */}
      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00ff9d] mb-5">
          Faith Background
        </div>
        {FAITH_QUESTIONS.map((q, i) => (
          <FieldGroup key={i} label={q} required>
            <div className="flex gap-8">
              <RadioOption label="Yes" name={`faith-q${i}`} />
              <RadioOption label="No" name={`faith-q${i}`} />
            </div>
          </FieldGroup>
        ))}
        <FieldGroup label="Brief Testimony — How has God been working in your life in the area of your skills, talents and creativity?" required>
          <textarea className={textareaCls} rows={5} placeholder="Share your testimony..." />
        </FieldGroup>
        <FieldGroup label="Church / Youth Fellowship (Optional)">
          <input className={inputCls} placeholder="Your church or ministry" />
        </FieldGroup>
      </div>

      {/* Consent */}
      <div className="mb-8 p-5 rounded-xl" style={{ background: "rgba(0,201,255,0.04)", border: "1px solid rgba(0,201,255,0.1)" }}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 mt-0.5 accent-[#00c9ff] cursor-pointer flex-shrink-0" />
          <span className="text-[#8892b0] text-sm leading-relaxed">
            I commit to stewarding my skills for God&apos;s glory and actively participating in the program.
          </span>
        </label>
      </div>

      <motion.button
        whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(0,201,255,0.35)" }}
        whileTap={{ scale: 0.97 }}
        onClick={onSubmit}
        className="w-full grad-bg text-[#080d2e] font-bold text-base py-4 rounded-2xl"
      >
        Apply as a Creative Youth →
      </motion.button>
    </div>
  );
}

function MentorForm({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div>
      <h3 className="grad-text text-lg font-bold mb-8" style={{ fontFamily: "var(--font-display)" }}>
        Become a Mentor
      </h3>

      {/* Personal */}
      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00c9ff] mb-5">
          Personal Information
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldGroup label="Full Name" required>
            <input className={inputCls} placeholder="Your full name" />
          </FieldGroup>
          <FieldGroup label="Email Address" required>
            <input className={inputCls} type="email" placeholder="your@email.com" />
          </FieldGroup>
          <FieldGroup label="Phone Number" required>
            <input className={inputCls} placeholder="+234..." />
          </FieldGroup>
          <FieldGroup label="Country / Continent" required>
            <input className={inputCls} placeholder="e.g. Nigeria / Africa" />
          </FieldGroup>
        </div>
      </div>

      {/* Professional */}
      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00c9ff] mb-5">
          Professional Information
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldGroup label="Profession / Industry" required>
            <input className={inputCls} placeholder="e.g. Software Engineering" />
          </FieldGroup>
          <FieldGroup label="Years of Experience" required>
            <input className={inputCls} type="number" placeholder="e.g. 5" />
          </FieldGroup>
        </div>
        <FieldGroup label="Area(s) of Expertise" required>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 rounded-xl" style={{ background: "rgba(0,201,255,0.04)", border: "1px solid rgba(0,201,255,0.1)" }}>
            {EXPERTISE_OPTIONS.filter((o) => o !== "Writing / Content Creation").map((opt) => (
              <CheckboxOption key={opt} label={opt} name={`exp-${opt}`} />
            ))}
            <div className="sm:col-span-2 mt-2">
              <label className="flex items-center gap-2.5 cursor-pointer group mb-2">
                <input type="checkbox" name="exp-other" className="w-4 h-4 rounded accent-[#00c9ff] cursor-pointer" />
                <span className="text-[#8892b0] text-sm group-hover:text-[#e8eeff] transition-colors">Other</span>
              </label>
              <input
                className={inputCls}
                placeholder="Please specify..."
              />
            </div>
          </div>
        </FieldGroup>
      </div>

      {/* Commitment */}
      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00c9ff] mb-5">
          Mentorship Commitment
        </div>
        <FieldGroup label="Why do you want to mentor young believers?" required>
          <textarea className={textareaCls} rows={4} placeholder="Share your heart for the next generation..." />
        </FieldGroup>
        <FieldGroup label="Available Commitment (hours/month)" required>
          <div className="flex flex-wrap gap-6 p-4 rounded-xl" style={{ background: "rgba(0,201,255,0.04)", border: "1px solid rgba(0,201,255,0.1)" }}>
            {["2-4 hours/month", "5-8 hours/month", "9+ hours/month"].map((c) => (
              <RadioOption key={c} label={c} name="commitment" />
            ))}
          </div>
        </FieldGroup>
        <FieldGroup label="Preferred Mentorship Format" required>
          <div className="flex flex-wrap gap-6 p-4 rounded-xl" style={{ background: "rgba(0,201,255,0.04)", border: "1px solid rgba(0,201,255,0.1)" }}>
            {["Virtual", "In-person", "Both"].map((f) => (
              <RadioOption key={f} label={f} name="format" />
            ))}
          </div>
        </FieldGroup>
      </div>

      {/* Faith */}
      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00ff9d] mb-5">
          Faith Background
        </div>
        {FAITH_QUESTIONS.map((q, i) => (
          <FieldGroup key={i} label={q} required>
            <div className="flex gap-8">
              <RadioOption label="Yes" name={`mentor-faith-q${i}`} />
              <RadioOption label="No" name={`mentor-faith-q${i}`} />
            </div>
          </FieldGroup>
        ))}
        <FieldGroup label="Brief Testimony — How has God been working through your skills?" required>
          <textarea className={textareaCls} rows={5} placeholder="Share your testimony..." />
        </FieldGroup>
        <FieldGroup label="Church / Ministry Affiliation (Optional)">
          <input className={inputCls} placeholder="Your church or ministry" />
        </FieldGroup>
      </div>

      {/* Consent */}
      <div className="mb-8 p-5 rounded-xl" style={{ background: "rgba(0,201,255,0.04)", border: "1px solid rgba(0,201,255,0.1)" }}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 mt-0.5 accent-[#00c9ff] cursor-pointer flex-shrink-0" />
          <span className="text-[#8892b0] text-sm leading-relaxed">
            I agree to the mentorship guidelines and commit to stewarding my time for God&apos;s glory.
          </span>
        </label>
      </div>

      <motion.button
        whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(0,201,255,0.35)" }}
        whileTap={{ scale: 0.97 }}
        onClick={onSubmit}
        className="w-full grad-bg text-[#080d2e] font-bold text-base py-4 rounded-2xl"
      >
        Submit Mentor Application →
      </motion.button>
    </div>
  );
}

export default function JoinPage() {
  const [tab, setTab] = useState<"youth" | "mentor">("youth");
  const [submitted, setSubmitted] = useState(false);

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
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 6vw, 72px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Join Ahren Foundation
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-[#8892b0] leading-relaxed max-w-2xl" style={{ fontSize: "clamp(16px, 2vw, 19px)" }}>
              Whether you&apos;re a creative youth ready to build for the Kingdom, or a seasoned
              professional ready to invest in the next generation — there&apos;s a place for you.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Form area */}
      <section
        className="pb-28 relative"
        style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}
      >
        <div className="max-w-3xl mx-auto px-6 pt-12">
          {/* Tab switcher */}
          <FadeUp className="mb-10">
            <div
              className="flex p-1 rounded-2xl w-full"
              style={{ background: "#111850", border: "1px solid rgba(0,201,255,0.1)" }}
            >
              {(["youth", "mentor"] as const).map((t) => (
                <motion.button
                  key={t}
                  onClick={() => { setTab(t); setSubmitted(false); }}
                  className="flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-300"
                  style={
                    tab === t
                      ? { background: "linear-gradient(135deg,#00c9ff,#00ff9d)", color: "#080d2e" }
                      : { color: "#8892b0" }
                  }
                >
                  {t === "youth" ? "🎯 Apply as Creative Youth" : "🤝 Become a Mentor"}
                </motion.button>
              ))}
            </div>
          </FadeUp>

          {/* Form card */}
          <FadeUp delay={0.1}>
            <div
              className="card p-10"
              style={{ borderRadius: 28 }}
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <SuccessScreen type={tab} onBack={() => setSubmitted(false)} />
                  </motion.div>
                ) : (
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, x: tab === "youth" ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {tab === "youth" ? (
                      <YouthForm onSubmit={() => setSubmitted(true)} />
                    ) : (
                      <MentorForm onSubmit={() => setSubmitted(true)} />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
