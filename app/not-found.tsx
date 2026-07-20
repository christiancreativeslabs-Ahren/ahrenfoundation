"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#080d2e" }}
    >
      {/* Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,201,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,201,255,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 rounded-full blur-[120px] pointer-events-none"
        style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(0,201,255,0.07) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 rounded-full blur-[120px] pointer-events-none"
        style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(0,255,157,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* 404 */}
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <span
            className="font-display grad-text select-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(120px, 20vw, 200px)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.06em",
              display: "block",
            }}
          >
            404
          </span>
        </motion.div>

        {/* AF logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="nf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ff9d" />
                <stop offset="100%" stopColor="#00c9ff" />
              </linearGradient>
            </defs>
            <polygon points="15,85 35,15 50,15 30,85" fill="url(#nf-grad)" />
            <rect x="48" y="15" width="37" height="12" rx="4" fill="url(#nf-grad)" />
            <rect x="48" y="39" width="28" height="12" rx="4" fill="url(#nf-grad)" />
            <rect x="48" y="15" width="12" height="70" rx="4" fill="url(#nf-grad)" />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-white text-2xl font-bold mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          This page wasn&apos;t found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-[#8892b0] text-base leading-relaxed mb-10 max-w-sm mx-auto"
        >
          But don&apos;t worry — there&apos;s a whole Kingdom being built here.
          Head back home and explore what we&apos;re creating.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0,201,255,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="grad-bg text-[#080d2e] font-bold text-sm px-8 py-3.5 rounded-full flex items-center gap-2"
            >
              <Home size={16} />
              Go Home
            </motion.button>
          </Link>
          <Link href="/about">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="font-bold text-sm px-8 py-3.5 rounded-full flex items-center gap-2 transition-all"
              style={{ border: "1.5px solid rgba(0,201,255,0.3)", color: "#00c9ff" }}
            >
              About Us <ArrowRight size={15} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
