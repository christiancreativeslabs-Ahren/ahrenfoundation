"use client";

import type { ReactNode } from "react";
import { useActionState, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { submitJoinApplication, type JoinActionState } from "@/actions/join";
import type { JoinFieldErrors } from "@/types/join";

const inputCls =
  "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(0,201,255,0.12)] rounded-xl px-4 py-3 text-white text-sm placeholder-[#8892b0] focus:border-[#00c9ff] focus:bg-[rgba(0,201,255,0.04)] transition-all duration-200 outline-none";

const textareaCls =
  "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(0,201,255,0.12)] rounded-xl px-4 py-3 text-white text-sm placeholder-[#8892b0] focus:border-[#00c9ff] focus:bg-[rgba(0,201,255,0.04)] transition-all duration-200 outline-none resize-none";

const SKILL_OPTIONS = [
  "Software Development",
  "UI/UX Design",
  "Graphic Design",
  "Video Production",
  "Audio Engineering",
  "Writing / Content Creation",
  "Digital Marketing",
  "Data Science / AI",
  "Photography",
  "Music / Singing",
  "Animation",
  "Product Management",
  "Cybersecurity",
] as const;

const PARTICIPATION_OPTIONS = [
  "Join a mentorship group",
  "Attend live trainings and events",
  "Share my creative work on the platform",
  "Connect with other Christian creatives",
  "Become a mentor (if qualified)",
  "Volunteer with Ahren Foundation",
] as const;

const AGE_RANGES = ["16-18", "19-22", "23-26", "27-30", "31-35"] as const;

function FormLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="mb-2 block text-[13px] font-semibold text-[#e8eeff]">
      {label}
      {required ? <span className="ml-1 text-[#00c9ff]">*</span> : null}
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
      {error ? <p className="mt-2 text-xs text-[#ffb4c0]">{error}</p> : null}
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
    <label className="group flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        name={name}
        value={value}
        className="h-4 w-4 cursor-pointer rounded accent-[#00c9ff]"
      />
      <span className="text-sm text-[#8892b0] transition-colors group-hover:text-[#e8eeff]">
        {label}
      </span>
    </label>
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
    <label className="group flex cursor-pointer items-center gap-2.5">
      <input
        type="radio"
        name={name}
        value={value}
        className="h-4 w-4 cursor-pointer accent-[#00c9ff]"
      />
      <span className="text-sm text-[#8892b0] transition-colors group-hover:text-[#e8eeff]">
        {label}
      </span>
    </label>
  );
}

