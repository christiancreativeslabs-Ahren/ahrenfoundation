"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, User, Tag } from "lucide-react";
import {
  SectionLabel,
  FadeUp,
  StaggerParent,
  StaggerChild,
  GradientOrb,
} from "@/components/ui/custom";
import { BLOGS } from "@/lib/data";

type Blog = (typeof BLOGS)[0];

function BlogModal({ post, onClose }: { post: Blog; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{
          background: "rgba(8,13,46,0.92)",
          backdropFilter: "blur(20px)",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="card w-full max-w-2xl max-h-[85vh] overflow-y-auto"
          style={{ borderRadius: 28, padding: "48px" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(0,201,255,0.1)",
                  border: "1px solid rgba(0,201,255,0.2)",
                  color: "#00c9ff",
                }}
              >
                <Tag size={10} className="inline mr-1" />
                {post.tag}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-[#8892b0] hover:text-white transition-colors flex-shrink-0 p-1"
            >
              <X size={20} />
            </button>
          </div>

          <h2
            className="text-white text-2xl font-bold leading-snug mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {post.title}
          </h2>

          <div className="flex items-center gap-5 mb-8 text-[#8892b0] text-xs">
            <span className="flex items-center gap-1.5">
              <User size={12} />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {post.readTime}
            </span>
            <span>{post.date}</span>
          </div>

          <div
            className="h-px mb-8"
            style={{ background: "rgba(0,201,255,0.1)" }}
          />

          <p className="text-[#8892b0] text-base leading-relaxed mb-6">
            {post.excerpt}
          </p>
          <p className="text-[#8892b0] text-base leading-relaxed mb-6">
            This article explores the intersection of faith and technology — how
            believers can consecrate their skills, creativity, and technical
            expertise to the Holy Spirit and see the Kingdom of God advance in
            the digital age.
          </p>
          <p className="text-[#8892b0] text-base leading-relaxed">
            Full articles are coming soon as part of our content program.
            Subscribe to the Ahren Foundation newsletter to be notified when new
            articles are published. In the meantime, join our Believers in Tech
            Fellowship to be part of these conversations live.
          </p>

          <div className="mt-10 flex gap-3 flex-wrap">
            <a href="/join">
              <motion.button
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 30px rgba(0,201,255,0.3)",
                }}
                whileTap={{ scale: 0.97 }}
                className="grad-bg text-[#080d2e] font-bold text-sm px-6 py-3 rounded-full"
              >
                Join the Fellowship
              </motion.button>
            </a>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="text-[#8892b0] font-semibold text-sm px-6 py-3 rounded-full transition-colors"
              style={{ border: "1px solid rgba(0,201,255,0.15)" }}
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function BlogPage() {
  const [active, setActive] = useState<Blog | null>(null);
  const [filter, setFilter] = useState("All");

  const tags = ["All", ...Array.from(new Set(BLOGS.map((b) => b.tag)))];
  const filtered =
    filter === "All" ? BLOGS : BLOGS.filter((b) => b.tag === filter);

  return (
    <main className="bg-[#080d2e] overflow-hidden">
      {/* Header */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GradientOrb
          className="top-[-10%] right-[-5%]"
          size={600}
          color="mint"
        />
        <GradientOrb className="bottom-0 left-[-5%]" size={500} color="cyan" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FadeUp>
            <SectionLabel>Stories & Insights</SectionLabel>
            <h1
              className="font-display text-white leading-[1.02] mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 7vw, 80px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              The Ahren Blog
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p
              className="text-[#8892b0] leading-relaxed max-w-2xl"
              style={{ fontSize: "clamp(16px, 2vw, 20px)" }}
            >
              Reflections, stories, and insights from the intersection of faith,
              creativity, and technology — for the believer who builds.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Filter tags */}
      <section
        className="py-8 sticky top-[70px] z-20"
        style={{
          background: "rgba(8,13,46,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,201,255,0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex gap-3 flex-wrap">
          {tags.map((tag) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setFilter(tag)}
              className="text-xs font-bold px-4 py-2 rounded-full transition-all duration-200"
              style={
                filter === tag
                  ? {
                      background: "linear-gradient(135deg,#00c9ff,#00ff9d)",
                      color: "#080d2e",
                    }
                  : {
                      background: "rgba(0,201,255,0.08)",
                      border: "1px solid rgba(0,201,255,0.15)",
                      color: "#8892b0",
                    }
              }
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Blog grid */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          {/* Featured post */}
          {filter === "All" && (
            <FadeUp className="mb-8">
              <motion.div
                whileHover={{ y: -4 }}
                onClick={() => setActive(BLOGS[0])}
                className="card cursor-pointer transition-all duration-300 overflow-hidden"
                style={{ borderRadius: 28, borderLeft: "4px solid #00c9ff" }}
              >
                <div className="grid lg:grid-cols-[1fr_auto] gap-0">
                  <div className="p-10">
                    <div className="flex items-center gap-3 mb-6">
                      <span
                        className="text-xs font-bold px-3 py-1.5 rounded-full"
                        style={{
                          background: "rgba(0,201,255,0.1)",
                          border: "1px solid rgba(0,201,255,0.2)",
                          color: "#00c9ff",
                        }}
                      >
                        {BLOGS[0].tag}
                      </span>
                      <span
                        className="text-xs font-bold px-3 py-1.5 rounded-full"
                        style={{
                          background: "rgba(0,255,157,0.08)",
                          border: "1px solid rgba(0,255,157,0.2)",
                          color: "#00ff9d",
                        }}
                      >
                        ★ Featured
                      </span>
                    </div>
                    <h2
                      className="text-white text-3xl font-bold leading-snug mb-4"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {BLOGS[0].title}
                    </h2>
                    <p className="text-[#8892b0] text-base leading-relaxed mb-6 max-w-2xl">
                      {BLOGS[0].excerpt}
                    </p>
                    <div className="flex items-center gap-6 text-[#8892b0] text-sm">
                      <span>{BLOGS[0].author}</span>
                      <span>·</span>
                      <span>{BLOGS[0].date}</span>
                      <span>·</span>
                      <span>{BLOGS[0].readTime}</span>
                    </div>
                  </div>
                  <div
                    className="hidden lg:flex items-center justify-center px-12"
                    style={{ borderLeft: "1px solid rgba(0,201,255,0.08)" }}
                  >
                    <span
                      className="text-8xl font-bold grad-text opacity-20"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      01
                    </span>
                  </div>
                </div>
              </motion.div>
            </FadeUp>
          )}

          {/* Grid */}
          <StaggerParent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filter === "All" ? filtered.slice(1) : filtered).map((post) => (
              <StaggerChild key={post.id}>
                <motion.div
                  whileHover={{ y: -8, borderColor: "rgba(0,201,255,0.3)" }}
                  onClick={() => setActive(post)}
                  className="card cursor-pointer transition-all duration-300 flex flex-col h-full"
                  style={{ borderRadius: 22, padding: "32px" }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{
                        background: "rgba(0,201,255,0.08)",
                        border: "1px solid rgba(0,201,255,0.15)",
                        color: "#00c9ff",
                      }}
                    >
                      {post.tag}
                    </span>
                    <span className="text-[#8892b0] text-xs flex items-center gap-1">
                      <Clock size={11} />
                      {post.readTime}
                    </span>
                  </div>
                  <h3
                    className="text-white font-bold text-xl leading-snug mb-3 flex-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-[#8892b0] text-sm leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                  <div
                    className="flex items-center justify-between pt-5"
                    style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}
                  >
                    <div>
                      <p className="text-[#8892b0] text-xs">{post.author}</p>
                      <p className="text-[#8892b0] text-xs">{post.date}</p>
                    </div>
                    <motion.span
                      whileHover={{ x: 4 }}
                      className="grad-text text-sm font-bold"
                    >
                      Read →
                    </motion.span>
                  </div>
                </motion.div>
              </StaggerChild>
            ))}
          </StaggerParent>

          {/* Coming soon note */}
          <FadeUp className="text-center mt-16">
            <div
              className="inline-block px-8 py-5 rounded-2xl"
              style={{
                background: "rgba(17,24,80,0.6)",
                border: "1px solid rgba(0,201,255,0.1)",
              }}
            >
              <p className="text-[#8892b0] text-sm">
                More articles coming soon.{" "}
                <a
                  href="/join"
                  className="grad-text font-semibold hover:opacity-80 transition-opacity"
                >
                  Join the community
                </a>{" "}
                to be notified.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Blog modal */}
      {active && <BlogModal post={active} onClose={() => setActive(null)} />}
    </main>
  );
}
