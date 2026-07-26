"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FadeUp, SectionLabel } from "@/components/ui";

const IMAGES = [
  { src: "/showcase/cclabs-workspace.jpg", alt: "Christian creatives collaborating in the CCLabs workspace", span: "col-span-2 row-span-2", label: "CCLabs" },
  { src: "/showcase/digital-creator.jpg", alt: "Digital creator designing with African-inspired artwork", span: "", label: "Creativity" },
  { src: "/showcase/mentorship-1on1.jpg", alt: "One-on-one mentorship session", span: "", label: "Mentorship" },
  { src: "/showcase/prayer-gathering.jpg", alt: "Believers gathered in prayer before building", span: "", label: "Spirit-Led" },
  { src: "/showcase/fellowship-circle.jpg", alt: "Believers in Tech Fellowship gathering", span: "", label: "Fellowship" },
  { src: "/showcase/building-kingdom.jpg", alt: "Team planning a Kingdom project", span: "col-span-2", label: "Building for the Kingdom" },
];

export default function TechShowcase() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeUp className="text-center mb-14">
          <div className="flex justify-center">
            <SectionLabel>Faith in Action</SectionLabel>
          </div>
          <h2
            className="font-display text-white"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            Where Creativity Meets <span className="grad-text">Calling</span>
          </h2>
          <p className="text-[#8892b0] mt-4 max-w-lg mx-auto text-base leading-relaxed">
            Real believers, real skills, real impact — building Kingdom products together.
          </p>
        </FadeUp>

        <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[160px] lg:auto-rows-[190px] gap-4">
          {IMAGES.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-2xl overflow-hidden group ${img.span}`}
              style={{ border: "1px solid rgba(0,201,255,0.12)" }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(8,13,46,0.9) 0%, rgba(8,13,46,0.15) 55%, rgba(8,13,46,0.35) 100%)" }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "linear-gradient(135deg, rgba(0,201,255,0.18), rgba(0,255,157,0.12))" }}
              />
              <div className="absolute bottom-4 left-4 right-4">
                <span
                  className="inline-block text-[11px] font-bold px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(8,13,46,0.75)", border: "1px solid rgba(0,201,255,0.3)", color: "#00c9ff", backdropFilter: "blur(8px)" }}
                >
                  {img.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