function OtherOption({
  checkboxName,
  textName,
  error,
  placeholder,
}: {
  checkboxName: string;
  textName: string;
  error?: string;
  placeholder: string;
}) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="mt-2 space-y-2 sm:col-span-2">
      <label className="group flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          name={checkboxName}
          value="other"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="h-4 w-4 cursor-pointer rounded accent-[#00c9ff]"
        />
        <span className="text-sm text-[#8892b0] transition-colors group-hover:text-[#e8eeff]">
          Other
        </span>
      </label>
      <AnimatePresence>
        {checked ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <input
              name={textName}
              className={inputCls}
              placeholder={placeholder}
            />
            {error ? (
              <p className="mt-2 text-xs text-[#ffb4c0]">{error}</p>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function SuccessScreen({ onBack }: { onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-16 text-center"
    >
      <div className="grad-bg mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full">
        <CheckCircle2 size={36} className="text-[#080d2e]" />
      </div>
      <h2
        className="mb-4 text-3xl font-bold text-white"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Welcome to the community!
      </h2>
      <p className="mx-auto mb-4 max-w-lg text-base leading-relaxed text-[#8892b0]">
        Your registration was received. Check your email for a welcome message
        with next steps and WhatsApp details.
      </p>
      <p className="mb-8 text-sm font-bold grad-text">
        You can log in with the email and password you just created.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href="/login"
          className="grad-bg rounded-full px-6 py-3 text-sm font-bold text-[#080d2e]"
        >
          Log in
        </a>
        <button
          type="button"
          onClick={onBack}
          className="rounded-full px-6 py-3 text-sm font-semibold text-[#8892b0]"
          style={{ border: "1px solid rgba(0,201,255,0.15)" }}
        >
          Submit another
        </button>
      </div>
    </motion.div>
  );
}

export default function CommunitySignupForm() {
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

  const fieldErrors: JoinFieldErrors = state.fieldErrors ?? {};

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (state.ok && state.submittedType === "community") {
      setSubmitted(true);
    }
  }, [state.ok, state.submittedType]);

  if (submitted) {
    return <SuccessScreen onBack={() => setSubmitted(false)} />;
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="application_type" value="community" />
      <h3
        className="grad-text mb-2 text-lg font-bold"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Join our community
      </h3>
      <p className="mb-8 text-sm leading-relaxed text-[#8892b0]">
        Welcome! Fill out this short form so we can get to know you and connect
        you with the right opportunities, resources, and like-minded Christian
        creatives.
      </p>
      <div className="mb-8">
        <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#00c9ff]">
          Personal information
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldGroup label="Full Name" required error={fieldErrors.full_name}>
            <input
              name="full_name"
              className={inputCls}
              placeholder="Your full name"
              required
            />
          </FieldGroup>
          <FieldGroup label="Email Address" required error={fieldErrors.email}>
            <input
              name="email"
              type="email"
              className={inputCls}
              placeholder="your@email.com"
              required
            />
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
          <FieldGroup label="Gender" required error={fieldErrors.sex}>
            <div
              className="flex flex-wrap gap-6 rounded-xl p-4"
              style={{
                background: "rgba(0,201,255,0.04)",
                border: "1px solid rgba(0,201,255,0.1)",
              }}
            >
              <RadioOption label="Male" name="sex" value="Male" />
              <RadioOption label="Female" name="sex" value="Female" />
            </div>
          </FieldGroup>
          <FieldGroup label="Age Range" required error={fieldErrors.age_range}>
            <select
              name="age_range"
              className={inputCls}
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select age range
              </option>
              {AGE_RANGES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </FieldGroup>
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
      </div>
      <div className="mb-8">
        <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#00c9ff]">
          Skills & interests
        </div>
        <FieldGroup
          label="Primary creative or tech skill(s)"
          required
          error={fieldErrors.skills}
        >
          <div
            className="grid grid-cols-1 gap-3 rounded-xl p-5 sm:grid-cols-2"
            style={{
              background: "rgba(0,201,255,0.04)",
              border: "1px solid rgba(0,201,255,0.1)",
            }}
          >
            {SKILL_OPTIONS.map((opt) => (
              <CheckboxOption key={opt} label={opt} name="skills" value={opt} />
            ))}
            <OtherOption
              checkboxName="skills_other_enabled"
              textName="skills_other"
              error={fieldErrors.skills_other}
              placeholder="Please specify..."
            />
          </div>
        </FieldGroup>
        <FieldGroup
          label="What skill(s) do you want to learn or improve?"
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
        <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#00c9ff]">
          Participation
        </div>
        <FieldGroup
          label="How would you like to participate?"
          required
          error={fieldErrors.participation}
        >
          <div
            className="grid grid-cols-1 gap-3 rounded-xl p-5 sm:grid-cols-2"
            style={{
              background: "rgba(0,201,255,0.04)",
              border: "1px solid rgba(0,201,255,0.1)",
            }}
          >
            {PARTICIPATION_OPTIONS.map((opt) => (
              <CheckboxOption
                key={opt}
                label={opt}
                name="participation"
                value={opt}
              />
            ))}
            <OtherOption
              checkboxName="participation_other_enabled"
              textName="participation_other"
              error={fieldErrors.participation_other}
              placeholder="Please specify..."
            />
          </div>
        </FieldGroup>
        <FieldGroup
          label="What are you hoping to gain from this community?"
          required
          error={fieldErrors.why_join}
        >
          <textarea
            name="why_join"
            className={textareaCls}
            rows={4}
            placeholder="Share your hopes..."
            required
          />
        </FieldGroup>
      </div>
      {/* <div className="mb-8">
        <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#00c9ff]">
          Account login
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldGroup label="Password" required error={fieldErrors.password}>
            <input
              name="password"
              type="password"
              className={inputCls}
              placeholder="At least 8 characters"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </FieldGroup>
          <FieldGroup
            label="Confirm password"
            required
            error={fieldErrors.password_confirm}
          >
            <input
              name="password_confirm"
              type="password"
              className={inputCls}
              placeholder="Repeat password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </FieldGroup>
        </div>
      </div> */}

      <div className="mb-8">
        <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#00c9ff]">
          Account login
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldGroup label="Password" required error={fieldErrors.password}>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className={`${inputCls} pr-11`}
                placeholder="At least 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8892b0] transition-colors hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FieldGroup>

          <FieldGroup
            label="Confirm password"
            required
            error={fieldErrors.password_confirm}
          >
            <div className="relative">
              <input
                name="password_confirm"
                type={showConfirmPassword ? "text" : "password"}
                className={`${inputCls} pr-11`}
                placeholder="Repeat password"
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8892b0] transition-colors hover:text-white"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FieldGroup>
        </div>
      </div>
      <div
        className="mb-8 rounded-xl p-5"
        style={{
          background: "rgba(0,201,255,0.04)",
          border: "1px solid rgba(0,201,255,0.1)",
        }}
      >
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            value="true"
            className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer accent-[#00c9ff]"
            required
          />
          <span className="text-sm leading-relaxed text-[#8892b0]">
            I agree to join the Ahren Foundation community and to be contacted
            about programs, events, and opportunities.
          </span>
        </label>
        {fieldErrors.consent ? (
          <p className="mt-2 text-xs text-[#ffb4c0]">{fieldErrors.consent}</p>
        ) : null}
      </div>
      {state.error ? (
        <div className="mb-4 rounded-xl border border-[rgba(255,99,132,0.18)] bg-[rgba(255,99,132,0.08)] px-4 py-3 text-sm text-[#ffb4c0]">
          {state.error}
        </div>
      ) : null}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        type="submit"
        className="grad-bg inline-flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-[#080d2e] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? "Submitting..." : "Join the community"}
      </motion.button>
    </form>
  );
}
