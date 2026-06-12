"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Check, ArrowRight, Sparkles } from "lucide-react";
import { SectionLabel, FadeUp, StaggerParent, StaggerChild, GradientOrb } from "@/components/ui";
import { EXPERTISE_OPTIONS } from "@/lib/data";

const inputCls =
  "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(0,201,255,0.12)] rounded-xl px-4 py-3 text-white text-sm placeholder-[#8892b0] focus:border-[#00c9ff] focus:bg-[rgba(0,201,255,0.04)] transition-all duration-200 outline-none";
const textareaCls =
  "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(0,201,255,0.12)] rounded-xl px-4 py-3 text-white text-sm placeholder-[#8892b0] focus:border-[#00c9ff] focus:bg-[rgba(0,201,255,0.04)] transition-all duration-200 outline-none resize-none";

function FieldGroup({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-[#e8eeff] text-[13px] font-semibold mb-2">
        {label}
        {required && <span className="text-[#00c9ff] ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function CheckboxOption({ label, name }: { label: string; name: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input type="checkbox" name={name} className="w-4 h-4 rounded accent-[#00c9ff] cursor-pointer" />
      <span className="text-[#8892b0] text-sm group-hover:text-[#e8eeff] transition-colors">{label}</span>
    </label>
  );
}

function OtherOption({ name, placeholder = "Please specify your area..." }: { name: string; placeholder?: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="sm:col-span-2 mt-2 space-y-2">
      <label className="flex items-center gap-2.5 cursor-pointer group">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="w-4 h-4 rounded accent-[#00c9ff] cursor-pointer"
        />
        <span className="text-[#8892b0] text-sm group-hover:text-[#e8eeff] transition-colors">Other</span>
      </label>
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <input className={inputCls} placeholder={placeholder} autoFocus />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RadioOption({ label, name }: { label: string; name: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input type="radio" name={name} className="w-4 h-4 accent-[#00c9ff] cursor-pointer" />
      <span className="text-[#8892b0] text-sm group-hover:text-[#e8eeff] transition-colors">{label}</span>
    </label>
  );
}

const FAITH_QUESTIONS = [
  "Are you Born-Again?",
  "Have you received the Baptism of the Holy Spirit with the evidence of speaking in tongues?",
  "Do you believe in depending on the Holy Spirit and collaborating with Him to improve and utilize your skills and creativity?",
];

function SuccessScreen({ onBack }: { onBack: () => void }) {
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
      <h2 className="text-white text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
        Welcome to Ahren Foundation!
      </h2>
      <p className="text-[#8892b0] text-base leading-relaxed max-w-lg mx-auto mb-4">
        Your application has been received. We are excited to walk with you as you learn to use your
        talents, tech skills and creativity for God&apos;s glory. A team member will reach out within
        5–7 business days to schedule a virtual chat. Keep an eye on your email and phone.
      </p>
      <p className="grad-text text-sm font-bold mb-10">— Ahren Foundation Team</p>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onBack}
        className="text-[#8892b0] text-sm font-semibold px-6 py-3 rounded-full transition-colors hover:text-white"
        style={{ border: "1px solid rgba(0,201,255,0.15)" }}
      >
        ← Back
      </motion.button>
    </motion.div>
  );
}

function ApplicationForm({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div>
      <h3 className="grad-text text-lg font-bold mb-8" style={{ fontFamily: "var(--font-display)" }}>
        Creative Youth Application
      </h3>

      {/* Personal */}
      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00c9ff] mb-5">Personal Information</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldGroup label="Full Name" required><input className={inputCls} placeholder="Your full name" /></FieldGroup>
          <FieldGroup label="Email Address" required><input className={inputCls} type="email" placeholder="your@email.com" /></FieldGroup>
          <FieldGroup label="Phone Number" required><input className={inputCls} placeholder="+234..." /></FieldGroup>
          <FieldGroup label="Age Range" required>
            <select className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(0,201,255,0.12)] rounded-xl px-4 py-3 text-[#8892b0] text-sm focus:border-[#00c9ff] transition-all duration-200 outline-none appearance-none cursor-pointer">
              <option value="">Select age range</option>
              {["16-18", "19-22", "23-26", "27-30"].map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </FieldGroup>
        </div>
        <FieldGroup label="Country / State" required><input className={inputCls} placeholder="e.g. Lagos, Nigeria" /></FieldGroup>
      </div>

      {/* Skills */}
      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00c9ff] mb-5">Skills &amp; Interests</div>
        <FieldGroup label="Current Skills / Area(s) of Interest" required>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 rounded-xl" style={{ background: "rgba(0,201,255,0.04)", border: "1px solid rgba(0,201,255,0.1)" }}>
            {EXPERTISE_OPTIONS.map((opt) => <CheckboxOption key={opt} label={opt} name={`skill-${opt}`} />)}
            <OtherOption name="skill-other" placeholder="e.g. Game Development, 3D Modelling..." />
          </div>
        </FieldGroup>
        <FieldGroup label="What skills do you want to learn or improve?" required>
          <textarea className={textareaCls} rows={3} placeholder="Tell us what you'd like to grow in..." />
        </FieldGroup>
      </div>

      {/* Motivation */}
      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00c9ff] mb-5">Motivation</div>
        <FieldGroup label="Why do you want to join the Ahren Foundation Youth Mentorship Program?" required>
          <textarea className={textareaCls} rows={4} placeholder="Share your heart..." />
        </FieldGroup>
        <FieldGroup label="Do you have a creative product/platform idea you'd like to build? (Optional)">
          <textarea className={textareaCls} rows={3} placeholder="Tell us about it..." />
        </FieldGroup>
        <FieldGroup label="Preferred Participation Format" required>
          <div className="flex flex-wrap gap-5 p-4 rounded-xl" style={{ background: "rgba(0,201,255,0.04)", border: "1px solid rgba(0,201,255,0.1)" }}>
            {["Virtual (online only)", "Physical centre (if available)", "Both virtual and physical"].map((f) => <CheckboxOption key={f} label={f} name={`format-${f}`} />)}
          </div>
        </FieldGroup>
      </div>

      {/* Faith */}
      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00ff9d] mb-5">Faith Background</div>
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
            I commit to the 9-week program — weekly lessons, mentor meetings, building a Kingdom creative product,
            80–100% attendance, and stewarding my skills for God&apos;s glory.
          </span>
        </label>
      </div>

      <motion.button
        whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(0,201,255,0.35)" }}
        whileTap={{ scale: 0.97 }}
        onClick={onSubmit}
        className="w-full grad-bg text-[#080d2e] font-bold text-base py-4 rounded-2xl"
      >
        Submit Application →
      </motion.button>
    </div>
  );
}

