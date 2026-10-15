"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { markEmailVerifiedAfterPasswordReset } from "@/actions/mark-email-verified-after-reset";

const inputCls =
  "w-full rounded-xl border border-[rgba(0,201,255,0.12)] bg-[rgba(255,255,255,0.04)] px-4 py-3 pr-11 text-sm text-white outline-none placeholder:text-[#8892b0] focus:border-[#00c9ff]";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-[#ffb4c0]">
          This link is invalid or missing a token. Request a new activation
          link.
        </p>
        <Link
          href="/hub/activate"
          className="grad-text text-sm font-bold hover:underline"
        >
          Activate account
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-base font-semibold text-white">Password saved</p>
        <p className="text-sm text-[#8892b0]">
          You can log in with your email and new password.
        </p>
        <Link
          href="/hub/login"
          className="grad-bg inline-flex rounded-full px-6 py-3 text-sm font-bold text-[#080d2e]"
        >
          Go to login
        </Link>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const result = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (result.error) {
        setError(
          result.error.message ||
            "Could not set password. The link may have expired.",
        );
        return;
      }

      // Best-effort: unlock youth/community login gate
      try {
        // If your reset response includes user email, pass it.
        // Otherwise skip; user can verify via verification email if needed.
        const email =
          typeof result.data === "object" &&
          result.data &&
          "user" in result.data &&
          result.data.user &&
          typeof (result.data as { user?: { email?: string } }).user?.email ===
            "string"
            ? (result.data as { user: { email: string } }).user.email
            : null;

        if (email) {
          await markEmailVerifiedAfterPasswordReset(email);
        }
      } catch {
        // non-fatal
      }

      setDone(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[#e8eeff]">
          <Lock size={14} className="text-[#00c9ff]" />
          New password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
            placeholder="At least 8 characters"
            minLength={8}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8892b0] hover:text-white"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[#e8eeff]">
          <Lock size={14} className="text-[#00c9ff]" />
          Confirm password
        </label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputCls}
            placeholder="Repeat password"
            minLength={8}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8892b0] hover:text-white"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-[rgba(255,99,132,0.18)] bg-[rgba(255,99,132,0.08)] px-4 py-3 text-sm text-[#ffb4c0]">
          {error}
          <p className="mt-2 text-xs">
            Need a new link?{" "}
            <Link href="/hub/activate" className="underline">
              Activate account
            </Link>
          </p>
        </div>
      ) : null}

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="grad-bg inline-flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-[#080d2e] disabled:opacity-70"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? "Saving…" : "Save password"}
      </motion.button>
    </form>
  );
}
