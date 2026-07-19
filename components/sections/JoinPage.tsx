"use client";

import type { ReactNode } from "react";
import { useActionState, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { SectionLabel, FadeUp, GradientOrb } from "@/components/ui/custom";
import { EXPERTISE_OPTIONS } from "@/lib/data";
import { submitJoinApplication, type JoinActionState } from "@/actions/join";
import type { JoinFieldErrors } from "@/types/join";

const inputCls =
  "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(0,201,255,0.12)] rounded-xl px-4 py-3 text-white text-sm placeholder-[#8892b0] focus:border-[#00c9ff] focus:bg-[rgba(0,201,255,0.04)] transition-all duration-200 outline-none";

const textareaCls =
  "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(0,201,255,0.12)] rounded-xl px-4 py-3 text-white text-sm placeholder-[#8892b0] focus:border-[#00c9ff] focus:bg-[rgba(0,201,255,0.04)] transition-all duration-200 outline-none resize-none";

type JoinTab = "youth" | "mentor";

function FormLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-[#e8eeff] text-[13px] font-semibold mb-2">
      {label}
      {required && <span className="text-[#00c9ff] ml-1">*</span>}
    </label>
  );
}

function FieldGroup({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-5">
      <FormLabel label={label} required={required} />
      {children}
      {error && <p className="mt-2 text-xs text-[#ffb4c0]">{error}</p>}
    </div>
  );
}

function CheckboxOption({
  label,
  name,
  value,
}: {
  label: string;
  name: string;
  value: string;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        name={name}
        value={value}
        className="w-4 h-4 rounded accent-[#00c9ff] cursor-pointer"
      />
      <span className="text-[#8892b0] text-sm group-hover:text-[#e8eeff] transition-colors">
        {label}
      </span>
    </label>
  );
}

