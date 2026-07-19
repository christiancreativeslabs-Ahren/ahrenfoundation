"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Home, Lock, Mail } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";

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

const inputClass =
  "w-full rounded-xl border border-[rgba(0,201,255,0.14)] bg-[rgba(255,255,255,0.04)] px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-[#8892b0] focus:border-[#00c9ff] focus:bg-[rgba(0,201,255,0.04)]";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetError = () => {
    if (error) setError("");
  };

  const handleEmailAuth = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });

      if (result.error) {
        setError(result.error.message || "We could not sign you in.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (authError) {
      setError(
        authError instanceof Error ? authError.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        newUserCallbackURL: "/join",
      });
    } catch (authError) {
      setError(
        authError instanceof Error
          ? authError.message
          : "Google sign-in failed."
      );
      setLoading(false);
    }
  };

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
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(0,201,255,0.15)] bg-[rgba(255,255,255,0.04)] px-4 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[rgba(0,201,255,0.06)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Home size={16} />
          Continue with Google
        </motion.button>

        <div className="mb-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[rgba(0,201,255,0.12)]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8892b0]">
            Or use email
          </span>
          <div className="h-px flex-1 bg-[rgba(0,201,255,0.12)]" />
        </div>

        <div className="space-y-4">
          <Field label="Email Address" icon={<Mail size={14} />}>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                resetError();
              }}
              type="email"
              className={inputClass}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Field>

          <Field label="Password" icon={<Lock size={14} />}>
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                resetError();
              }}
              type="password"
              className={inputClass}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </Field>

          {error && (
            <div
              className="rounded-xl border px-4 py-3 text-sm"
              style={{
                background: "rgba(255, 99, 132, 0.08)",
                borderColor: "rgba(255, 99, 132, 0.18)",
                color: "#ffb4c0",
              }}
            >
              {error}
            </div>
          )}

          <motion.button
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
          </motion.button>
        </div>

        <div className="mt-6 rounded-2xl border border-[rgba(0,201,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
          <p className="text-sm leading-relaxed text-[#8892b0]">
            Use your email and password, or continue with Google. New Google
            users will be sent to the join form automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
