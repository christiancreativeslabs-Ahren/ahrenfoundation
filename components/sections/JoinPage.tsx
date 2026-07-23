"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { SectionLabel, FadeUp, GradientOrb } from "@/components/ui";
import { EXPERTISE_OPTIONS } from "@/lib/data";

const inputCls =
  "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(0,201,255,0.12)] rounded-xl px-4 py-3 text-white text-sm placeholder-[#8892b0] focus:border-[#00c9ff] focus:bg-[rgba(0,201,255,0.04)] transition-all duration-200 outline-none";
const selectCls =
  "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(0,201,255,0.12)] rounded-xl px-4 py-3 text-[#8892b0] text-sm focus:border-[#00c9ff] transition-all duration-200 outline-none appearance-none cursor-pointer";
const textareaCls =
  "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(0,201,255,0.12)] rounded-xl px-4 py-3 text-white text-sm placeholder-[#8892b0] focus:border-[#00c9ff] focus:bg-[rgba(0,201,255,0.04)] transition-all duration-200 outline-none resize-none";

function FieldGroup({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-[#e8eeff] text-[13px] font-semibold mb-1.5">
        {label}
        {required && <span className="text-[#00c9ff] ml-1">*</span>}
      </label>
      {hint && <p className="text-[#8892b0] text-xs mb-2 leading-relaxed">{hint}</p>}
      {children}
    </div>
  );
}

function CheckboxOption({ label, name }: { label: string; name: string }) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer group">
      <input type="checkbox" name={name} value={label} className="w-4 h-4 mt-0.5 rounded accent-[#00c9ff] cursor-pointer flex-shrink-0" />
      <span className="text-[#8892b0] text-sm group-hover:text-[#e8eeff] transition-colors leading-snug">{label}</span>
    </label>
  );
}

function RadioOption({ label, name }: { label: string; name: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input type="radio" name={name} value={label} className="w-4 h-4 accent-[#00c9ff] cursor-pointer flex-shrink-0" />
      <span className="text-[#8892b0] text-sm group-hover:text-[#e8eeff] transition-colors">{label}</span>
    </label>
  );
}

function OtherOption({ name }: { name: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="sm:col-span-2 mt-2 space-y-2">
      <label className="flex items-center gap-2.5 cursor-pointer group">
        <input type="checkbox" name={name} value="Other" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="w-4 h-4 rounded accent-[#00c9ff] cursor-pointer" />
        <span className="text-[#8892b0] text-sm group-hover:text-[#e8eeff] transition-colors">Other</span>
      </label>
      <AnimatePresence>
        {checked && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: "hidden" }}>
            <input className={inputCls} name={`${name}_text`} placeholder="Please specify..." autoFocus />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FAITH_QUESTIONS = [
  { q: "Are you born-again?", name: "born_again" },
  { q: "Have you received the baptism of the Holy Spirit with the evidence of speaking in tongues?", name: "holy_spirit_baptism" },
  { q: "Do you believe in depending on the Holy Spirit and collaborating with Him to improve and utilize your skills and creativity?", name: "holy_spirit_dependence" },
];

const SATURDAY_ACTIVITIES = [
  "AI & Tech Class (Week 1 – Saturday, September 5)",
  "Mentor Session 1 (Week 2 – Saturday, September 12)",
  "Branding Class (Week 3 – Saturday, September 19)",
  "Mentor Session 2 (Week 4 – Saturday, September 26)",
  "Digital Content Creation & Digital Marketing Class (Week 5 – Saturday, October 3)",
  "Mentor Session 3 (Week 6 – Saturday, October 10)",
  "I can attend most, but may miss one or two",
];

function SuccessScreen({ onBack }: { onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="text-center py-16">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }} className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 grad-bg">
        <CheckCircle2 size={36} className="text-[#080d2e]" />
      </motion.div>
      <h2 className="text-white text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Welcome to Ahren Foundation!</h2>
      <p className="text-[#8892b0] text-base leading-relaxed max-w-lg mx-auto mb-6">
        Thank you for applying! Our team will review your application within 5–7 business days.
        If shortlisted, we will contact you and send you a link to join our community.
        Keep an eye on your email and phone.
      </p>
      <div className="max-w-md mx-auto p-5 rounded-2xl mb-8" style={{ background: "rgba(0,255,157,0.05)", border: "1px solid rgba(0,255,157,0.15)" }}>
        <p className="text-[#e8eeff] text-sm italic leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
          &ldquo;For we are his workmanship, created in Christ Jesus unto good works, which God hath before ordained that we should walk in them.&rdquo;
        </p>
        <p className="grad-text text-xs font-bold mt-2">— Ephesians 2:10</p>
      </div>
      <p className="grad-text text-sm font-bold mb-8">— The Ahren Foundation Team</p>
      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onBack} className="text-[#8892b0] text-sm font-semibold px-6 py-3 rounded-full transition-colors hover:text-white" style={{ border: "1px solid rgba(0,201,255,0.15)" }}>
        ← Back to program details
      </motion.button>
    </motion.div>
  );
}

