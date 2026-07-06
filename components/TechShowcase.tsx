"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FadeUp, SectionLabel } from "@/components/ui";

// Curated Unsplash images — African / Black believers in tech, coding, collaboration, creativity
const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
    alt: "African professional working in tech",
    span: "lg:col-span-2 lg:row-span-2",
    label: "Collaboration",
  },
  {
    src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80",
    alt: "African developer coding",
    span: "",
    label: "Building",
  },
  {
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80",
    alt: "African creative team working together",
    span: "",
    label: "Creativity",
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    alt: "Diverse African team collaborating",
    span: "lg:col-span-2",
    label: "Community",
  },
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
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Where Creativity Meets <span className="grad-text">Calling</span>
          </h2>
          <p className="text-[#8892b0] mt-4 max-w-lg mx-auto text-base leading-relaxed">
            Real believers, real skills, real impact — building Kingdom products together.
          </p>
        </FadeUp>

        <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[180px] lg:auto-rows-[200px] gap-4">
          {IMAGES.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 0.99 }}
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
              {/* Navy gradient overlay */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(8,13,46,0.85) 0%, rgba(8,13,46,0.1) 50%, rgba(8,13,46,0.3) 100%)" }}
              />
              {/* Cyan tint */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(135deg, rgba(0,201,255,0.15), rgba(0,255,157,0.1))" }}
              />
              {/* Label */}
              <div className="absolute bottom-4 left-4">
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(8,13,46,0.7)",
                    border: "1px solid rgba(0,201,255,0.25)",
                    color: "#00c9ff",
                    backdropFilter: "blur(8px)",
                  }}
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
