"use client";

import { motion } from "framer-motion";

const items = [
  "Faith", "×", "Technology", "×", "Kingdom Purpose", "×",
  "Holy Spirit-Led", "×", "Build What Matters", "×", "Global Impact", "×",
  "Believers in Tech", "×", "CCLabs", "×", "Spirit-Led Innovation", "×",
  "Great Commission", "×", "Tech for Jesus", "×", "Purpose Driven", "×",
];

// Duplicate for seamless loop
const allItems = [...items, ...items];

export default function MarqueeTicker() {
  return (
    <div
      className="relative overflow-hidden py-4 border-y"
      style={{ borderColor: "rgba(0,201,255,0.1)", background: "rgba(13,19,64,0.5)" }}
    >
      {/* Left fade */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #080d2e, transparent)" }}
      />
      {/* Right fade */}
      <div
        className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #080d2e, transparent)" }}
      />

      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex items-center gap-6 whitespace-nowrap"
        style={{ width: "max-content" }}
      >
        {allItems.map((item, i) => (
          <span
            key={i}
            className={`text-sm font-semibold select-none ${
              item === "×"
                ? "grad-text text-base"
                : "text-[#8892b0]"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