function ApplicationForm({ onSubmit }: { onSubmit: () => void }) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {};
    fd.forEach((value, key) => {
      if (payload[key]) {
        const ex = payload[key];
        payload[key] = Array.isArray(ex) ? [...ex, value] : [ex, value];
      } else payload[key] = value;
    });
    try {
      await fetch("/api/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } catch { /* backend wiring pending */ }
    setSubmitting(false);
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="grad-text text-lg font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>Creative Youth Application Form</h3>
      <p className="text-[#8892b0] text-sm leading-relaxed mb-8">
        Thank you for your interest in joining Ahren Foundation! Please complete this form.
        Our team will review your application and contact you within 5–7 business days.
      </p>

      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00c9ff] mb-5">Personal Information</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldGroup label="Full Name" required><input name="full_name" className={inputCls} placeholder="Your full name" required /></FieldGroup>
          <FieldGroup label="Email Address" required><input name="email" type="email" className={inputCls} placeholder="your@email.com" required /></FieldGroup>
          <FieldGroup label="Phone Number" required><input name="phone" className={inputCls} placeholder="+234..." required /></FieldGroup>
          <FieldGroup label="Age Range" required>
            <select name="age_range" className={selectCls} required>
              <option value="">Select age range</option>
              {["16–18", "19–22", "23–26", "27–30"].map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </FieldGroup>
        </div>
        <FieldGroup label="Country / State" required><input name="country_state" className={inputCls} placeholder="e.g. Lagos, Nigeria" required /></FieldGroup>
      </div>

      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00c9ff] mb-5">Skills &amp; Interests</div>
        <FieldGroup label="Current Skills / Area(s) of Interest" required>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 rounded-xl" style={{ background: "rgba(0,201,255,0.04)", border: "1px solid rgba(0,201,255,0.1)" }}>
            {[...EXPERTISE_OPTIONS, "Business / Entrepreneurship"].map((opt) => <CheckboxOption key={opt} label={opt} name="skills" />)}
            <OtherOption name="skills_other" />
          </div>
        </FieldGroup>
        <FieldGroup label="What skills do you want to learn or improve?" required>
          <textarea name="skills_to_learn" className={textareaCls} rows={3} placeholder="Tell us what you'd like to grow in..." required />
        </FieldGroup>
        <FieldGroup label="Have you built any project before? (Optional)" hint="Describe any project you have worked on — even if small.">
          <textarea name="past_projects" className={textareaCls} rows={3} placeholder="Tell us about it..." />
        </FieldGroup>
      </div>

      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00c9ff] mb-5">Eligibility &amp; Commitment</div>
        <FieldGroup label="Are you available to commit to 6-weeks of Digital Skills Training & Creativity Mentorship?" required hint="This includes two weekly interactive modules (Monday & Friday) accessible on our platform.">
          <div className="flex flex-wrap gap-6 p-4 rounded-xl" style={{ background: "rgba(0,201,255,0.04)", border: "1px solid rgba(0,201,255,0.1)" }}>
            {["Yes", "No", "Not Sure"].map((v) => <RadioOption key={v} label={v} name="commit_6_weeks" />)}
          </div>
        </FieldGroup>
        <FieldGroup label="Are you available to attend the six weekend virtual sessions, scheduled between 9:00 AM and 12:00 noon, from September 1st through October 10th?" required hint="Check all that apply.">
          <div className="grid grid-cols-1 gap-3 p-5 rounded-xl" style={{ background: "rgba(0,201,255,0.04)", border: "1px solid rgba(0,201,255,0.1)" }}>
            {SATURDAY_ACTIVITIES.map((a) => <CheckboxOption key={a} label={a} name="saturday_activities" />)}
          </div>
        </FieldGroup>
        <FieldGroup label="Do you understand that your active participation in the weekly interactive modules and virtual sessions is required for certification and verified membership?" required>
          <div className="flex flex-wrap gap-6 p-4 rounded-xl" style={{ background: "rgba(0,201,255,0.04)", border: "1px solid rgba(0,201,255,0.1)" }}>
            {["Yes, I understand", "No"].map((v) => <RadioOption key={v} label={v} name="understand_participation" />)}
          </div>
        </FieldGroup>
      </div>

      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00c9ff] mb-5">Motivation &amp; Vision</div>
        <FieldGroup label="Why do you want to join our Community of Christian Creatives at Ahren Foundation?" required><textarea name="why_join" className={textareaCls} rows={4} placeholder="Share your heart..." required /></FieldGroup>
        <FieldGroup label="What human or societal problem have you identified that you would like to help solve?" required><textarea name="problem_to_solve" className={textareaCls} rows={4} placeholder="Describe the problem..." required /></FieldGroup>
        <FieldGroup label="What do you see yourself building for the Kingdom, humanity, or society?" required><textarea name="what_youd_build" className={textareaCls} rows={4} placeholder="Share your vision..." required /></FieldGroup>
        <FieldGroup label="What would you do if you had the skills, resources, and support to build anything for God?" required><textarea name="dream_project" className={textareaCls} rows={4} placeholder="Dream big..." required /></FieldGroup>
      </div>

      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00ff9d] mb-5">Faith Background</div>
        {FAITH_QUESTIONS.map((item, i) => (
          <FieldGroup key={i} label={item.q} required>
            <div className="flex gap-8">
              <RadioOption label="Yes" name={item.name} />
              <RadioOption label="No" name={item.name} />
            </div>
          </FieldGroup>
        ))}
        <FieldGroup label="Share a bit about your Christian walk or faith conviction — how has God been working in your life in the area of your skills, talents, and creativity?" required>
          <textarea name="testimony" className={textareaCls} rows={5} placeholder="Share your testimony..." required />
        </FieldGroup>
        <FieldGroup label="Church / Campus Fellowship (Optional)"><input name="church" className={inputCls} placeholder="Your church or fellowship" /></FieldGroup>
      </div>

      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00ff9d] mb-5">Agreement &amp; Declaration</div>
        <div className="space-y-4 p-5 rounded-xl mb-5" style={{ background: "rgba(0,201,255,0.04)", border: "1px solid rgba(0,201,255,0.1)" }}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" name="agree_steward" value="Yes" className="w-4 h-4 mt-0.5 accent-[#00c9ff] cursor-pointer flex-shrink-0" required />
            <span className="text-[#8892b0] text-sm leading-relaxed">I commit to stewarding my skills for God&apos;s glory and actively participating in the program.</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" name="consent_contact" value="Yes" className="w-4 h-4 mt-0.5 accent-[#00c9ff] cursor-pointer flex-shrink-0" required />
            <span className="text-[#8892b0] text-sm leading-relaxed">I consent to Ahren Foundation contacting me and storing my information for program purposes.</span>
          </label>
        </div>
        <FieldGroup label="Electronic Signature (Type Full Name)" required><input name="signature" className={inputCls} placeholder="Type your full name" required /></FieldGroup>
      </div>

      <motion.button type="submit" disabled={submitting} whileHover={{ scale: submitting ? 1 : 1.03, boxShadow: submitting ? "none" : "0 0 40px rgba(0,201,255,0.35)" }} whileTap={{ scale: submitting ? 1 : 0.97 }} className="w-full grad-bg text-[#080d2e] font-bold text-base py-4 rounded-2xl disabled:opacity-60">
        {submitting ? "Submitting..." : "Apply as a Creative Youth →"}
      </motion.button>
    </form>
  );
}

