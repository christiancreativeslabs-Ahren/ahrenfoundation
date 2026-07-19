"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Globe,
  CheckCircle2,
  MessageSquare,
  Send,
} from "lucide-react";
import {
  SectionLabel,
  FadeUp,
  StaggerParent,
  StaggerChild,
  GradientOrb,
} from "@/components/ui/custom";

const inputCls =
  "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(0,201,255,0.12)] rounded-xl px-4 py-3.5 text-white text-sm placeholder-[#8892b0] focus:border-[#00c9ff] focus:bg-[rgba(0,201,255,0.04)] transition-all duration-200 outline-none";

const textareaCls =
  "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(0,201,255,0.12)] rounded-xl px-4 py-3.5 text-white text-sm placeholder-[#8892b0] focus:border-[#00c9ff] focus:bg-[rgba(0,201,255,0.04)] transition-all duration-200 outline-none resize-none";

function FieldGroup({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label className="block text-[#e8eeff] text-[13px] font-semibold mb-2">
        {label}
        {required && <span className="text-[#00c9ff] ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const contacts = [
  {
    icon: <Mail size={18} />,
    label: "Email",
    value: "ahrenfoundation@gmail.com",
    href: "mailto:ahrenfoundation@gmail.com",
    color: "#00c9ff",
  },
  {
    icon: <Phone size={18} />,
    label: "Nigeria",
    value: "+234 806 131 5942",
    href: "tel:+2348061315942",
    color: "#00ff9d",
  },
  {
    icon: <Phone size={18} />,
    label: "United Kingdom",
    value: "+44 7762 496766",
    href: "tel:+447762496766",
    color: "#00c9ff",
  },
  {
    icon: <Globe size={18} />,
    label: "Reach",
    value: "Global · 7 Continents",
    href: null,
    color: "#00ff9d",
  },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="bg-[#080d2e] overflow-hidden">
      {/* Header */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <GradientOrb
          className="top-[-15%] left-[-5%]"
          size={600}
          color="mint"
        />
        <GradientOrb className="bottom-0 right-[-5%]" size={500} color="cyan" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FadeUp>
            <SectionLabel>Get in Touch</SectionLabel>
            <h1
              className="font-display text-white leading-[1.02] mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 7vw, 80px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Contact Us
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p
              className="text-[#8892b0] leading-relaxed max-w-2xl"
              style={{ fontSize: "clamp(16px, 2vw, 20px)" }}
            >
              We&apos;d love to hear from you — whether you have a question, a
              partnership idea, or just want to learn more about what we do.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Content */}
      <section
        className="py-20 relative"
        style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
            {/* Left: Contact info */}
            <FadeUp>
              <div>
                <h2
                  className="text-white text-2xl font-bold mb-8"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Reach Out
                </h2>

                <StaggerParent className="space-y-4 mb-12">
                  {contacts.map((c, i) => (
                    <StaggerChild key={i}>
                      <motion.div whileHover={{ x: 6 }}>
                        {c.href ? (
                          <a
                            href={c.href}
                            className="flex items-center gap-4 p-5 rounded-2xl transition-all duration-200 group"
                            style={{
                              background: "#111850",
                              border: "1px solid rgba(0,201,255,0.08)",
                            }}
                          >
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{
                                background: c.color + "15",
                                color: c.color,
                              }}
                            >
                              {c.icon}
                            </div>
                            <div>
                              <p className="text-[#8892b0] text-xs font-medium mb-0.5">
                                {c.label}
                              </p>
                              <p className="text-white text-sm font-semibold group-hover:grad-text transition-all">
                                {c.value}
                              </p>
                            </div>
                          </a>
                        ) : (
                          <div
                            className="flex items-center gap-4 p-5 rounded-2xl"
                            style={{
                              background: "#111850",
                              border: "1px solid rgba(0,201,255,0.08)",
                            }}
                          >
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{
                                background: c.color + "15",
                                color: c.color,
                              }}
                            >
                              {c.icon}
                            </div>
                            <div>
                              <p className="text-[#8892b0] text-xs font-medium mb-0.5">
                                {c.label}
                              </p>
                              <p className="text-white text-sm font-semibold">
                                {c.value}
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </StaggerChild>
                  ))}
                </StaggerParent>

                {/* Brand card */}
                <div
                  className="p-6 rounded-2xl relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #0d1340, #111850)",
                    border: "1px solid rgba(0,201,255,0.15)",
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none"
                    style={{ background: "rgba(0,201,255,0.08)" }}
                  />
                  <MessageSquare size={24} className="text-[#00c9ff] mb-4" />
                  <h4
                    className="text-white font-bold text-base mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Ahren Foundation
                  </h4>
                  <p className="text-[#8892b0] text-sm leading-relaxed">
                    Empowering youths for societal impact and purposeful living
                    through tech programs, mentorship, and strategic
                    collaborations — to the glory of God.
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Right: Contact form */}
            <FadeUp delay={0.15}>
              <div className="card p-10" style={{ borderRadius: 28 }}>
                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center py-12"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full grad-bg mb-6"
                    >
                      <CheckCircle2 size={36} className="text-[#080d2e]" />
                    </motion.div>
                    <h3
                      className="text-white text-2xl font-bold mb-3"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Message Sent!
                    </h3>
                    <p className="text-[#8892b0] text-sm leading-relaxed mb-8">
                      Thank you for reaching out. We&apos;ll be in touch with
                      you shortly.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      onClick={() => setSent(false)}
                      className="text-[#8892b0] text-sm font-semibold px-6 py-3 rounded-full transition-colors hover:text-white"
                      style={{ border: "1px solid rgba(0,201,255,0.15)" }}
                    >
                      Send another message
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-8">
                      <Send size={20} className="text-[#00c9ff]" />
                      <h3
                        className="text-white text-xl font-bold"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Send us a Message
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-0">
                      <FieldGroup label="Full Name" required>
                        <input className={inputCls} placeholder="Your name" />
                      </FieldGroup>
                      <FieldGroup label="Email Address" required>
                        <input
                          className={inputCls}
                          type="email"
                          placeholder="your@email.com"
                        />
                      </FieldGroup>
                    </div>
                    <FieldGroup label="Phone Number">
                      <input className={inputCls} placeholder="+234..." />
                    </FieldGroup>
                    <FieldGroup label="Subject" required>
                      <select
                        className={inputCls.replace(
                          "placeholder-[#8892b0]",
                          "text-[#8892b0]"
                        )}
                      >
                        <option value="">Select a subject...</option>
                        {[
                          "General Enquiry",
                          "Partnership / Collaboration",
                          "Media & Press",
                          "Technical Support",
                          "Donation / Support",
                          "Other",
                        ].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </FieldGroup>
                    <FieldGroup label="Message" required>
                      <textarea
                        className={textareaCls}
                        rows={5}
                        placeholder="Write your message here..."
                      />
                    </FieldGroup>

                    <motion.button
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 0 40px rgba(0,201,255,0.35)",
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSent(true)}
                      className="w-full grad-bg text-[#080d2e] font-bold text-base py-4 rounded-2xl flex items-center justify-center gap-2"
                    >
                      <Send size={17} />
                      Send Message
                    </motion.button>
                  </>
                )}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </main>
  );
}
