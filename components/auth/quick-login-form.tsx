"use client";

import type { ReactNode } from "react";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Home, Lock, Mail } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { requestProgramMemberLoginLinkAction } from "@/actions/admin";
import { url } from "better-auth";

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[#e8eeff]">
        <span className="text-[#00c9ff]">{icon}</span>
        {label}
      </span>
      {children}
    </label>
  );
}

const initialActionState = {
  ok: false,
  message: "",
  url: "",
};

const inputClass =
  "w-full rounded-xl border border-[rgba(0,201,255,0.14)] bg-[rgba(255,255,255,0.04)] px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-[#8892b0] focus:border-[#00c9ff] focus:bg-[rgba(0,201,255,0.04)]";

type LoginFormProps = {
  callbackURL?: string;
  newUserCallbackURL?: string;
  newUserLabel?: string;
  note?: string;
  defaultEmail?: string;
  defaultPassword?: string;
};

export default function QuickLoginForm({
  callbackURL = "/dashboard",
  newUserCallbackURL = "/training/apply",
  newUserLabel = "Join the community",
  note = "Use your email and password.",
  defaultEmail = "",
  defaultPassword = "",
}: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(defaultEmail);
  const [lastname, setLastname] = useState(defaultPassword);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [state, formAction, pending] = useActionState(
    requestProgramMemberLoginLinkAction,
    initialActionState,
  );

  // When we receive the magic-link URL → redirect immediately
  useEffect(() => {
    if (state.ok && state.url) {
      window.location.href = state.url; // full page navigation (required for cookie)
    }
  }, [state]);

  const resetError = () => {
    if (error) setError("");
  };

  // const handleEmailAuth = async () => {
  //   setLoading(true);
  //   setError("");

  //   try {
  //     // Call the implementation that generate thsame link as the token sent above
  //     // const result = await authClient.signIn.email({
  //     //   email,
  //     //   lastname,
  //     //   callbackURL,
  //     // });

  //     if (result.error) {
  //       setError(result.error.message || "We could not sign you in.");
  //       return;
  //     }

  //     router.push(callbackURL);
  //     router.refresh();
  //   } catch (authError) {
  //     setError(
  //       authError instanceof Error
  //         ? authError.message
  //         : "Something went wrong.",
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="card relative overflow-hidden p-6 sm:p-8">
      <div className="absolute inset-0 dot-bg opacity-20" />
      <div
        className="absolute -top-20 right-0 h-56 w-56 rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,201,255,0.12), transparent 70%)",
        }}
      />

      <div className="relative z-10">
        <div className="mb-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[rgba(0,201,255,0.12)]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8892b0]">
            Temporary Login
          </span>
          <div className="h-px flex-1 bg-[rgba(0,201,255,0.12)]" />
        </div>

        <form action={formAction} className="relative z-10 space-y-4">
          <Field label="Email Address" icon={<Mail size={14} />}>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                resetError();
              }}
              name="email"
              type="email"
              className={inputClass}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Field>

          <Field label="Last Name" icon={<Lock size={14} />}>
            <input
              name="lastName"
              value={lastname}
              onChange={(e) => {
                setLastname(e.target.value);
                resetError();
              }}
              type="text"
              className={inputClass}
              placeholder="Enter your lastname"
              autoComplete="family-name"
            />
          </Field>
<<<<<<< HEAD

          {error && (
=======
          {!state.ok && state.message && (
>>>>>>> opcode
            <div
              className="rounded-xl border px-4 py-3 text-sm"
              style={{
                background: "rgba(255, 99, 132, 0.08)",
                borderColor: "rgba(255, 99, 132, 0.18)",
                color: "#ffb4c0",
              }}
            >
<<<<<<< HEAD
              {error}
            </div>
          )}

=======
              {state.message}
            </div>
          )}
>>>>>>> opcode
          <motion.button
            whileHover={{
              scale: 1.01,
              boxShadow: "0 0 30px rgba(0,201,255,0.28)",
            }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={pending}
            className="grad-bg flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 text-base font-bold text-[#080d2e] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? "Signing in..." : "Sign in"}
            {!pending && <ArrowRight size={16} />}
          </motion.button>

          {/* <motion.button
            whileHover={{
              scale: 1.01,
              boxShadow: "0 0 30px rgba(0,201,255,0.28)",
            }}
            whileTap={{ scale: 0.99 }}
            type="button"
            onClick={handleEmailAuth}
            disabled={loading}
            className="grad-bg flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 text-base font-bold text-[#080d2e] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Please wait..." : "Sign in"}
            {!loading && <ArrowRight size={16} />}
          </motion.button> */}
        </form>

        <div className="mt-6 rounded-2xl border border-[rgba(0,201,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
          <p className="text-sm leading-relaxed text-[#8892b0]">{note}</p>
        </div>
      </div>
    </div>
  );
}