function OtherOption({
  checkboxName,
  textName,
  error,
  placeholder = "Please specify your area...",
}: {
  checkboxName: string;
  textName: string;
  error?: string;
  placeholder?: string;
}) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="sm:col-span-2 mt-2 space-y-2">
      <label className="flex items-center gap-2.5 cursor-pointer group">
        <input
          type="checkbox"
          name={checkboxName}
          value="other"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="w-4 h-4 rounded accent-[#00c9ff] cursor-pointer"
        />
        <span className="text-[#8892b0] text-sm group-hover:text-[#e8eeff] transition-colors">
          Other
        </span>
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
            <input
              name={textName}
              className={inputCls}
              placeholder={placeholder}
              autoFocus
            />
            {error && <p className="mt-2 text-xs text-[#ffb4c0]">{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RadioOption({
  label,
  name,
  value,
}: {
  label: string;
  name: string;
  value: string;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="radio"
        name={name}
        value={value}
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

function SuccessScreen({
  type,
  onBack,
}: {
  type: JoinTab;
  onBack: () => void;
}) {
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
        {type === "mentor"
          ? "Application Submitted!"
          : "Welcome to Ahren Foundation!"}
      </h2>
      <p className="text-[#8892b0] text-base leading-relaxed max-w-lg mx-auto mb-4">
        {type === "mentor"
          ? "We have received your application. Our team will review it and contact you within 5-7 business days."
          : "Your application has been received. A team member will reach out within 5-7 business days to schedule a virtual chat."}
      </p>
      <p className="grad-text text-sm font-bold mb-10">
        - Ahren Foundation Team
      </p>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onBack}
        className="text-[#8892b0] text-sm font-semibold px-6 py-3 rounded-full transition-colors hover:text-white"
        style={{ border: "1px solid rgba(0,201,255,0.15)" }}
      >
        Back to form
      </motion.button>
    </motion.div>
  );
}

function YouthForm({
  action,
  loading,
  error,
  fieldErrors,
  prefilledName,
  prefilledEmail,
}: {
  action: (formData: FormData) => void;
  loading: boolean;
  error: string;
  fieldErrors: JoinFieldErrors;
  prefilledName?: string | null;
  prefilledEmail?: string | null;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="application_type" value="youth" />
      <h3
        className="grad-text text-lg font-bold mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Apply as a Creative Youth
      </h3>

      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00c9ff] mb-5">
          Personal Information
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldGroup label="Full Name" required error={fieldErrors.full_name}>
            <input
              name="full_name"
              className={`${inputCls} ${prefilledName ? "cursor-not-allowed opacity-90" : ""}`}
              placeholder="Your full name"
              required
              defaultValue={prefilledName ?? ""}
              readOnly={Boolean(prefilledName)}
            />
            {prefilledName ? (
              <p className="mt-2 text-[11px] leading-relaxed text-[#00ff9d]">
                We pulled this name from your Google sign-in.
              </p>
            ) : null}
          </FieldGroup>
          <FieldGroup label="Email Address" required error={fieldErrors.email}>
            <div className="space-y-2">
              <input
                name="email"
                className={`${inputCls} ${prefilledEmail ? "cursor-not-allowed opacity-90" : ""}`}
                type="email"
                placeholder="your@email.com"
                required
                defaultValue={prefilledEmail ?? ""}
                readOnly={Boolean(prefilledEmail)}
              />
              {prefilledEmail ? (
                <p className="text-[11px] leading-relaxed text-[#00ff9d]">
                  We pulled this email from your Google sign-in.
                </p>
              ) : null}
            </div>
          </FieldGroup>
          <FieldGroup
            label="Phone Number"
            required
            error={fieldErrors.phone_number}
          >
            <input
              name="phone_number"
              className={inputCls}
              placeholder="+234..."
              required
            />
          </FieldGroup>
          <FieldGroup label="Age Range" required error={fieldErrors.age_range}>
            <select
              name="age_range"
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(0,201,255,0.12)] rounded-xl px-4 py-3 text-[#8892b0] text-sm focus:border-[#00c9ff] transition-all duration-200 outline-none appearance-none cursor-pointer"
              required
            >
              <option value="">Select age range</option>
              {["16-18", "19-22", "23-26", "27-30", "31-35"].map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </FieldGroup>
        </div>
        <FieldGroup
          label="Country / State"
          required
          error={fieldErrors.country_state}
        >
          <input
            name="country_state"
            className={inputCls}
            placeholder="e.g. Lagos, Nigeria"
            required
          />
        </FieldGroup>
      </div>

      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00c9ff] mb-5">
          Skills &amp; Interests
        </div>
        <FieldGroup
          label="Current Skills / Area(s) of Interest"
          required
          error={fieldErrors.skills}
        >
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 rounded-xl"
            style={{
              background: "rgba(0,201,255,0.04)",
              border: "1px solid rgba(0,201,255,0.1)",
            }}
          >
            {EXPERTISE_OPTIONS.map((opt) => (
              <CheckboxOption key={opt} label={opt} name="skills" value={opt} />
            ))}
            <OtherOption
              checkboxName="skills_other_enabled"
              textName="skills_other"
              error={fieldErrors.skills_other}
              placeholder="e.g. Game Development, 3D Modelling..."
            />
          </div>
        </FieldGroup>
        <FieldGroup
          label="What skills do you want to learn or improve?"
          required
          error={fieldErrors.skills_to_learn}
        >
          <textarea
            name="skills_to_learn"
            className={textareaCls}
            rows={3}
            placeholder="Tell us what you'd like to grow in..."
            required
          />
        </FieldGroup>
      </div>

      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00c9ff] mb-5">
          Motivation
        </div>
        <FieldGroup
          label="Why do you want to join us at Ahren Foundation?"
          required
          error={fieldErrors.why_join}
        >
          <textarea
            name="why_join"
            className={textareaCls}
            rows={4}
            placeholder="Share your heart..."
            required
          />
        </FieldGroup>
        <FieldGroup label="Have you built any project before? (Optional)">
          <textarea
            name="project_experience"
            className={textareaCls}
            rows={3}
            placeholder="Tell us about it..."
          />
        </FieldGroup>
        <FieldGroup
          label="Preferred Participation Format"
          required
          error={fieldErrors.participation_formats}
        >
          <div
            className="flex flex-wrap gap-5 p-4 rounded-xl"
            style={{
              background: "rgba(0,201,255,0.04)",
              border: "1px solid rgba(0,201,255,0.1)",
            }}
          >
            {[
              "Virtual (online only)",
              "Physical centre (if available)",
              "Both virtual and physical",
            ].map((f) => (
              <CheckboxOption
                key={f}
                label={f}
                name="participation_formats"
                value={f}
              />
            ))}
          </div>
        </FieldGroup>
      </div>

      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00ff9d] mb-5">
          Faith Background
        </div>
        {FAITH_QUESTIONS.map((q, i) => (
          <FieldGroup
            key={q}
            label={q}
            required
            error={
              i === 0
                ? fieldErrors.faith_born_again
                : i === 1
                  ? fieldErrors.faith_holy_spirit
                  : fieldErrors.faith_dependency
            }
          >
            <div className="flex gap-8">
              <RadioOption
                label="Yes"
                name={
                  i === 0
                    ? "faith_born_again"
                    : i === 1
                      ? "faith_holy_spirit"
                      : "faith_dependency"
                }
                value="yes"
              />
              <RadioOption
                label="No"
                name={
                  i === 0
                    ? "faith_born_again"
                    : i === 1
                      ? "faith_holy_spirit"
                      : "faith_dependency"
                }
                value="no"
              />
            </div>
          </FieldGroup>
        ))}
        <FieldGroup
          label="Brief Testimony - How has God been working in your life in the area of your skills, talents and creativity?"
          required
          error={fieldErrors.testimony}
        >
          <textarea
            name="testimony"
            className={textareaCls}
            rows={5}
            placeholder="Share your testimony..."
            required
          />
        </FieldGroup>
        <FieldGroup label="Church / Youth Fellowship (Optional)">
          <input
            name="church"
            className={inputCls}
            placeholder="Your church or ministry"
          />
        </FieldGroup>
      </div>

      {fieldErrors.consent && (
        <div className="mb-4 text-xs text-[#ffb4c0]">{fieldErrors.consent}</div>
      )}
      <div
        className="mb-8 p-5 rounded-xl"
        style={{
          background: "rgba(0,201,255,0.04)",
          border: "1px solid rgba(0,201,255,0.1)",
        }}
      >
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="consent"
            value="true"
            className="w-4 h-4 mt-0.5 accent-[#00c9ff] cursor-pointer flex-shrink-0"
            required
          />
          <span className="text-[#8892b0] text-sm leading-relaxed">
            I commit to stewarding my skills for God&apos;s glory and actively
            participating in the program.
          </span>
        </label>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-[rgba(255,99,132,0.18)] bg-[rgba(255,99,132,0.08)] px-4 py-3 text-sm text-[#ffb4c0]">
          {error}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(0,201,255,0.35)" }}
        whileTap={{ scale: 0.97 }}
        disabled={loading}
        className="w-full grad-bg text-[#080d2e] font-bold text-base py-4 rounded-2xl disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        type="submit"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? "Submitting..." : "Apply as a Creative Youth"}
      </motion.button>
    </form>
  );
}

