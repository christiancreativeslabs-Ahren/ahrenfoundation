"use client";

import { useActionState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Mail } from "lucide-react";
import {
  activateYouthAccountAction,
  type ActivateYouthState,
} from "@/actions/activate-youth-account";

const inputCls =
  "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(0,201,255,0.12)] rounded-xl px-4 py-3 text-white text-sm placeholder-[#8892b0] focus:border-[#00c9ff] outline-none";

const initial: ActivateYouthState = { ok: false, message: "" };

export default function ActivateYouthForm() {
  const [state, formAction, pending] = useActionState(
    activateYouthAccountAction,
    initial,
  );

  useEffect(() => {
    if (state.ok) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.ok]);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[#e8eeff]">
          <Mail size={14} className="text-[#00c9ff]" />
          Email address
        </label>
        <input
          name="email"
          type="email"
          required
          className={inputCls}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      {state.message ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            state.ok
              ? "border-[rgba(0,255,157,0.2)] bg-[rgba(0,255,157,0.08)] text-[#b8f5d4]"
              : "border-[rgba(255,99,132,0.18)] bg-[rgba(255,99,132,0.08)] text-[#ffb4c0]"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <motion.button
        type="submit"
        disabled={pending}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="grad-bg inline-flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-[#080d2e] disabled:opacity-70"
      >
        {pending ? <Loader2 size={16} className="animate-spin" /> : null}
        {pending ? "Sending…" : "Send activation link"}
      </motion.button>
    </form>
  );
}
