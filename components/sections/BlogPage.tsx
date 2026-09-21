"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import {
  SectionLabel,
  FadeUp,
  StaggerParent,
  StaggerChild,
  GradientOrb,
} from "@/components/ui";

export type PublicBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  author: string;
  date: string;
  tag: string;
  readTime: string;
};

export default function BlogPage({ posts }: { posts: PublicBlogPost[] }) {
  const [filter, setFilter] = useState("All");

  const tags = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.tag)))],
    [posts],
  );

  const filtered =
    filter === "All" ? posts : posts.filter((p) => p.tag === filter);

  const featured = filter === "All" ? filtered[0] : null;
  const gridPosts = filter === "All" && featured ? filtered.slice(1) : filtered;

  return (
    <main className="bg-[#080d2e] overflow-hidden">
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

      {posts.length > 0 ? (
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
      ) : null}

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          {posts.length === 0 ? (
            <FadeUp>
              <div
                className="rounded-[28px] px-8 py-16 text-center"
                style={{
                  background: "rgba(17,24,80,0.6)",
                  border: "1px solid rgba(0,201,255,0.1)",
                }}
              >
                <p className="text-[#8892b0] text-base">
                  No articles published yet. Check back soon.
                </p>
              </div>
            </FadeUp>
          ) : null}

          {featured ? (
            <FadeUp className="mb-8">
              <Link href={`/blog/${featured.slug}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="card cursor-pointer transition-all duration-300 overflow-hidden"
                  style={{
                    borderRadius: 28,
                    borderLeft: "4px solid #00c9ff",
                  }}
                >
                  <div className="grid lg:grid-cols-[1fr_auto] gap-0">
                    <div className="p-10">
                      <div className="flex items-center gap-3 mb-6 flex-wrap">
                        <span
                          className="text-xs font-bold px-3 py-1.5 rounded-full"
                          style={{
                            background: "rgba(0,201,255,0.1)",
                            border: "1px solid rgba(0,201,255,0.2)",
                            color: "#00c9ff",
                          }}
                        >
                          {featured.tag}
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
                        {featured.title}
                      </h2>
                      <p className="text-[#8892b0] text-base leading-relaxed mb-6 max-w-2xl">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center gap-6 text-[#8892b0] text-sm flex-wrap">
                        <span>{featured.author}</span>
                        <span>·</span>
                        <span>{featured.date}</span>
                      </div>
                    </div>
                    <div
                      className="hidden lg:flex items-center justify-center px-12"
                      style={{ borderLeft: "1px solid rgba(0,201,255,0.08)" }}
                    >
                      {featured.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={featured.coverImageUrl}
                          alt={featured.title}
                          className="h-40 w-40 rounded-2xl object-cover"
                        />
                      ) : (
                        <span
                          className="text-8xl font-bold grad-text opacity-20"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          01
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            </FadeUp>
          ) : null}

          <StaggerParent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((post) => (
              <StaggerChild key={post.id}>
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <motion.div
                    whileHover={{ y: -8, borderColor: "rgba(0,201,255,0.3)" }}
                    className="card cursor-pointer transition-all duration-300 flex flex-col h-full"
                    style={{ borderRadius: 22, padding: "32px" }}
                  >
                    {post.coverImageUrl ? (
                      <div className="mb-5 overflow-hidden rounded-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.coverImageUrl}
                          alt={post.title}
                          className="h-40 w-full object-cover"
                        />
                      </div>
                    ) : null}
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
                    <p className="text-[#8892b0] text-sm leading-relaxed mb-6 line-clamp-3">
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
                      <span className="grad-text text-sm font-bold">
                        Read →
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </StaggerChild>
            ))}
          </StaggerParent>

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
                  href="/hub"
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
    </main>
  );
}