function MentorForm({
  action,
  loading,
  error,
  fieldErrors,
  prefilledName,
  prefilledEmail,
}: {
  action: (formData: FormData) => void;
  loading: boolean;
  error: string;
  fieldErrors: JoinFieldErrors;
  prefilledName?: string | null;
  prefilledEmail?: string | null;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="application_type" value="mentor" />
      <h3
        className="grad-text text-lg font-bold mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Become a Mentor
      </h3>

      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00c9ff] mb-5">
          Personal Information
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldGroup label="Full Name" required error={fieldErrors.full_name}>
            <input
              name="full_name"
              className={`${inputCls} ${prefilledName ? "cursor-not-allowed opacity-90" : ""}`}
              placeholder="Your full name"
              required
              defaultValue={prefilledName ?? ""}
              readOnly={Boolean(prefilledName)}
            />
            {prefilledName ? (
              <p className="mt-2 text-[11px] leading-relaxed text-[#00ff9d]">
                We pulled this name from your Google sign-in.
              </p>
            ) : null}
          </FieldGroup>
          <FieldGroup label="Email Address" required error={fieldErrors.email}>
            <div className="space-y-2">
              <input
                name="email"
                className={`${inputCls} ${prefilledEmail ? "cursor-not-allowed opacity-90" : ""}`}
                type="email"
                placeholder="your@email.com"
                required
                defaultValue={prefilledEmail ?? ""}
                readOnly={Boolean(prefilledEmail)}
              />
              {prefilledEmail ? (
                <p className="text-[11px] leading-relaxed text-[#00ff9d]">
                  We pulled this email from your Google sign-in.
                </p>
              ) : null}
            </div>
          </FieldGroup>
          <FieldGroup
            label="Phone Number"
            required
            error={fieldErrors.phone_number}
          >
            <input
              name="phone_number"
              className={inputCls}
              placeholder="+234..."
              required
            />
          </FieldGroup>
          <FieldGroup
            label="Country / Continent"
            required
            error={fieldErrors.country_continent}
          >
            <input
              name="country_continent"
              className={inputCls}
              placeholder="e.g. Nigeria / Africa"
              required
            />
          </FieldGroup>
        </div>
      </div>

      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00c9ff] mb-5">
          Professional Information
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldGroup
            label="Profession / Industry"
            required
            error={fieldErrors.profession}
          >
            <input
              name="profession"
              className={inputCls}
              placeholder="e.g. Software Engineering"
              required
            />
          </FieldGroup>
          <FieldGroup
            label="Years of Experience"
            required
            error={fieldErrors.years_experience}
          >
            <input
              name="years_experience"
              className={inputCls}
              type="number"
              placeholder="e.g. 5"
              required
            />
          </FieldGroup>
        </div>
        <FieldGroup
          label="Area(s) of Expertise"
          required
          error={fieldErrors.expertise}
        >
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 rounded-xl"
            style={{
              background: "rgba(0,201,255,0.04)",
              border: "1px solid rgba(0,201,255,0.1)",
            }}
          >
            {EXPERTISE_OPTIONS.filter(
              (o) => o !== "Writing / Content Creation"
            ).map((opt) => (
              <CheckboxOption
                key={opt}
                label={opt}
                name="expertise"
                value={opt}
              />
            ))}
            <OtherOption
              checkboxName="expertise_other_enabled"
              textName="expertise_other"
              error={fieldErrors.expertise_other}
              placeholder="e.g. Blockchain, DevOps, Cloud Architecture..."
            />
          </div>
        </FieldGroup>
      </div>

      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00c9ff] mb-5">
          Mentorship Commitment
        </div>
        <FieldGroup
          label="Why do you want to mentor young believers?"
          required
          error={fieldErrors.why_mentor}
        >
          <textarea
            name="why_mentor"
            className={textareaCls}
            rows={4}
            placeholder="Share your heart for the next generation..."
            required
          />
        </FieldGroup>
        <FieldGroup
          label="Available Commitment (hours/month)"
          required
          error={fieldErrors.commitment}
        >
          <div
            className="flex flex-wrap gap-6 p-4 rounded-xl"
            style={{
              background: "rgba(0,201,255,0.04)",
              border: "1px solid rgba(0,201,255,0.1)",
            }}
          >
            {["2-4 hours/month", "5-8 hours/month", "9+ hours/month"].map(
              (c) => (
                <RadioOption key={c} label={c} name="commitment" value={c} />
              )
            )}
          </div>
        </FieldGroup>
        <FieldGroup
          label="Preferred Mentorship Format"
          required
          error={fieldErrors.preferred_format}
        >
          <div
            className="flex flex-wrap gap-6 p-4 rounded-xl"
            style={{
              background: "rgba(0,201,255,0.04)",
              border: "1px solid rgba(0,201,255,0.1)",
            }}
          >
            {["Virtual", "In-person", "Both"].map((f) => (
              <RadioOption
                key={f}
                label={f}
                name="preferred_format"
                value={f}
              />
            ))}
          </div>
        </FieldGroup>
      </div>

      <div className="mb-8">
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00ff9d] mb-5">
          Faith Background
        </div>
        {FAITH_QUESTIONS.map((q, i) => (
          <FieldGroup
            key={q}
            label={q}
            required
            error={
              i === 0
                ? fieldErrors.mentor_faith_born_again
                : i === 1
                  ? fieldErrors.mentor_faith_holy_spirit
                  : fieldErrors.mentor_faith_dependency
            }
          >
            <div className="flex gap-8">
              <RadioOption
                label="Yes"
                name={
                  i === 0
                    ? "mentor_faith_born_again"
                    : i === 1
                      ? "mentor_faith_holy_spirit"
                      : "mentor_faith_dependency"
                }
                value="yes"
              />
              <RadioOption
                label="No"
                name={
                  i === 0
                    ? "mentor_faith_born_again"
                    : i === 1
                      ? "mentor_faith_holy_spirit"
                      : "mentor_faith_dependency"
                }
                value="no"
              />
            </div>
          </FieldGroup>
        ))}
        <FieldGroup
          label="Brief Testimony - How has God been working through your skills?"
          required
          error={fieldErrors.testimony}
        >
          <textarea
            name="testimony"
            className={textareaCls}
            rows={5}
            placeholder="Share your testimony..."
            required
          />
        </FieldGroup>
        <FieldGroup label="Church / Ministry Affiliation (Optional)">
          <input
            name="church"
            className={inputCls}
            placeholder="Your church or ministry"
          />
        </FieldGroup>
      </div>

      {fieldErrors.consent && (
        <div className="mb-4 text-xs text-[#ffb4c0]">{fieldErrors.consent}</div>
      )}
      <div
        className="mb-8 p-5 rounded-xl"
        style={{
          background: "rgba(0,201,255,0.04)",
          border: "1px solid rgba(0,201,255,0.1)",
        }}
      >
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="consent"
            value="true"
            className="w-4 h-4 mt-0.5 accent-[#00c9ff] cursor-pointer flex-shrink-0"
            required
          />
          <span className="text-[#8892b0] text-sm leading-relaxed">
            I agree to the mentorship guidelines and commit to stewarding my
            time for God&apos;s glory.
          </span>
        </label>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-[rgba(255,99,132,0.18)] bg-[rgba(255,99,132,0.08)] px-4 py-3 text-sm text-[#ffb4c0]">
          {error}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(0,201,255,0.35)" }}
        whileTap={{ scale: 0.97 }}
        disabled={loading}
        className="w-full grad-bg text-[#080d2e] font-bold text-base py-4 rounded-2xl disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        type="submit"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? "Submitting..." : "Submit Mentor Application"}
      </motion.button>
    </form>
  );
}

