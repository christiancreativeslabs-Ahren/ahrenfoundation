"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { FadeUp, StaggerParent, StaggerChild } from "@/components/ui/custom";

const SCRIPTURES = [
  {
    ref: "1 Peter 4:10 (KJV)",
    text: "As every man hath received the gift, even so minister the same one to another, as good stewards of the manifold grace of God.",
    theme: "Stewardship",
    color: "#00c9ff",
  },
  {
    ref: "Colossians 3:23 (KJV)",
    text: "And whatsoever ye do, do it heartily, as to the Lord, and not unto men.",
    theme: "Excellence",
    color: "#00ff9d",
  },
  {
    ref: "John 14:26 (KJV)",
    text: "But the Comforter, which is the Holy Ghost, whom the Father will send in my name, he shall teach you all things, and bring all things to your remembrance, whatsoever I have said unto you.",
    theme: "Holy Spirit",
    color: "#00c9ff",
  },
  {
    ref: "1 Timothy 4:12 (KJV)",
    text: "Let no man despise thy youth; but be thou an example of the believers, in word, in conversation, in charity, in spirit, in faith, in purity.",
    theme: "Youth",
    color: "#00ff9d",
  },
];

export default function ScripturesSection() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #080d2e 0%, #0a1035 50%, #080d2e 100%)",
        borderTop: "1px solid rgba(0,201,255,0.08)",
        borderBottom: "1px solid rgba(0,201,255,0.08)",
      }}
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,201,255,0.07) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      {/* Centre glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[100px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(0,201,255,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <FadeUp className="text-center mb-14">
          {/* Section header */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] grad-bg rounded-full" />
            <BookOpen size={16} className="text-[#00c9ff]" />
            <div className="w-8 h-[2px] grad-bg rounded-full" />
          </div>
          <h2
            className="text-white font-bold mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(24px, 3.5vw, 40px)",
              letterSpacing: "-0.02em",
            }}
          >
            The Scriptures We <span className="grad-text">Stand On</span>
          </h2>
          <p className="text-[#8892b0] text-sm max-w-md mx-auto leading-relaxed">
            Our foundation is not just tech — it is the Word of God. These
            scriptures anchor everything we build, teach, and create.
          </p>
        </FadeUp>

        <StaggerParent className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SCRIPTURES.map((s, i) => (
            <StaggerChild key={i}>
              <motion.div
                whileHover={{ y: -5, borderColor: s.color + "44" }}
                className="relative p-8 rounded-2xl transition-all duration-300 overflow-hidden group"
                style={{
                  background: "rgba(17,24,80,0.7)",
                  border: "1px solid rgba(0,201,255,0.1)",
                }}
              >
                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
                  style={{
                    background: `linear-gradient(to bottom, ${s.color}, transparent)`,
                  }}
                />

                {/* Theme pill */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full"
                    style={{
                      background: s.color + "12",
                      border: `1px solid ${s.color}25`,
                      color: s.color,
                    }}
                  >
                    {s.theme}
                  </span>
                  {/* Large quote mark */}
                  <span
                    className="text-4xl font-black leading-none opacity-10 select-none"
                    style={{ fontFamily: "Georgia, serif", color: s.color }}
                  >
                    &ldquo;
                  </span>
                </div>

                {/* Scripture text */}
                <p
                  className="text-[#e8eeff] text-[15px] leading-relaxed italic mb-5"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  &ldquo;{s.text}&rdquo;
                </p>

                {/* Reference */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-px" style={{ background: s.color }} />
                  <span
                    className="text-xs font-bold tracking-wide"
                    style={{ color: s.color }}
                  >
                    {s.ref}
                  </span>
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerParent>
      </div>
    </section>
  );
}