function ProgramInfo({ onApply }: { onApply: () => void }) {
  const whoWeWant = [
    "Curious, creative & tech-inclined Christian",
    "Purpose-driven",
    "Open to the Holy Spirit",
    "Open to networking & collaborating with likeminds",
    "Godly Character, Teachable and Reliable",
    "Age 16–30",
  ];
  const commit = [
    "Weekly Email lessons & mentor meeting (virtually)",
    "Build & launch a kingdom creative product/platform that positively impacts lives & reveals Jesus Christ",
    "Weekly workbook reflection",
    "80% – 100% attendance & participation",
    "Respond within 48 hours",
  ];
  const gain = [
    "A Spirit-filled experienced Creative mentor who believes in you",
    "Clarity on your Kingdom Creative Project",
    "Certificate of completion",
    "Path to Project funding, access to seasoned creative mentors, free & affordable high-impact trainings, a community of Believers in Tech, collaboration opportunities, incubation & lots more",
  ];

  return (
    <div>
      {/* Program banner */}
      <div
        className="rounded-3xl p-8 md:p-10 mb-8 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(0,201,255,0.08) 0%, rgba(0,255,157,0.05) 100%)", border: "1px solid rgba(0,201,255,0.2)" }}
      >
        <div className="absolute right-[-50px] top-[-50px] w-56 h-56 rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,255,157,0.1), transparent 70%)" }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4" style={{ background: "rgba(0,201,255,0.1)", border: "1px solid rgba(0,201,255,0.2)" }}>
            <Sparkles size={12} className="text-[#00c9ff]" />
            <span className="text-[#00c9ff] text-[11px] font-bold tracking-widest uppercase">9-Week Program</span>
          </div>
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-3 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Ahren Foundation 9-Week Youth Mentorship Program
          </h2>
          <p className="text-[#8892b0] text-base leading-relaxed">
            On Creativity, Tech Skills &amp; God&apos;s Purpose — a guided journey to discover, sharpen, and
            consecrate your gifts to build a Kingdom product that reveals Jesus Christ.
          </p>
        </div>
      </div>

      {/* Three columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[
          { title: "Who We Want", items: whoWeWant, color: "#00c9ff" },
          { title: "What You Commit To (9 Weeks)", items: commit, color: "#00ff9d" },
          { title: "What You Gain", items: gain, color: "#00c9ff" },
        ].map((col, i) => (
          <div key={i} className="card p-7" style={{ borderRadius: 20, borderTop: `3px solid ${col.color}` }}>
            <h3 className="text-white font-bold text-base mb-5" style={{ fontFamily: "var(--font-display)" }}>{col.title}</h3>
            <ul className="space-y-3">
              {col.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: col.color + "20" }}>
                    <Check size={10} style={{ color: col.color }} />
                  </span>
                  <span className="text-[#8892b0] text-[13px] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Not sure */}
      <div className="rounded-2xl p-6 mb-8 text-center" style={{ background: "rgba(0,255,157,0.05)", border: "1px solid rgba(0,255,157,0.15)" }}>
        <h4 className="text-white font-bold text-base mb-2" style={{ fontFamily: "var(--font-display)" }}>Not sure if you fit?</h4>
        <p className="text-[#8892b0] text-sm leading-relaxed max-w-xl mx-auto">
          Apply anyway. We will help you discover how your creativity, gifts &amp; skills are valuable to
          God&apos;s purpose on earth.
        </p>
      </div>

      {/* Apply button */}
      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(0,201,255,0.35)" }}
          whileTap={{ scale: 0.97 }}
          onClick={onApply}
          className="grad-bg text-[#080d2e] font-bold text-base px-12 py-4 rounded-full inline-flex items-center gap-2"
        >
          Apply Now <ArrowRight size={17} />
        </motion.button>
      </div>
    </div>
  );
}

export default function JoinPage() {
  const [showForm, setShowForm] = useState(false);
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
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              Join Ahren Foundation
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-[#8892b0] leading-relaxed max-w-2xl" style={{ fontSize: "clamp(16px, 2vw, 19px)" }}>
              Are you a curious, creative, tech-inclined young believer ready to align your gifts with
              God&apos;s purpose? Our 9-Week Youth Mentorship Program was built for you.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Content */}
      <section className="pb-28 relative" style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}>
        <div className="max-w-4xl mx-auto px-6 pt-12">
          <FadeUp>
            <div className="card p-8 md:p-10" style={{ borderRadius: 28 }}>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <SuccessScreen onBack={() => { setSubmitted(false); setShowForm(false); }} />
                  </motion.div>
                ) : showForm ? (
                  <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-[#8892b0] text-sm font-semibold mb-6 hover:text-[#00c9ff] transition-colors"
                    >
                      ← Back to program details
                    </button>
                    <ApplicationForm onSubmit={() => setSubmitted(true)} />
                  </motion.div>
                ) : (
                  <motion.div key="info" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                    <ProgramInfo onApply={() => setShowForm(true)} />
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