export default function JoinPage() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const whoWeWant = [
    "Curious, creative & tech-inclined Christian",
    "Purpose-driven",
    "Open to the Holy Spirit",
    "Open to networking & collaborating with likeminds",
    "Godly Character, Teachable and Reliable",
    "Age 16–30",
  ];
  const commit = [
    "12 Interactive Modules delivered to your Inbox",
    "3 Live Virtual Classes on AI & Tech for Creatives, Branding, Digital Content Creation & Digital Marketing — 3 Saturdays",
    "1-on-1 Virtual Mentor Meetings — 3 Saturdays",
  ];
  const gain = [
    "Biblical understanding of how to use your skills and creativity to build impactful projects",
    "Practical Digital Skills Training in AI for Creatives, Branding, Digital Content Creation & Digital Marketing",
    "Real-life experience insights from creative mentors",
    "A Clear Path to Launch Your Creative Project",
    "Certificate of Completion",
    "Networking and Collaboration Opportunities",
    "Verified Membership Access to our Community Hub",
    "Pathway to Funding Opportunities",
  ];

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
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px, 6vw, 68px)", fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              Join Ahren Foundation
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-[#8892b0] leading-relaxed max-w-2xl" style={{ fontSize: "clamp(16px, 2vw, 19px)" }}>
              Are you a curious, creative, tech-inclined believer ready to learn how to steward your
              skills, gifts and creative prowess for God&apos;s purposes on earth? Then this program
              is for you.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Content */}
      <section className="pb-28 relative" style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}>
        <div className="max-w-4xl mx-auto px-6 pt-12">
          <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="card p-8 md:p-10" style={{ borderRadius: 28 }}>
                <SuccessScreen onBack={() => { setSubmitted(false); setShowForm(false); }} />
              </div>
            </motion.div>
          ) : showForm ? (
            <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <div className="card p-8 md:p-10" style={{ borderRadius: 28 }}>
                <button type="button" onClick={() => setShowForm(false)} className="text-[#8892b0] text-sm font-semibold mb-6 hover:text-[#00c9ff] transition-colors">
                  ← Back to program details
                </button>
                <ApplicationForm onSubmit={() => setSubmitted(true)} />
              </div>
            </motion.div>
          ) : (
          <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {/* Program banner */}
          <FadeUp>
            <div
              className="rounded-3xl p-8 md:p-10 mb-8 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(0,201,255,0.08) 0%, rgba(0,255,157,0.05) 100%)", border: "1px solid rgba(0,201,255,0.2)" }}
            >
              <div className="absolute right-[-50px] top-[-50px] w-56 h-56 rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,255,157,0.1), transparent 70%)" }} />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4" style={{ background: "rgba(0,201,255,0.1)", border: "1px solid rgba(0,201,255,0.2)" }}>
                  <Sparkles size={12} className="text-[#00c9ff]" />
                  <span className="text-[#00c9ff] text-[11px] font-bold tracking-widest uppercase">6-Weeks Program</span>
                </div>
                <h2 className="text-white text-2xl md:text-3xl font-bold mb-3 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                  6-Weeks Tech &amp; Creativity Masterclass Program
                </h2>
                <p className="text-[#8892b0] text-base leading-relaxed">
                  On Creativity, Tech Skills &amp; God&apos;s Purpose — a guided journey to discover, sharpen, and
                  consecrate your gifts to build a Kingdom product that reveals Jesus Christ.
                </p>
              </div>
            </div>
          </FadeUp>

          {/* Cohort now open banner */}
          <FadeUp delay={0.08}>
            <motion.div
              animate={{ boxShadow: ["0 0 0 rgba(0,255,157,0)", "0 0 28px rgba(0,255,157,0.18)", "0 0 0 rgba(0,255,157,0)"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl p-6 md:p-7 mb-8 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(0,255,157,0.09) 0%, rgba(0,201,255,0.06) 100%)",
                border: "1px solid rgba(0,255,157,0.28)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff9d] opacity-70" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00ff9d]" />
                  </span>
                  <span className="text-[#00ff9d] text-[11px] font-bold tracking-[0.16em] uppercase whitespace-nowrap">
                    New Cohort Now Open
                  </span>
                </div>
                <p className="text-[#e8eeff] text-sm md:text-[15px] leading-relaxed">
                  Program kicks off in <span className="text-white font-bold">September 2026</span>.
                  {" "}Application Deadline:{" "}
                  <span className="text-white font-bold">August 22, 2026</span>.
                  {" "}Spots are limited — apply today.
                </p>
              </div>
            </motion.div>
          </FadeUp>

          {/* Three columns */}
          <FadeUp delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {[
                { title: "Who We Want", items: whoWeWant, color: "#00c9ff" },
                { title: "What You Commit To (6 Weeks)", items: commit, color: "#00ff9d" },
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
          </FadeUp>

          {/* Not sure */}
          <FadeUp delay={0.15}>
            <div className="rounded-2xl p-6 mb-8 text-center" style={{ background: "rgba(0,255,157,0.05)", border: "1px solid rgba(0,255,157,0.15)" }}>
              <h4 className="text-white font-bold text-base mb-2" style={{ fontFamily: "var(--font-display)" }}>Not sure if you fit?</h4>
              <p className="text-[#8892b0] text-sm leading-relaxed max-w-xl mx-auto">
                Apply anyway. We will help you discover how your creativity, gifts &amp; skills are valuable to
                God&apos;s purpose on earth.
              </p>
            </div>
          </FadeUp>

          {/* Apply button */}
          <FadeUp delay={0.2}>
            <div className="text-center mb-16">
              <motion.button
                onClick={() => setShowForm(true)}
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(0,201,255,0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="grad-bg text-[#080d2e] font-bold text-base px-12 py-4 rounded-full inline-flex items-center gap-2"
              >
                Apply as a Creative Youth <ArrowRight size={17} />
              </motion.button>
            </div>
          </FadeUp>

          {/* Strategic Partner — ILA */}
          <FadeUp delay={0.25}>
            <div className="pt-10" style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}>
              <div className="text-center mb-8">
                <div className="flex justify-center">
                  <SectionLabel>Strategic Partner</SectionLabel>
                </div>
                <h3 className="text-white text-xl md:text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  In Partnership With <span className="grad-text">ILA</span>
                </h3>
              </div>
              <div
                className="rounded-2xl p-8 flex flex-col md:flex-row items-start gap-6"
                style={{ background: "#111850", border: "1px solid rgba(0,201,255,0.1)" }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
                  style={{ background: "linear-gradient(135deg, rgba(0,201,255,0.15), rgba(0,255,157,0.12))", border: "1px solid rgba(0,201,255,0.2)" }}
                >
                  🎓
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "var(--font-display)" }}>
                    Immersive Leadership Academy (ILA)
                  </h4>
                  <p className="text-[#00c9ff] text-xs font-semibold mb-3 tracking-wide uppercase">
                    Leadership Development Partner
                  </p>
                  <p className="text-[#8892b0] text-sm leading-relaxed">
                    Immersive Leadership Academy (ILA) is a forward-thinking development initiative
                    dedicated to shaping the next generation of leaders. They empower young minds and
                    young professionals with the essential skills, mindset, and confidence needed to
                    excel in their careers, businesses, and personal lives. Through practical training,
                    mentorship, and transformative learning experiences, ILA is committed to building
                    capable, purpose-driven young individuals equipped to lead with clarity, creativity,
                    and impact.
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>
          </motion.div>
          )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