export default function JoinPage({
  prefilledEmail,
  prefilledName,
}: {
  prefilledEmail?: string | null;
  prefilledName?: string | null;
}) {
  const [tab, setTab] = useState<JoinTab>("youth");
  const [submitted, setSubmitted] = useState(false);
  const [state, formAction, loading] = useActionState<
    JoinActionState,
    FormData
  >(submitJoinApplication, {
    ok: false,
    error: "",
    submittedType: null,
    fieldErrors: {},
    emailSent: false,
  });

  useEffect(() => {
    setSubmitted(Boolean(state.ok && state.submittedType === tab));
  }, [state.ok, state.submittedType, tab]);

  return (
    <main className="bg-[#080d2e] overflow-hidden">
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GradientOrb
          className="top-[-15%] right-[-5%]"
          size={600}
          color="cyan"
        />
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
            <p
              className="text-[#8892b0] leading-relaxed max-w-2xl"
              style={{ fontSize: "clamp(16px, 2vw, 19px)" }}
            >
              Whether you&apos;re a creative youth ready to build for the
              Kingdom, or a seasoned professional ready to invest in the next
              generation, there&apos;s a place for you.
            </p>
          </FadeUp>
        </div>
      </section>

      <section
        className="pb-28 relative"
        style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}
      >
        <div className="max-w-3xl mx-auto px-6 pt-12">
          <FadeUp className="mb-10">
            <div
              className="flex p-1 rounded-2xl w-full"
              style={{
                background: "#111850",
                border: "1px solid rgba(0,201,255,0.1)",
              }}
            >
              {(["youth"] as const).map((t) => (
                <motion.button
                  key={t}
                  onClick={() => {
                    setTab(t);
                    setSubmitted(false);
                  }}
                  className="flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-300"
                  style={
                    tab === t
                      ? {
                          background: "linear-gradient(135deg,#00c9ff,#00ff9d)",
                          color: "#080d2e",
                        }
                      : { color: "#8892b0" }
                  }
                  type="button"
                >
                  Apply as Creative Youth
                </motion.button>
              ))}
              {/*
              <motion.button
                key="mentor"
                onClick={() => {
                  setTab("mentor");
                  setSubmitted(false);
                }}
                className="flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-300"
                style={
                  tab === "mentor"
                    ? {
                        background: "linear-gradient(135deg,#00c9ff,#00ff9d)",
                        color: "#080d2e",
                      }
                    : { color: "#8892b0" }
                }
                type="button"
              >
                Become a Mentor
              </motion.button>
              */}
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="card p-10" style={{ borderRadius: 28 }}>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <SuccessScreen
                      type={tab}
                      onBack={() => setSubmitted(false)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="youth"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <YouthForm
                      action={formAction}
                      loading={loading}
                      error={state.error}
                      fieldErrors={state.fieldErrors}
                      prefilledName={prefilledName}
                      prefilledEmail={prefilledEmail}
                    />
                  </motion.div>
                  /*
                ) : (
                  <motion.div
                    key="mentor"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <MentorForm
                      action={formAction}
                      loading={loading}
                      error={state.error}
                      fieldErrors={state.fieldErrors}
                      prefilledName={prefilledName}
                      prefilledEmail={prefilledEmail}
                    />
                  </motion.div>
                  */
                )}
              </AnimatePresence>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
