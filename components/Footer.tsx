"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, CheckCircle2, Send } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.includes("@")) setSubscribed(true);
  };

  return (
    <footer
      className="relative border-t overflow-hidden"
      style={{ borderColor: "rgba(0,201,255,0.1)", background: "#0a0f35" }}
    >
      {/* Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(0,201,255,0.05) 0%, transparent 70%)" }}
      />

      {/* Newsletter strip */}
      <div
        className="relative border-b"
        style={{ borderColor: "rgba(0,201,255,0.08)", background: "rgba(17,24,80,0.5)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3
                className="text-white text-xl font-bold mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Stay in the loop
              </h3>
              <p className="text-[#8892b0] text-sm max-w-sm">
                Get updates on workshops, new projects, fellowship events, and
                Kingdom tech insights — straight to your inbox.
              </p>
            </div>
            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl"
                style={{ background: "rgba(0,255,157,0.1)", border: "1px solid rgba(0,255,157,0.2)" }}
              >
                <CheckCircle2 size={18} className="text-[#00ff9d]" />
                <span className="text-[#00ff9d] font-semibold text-sm">You&apos;re subscribed!</span>
              </motion.div>
            ) : (
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 md:w-64 bg-[rgba(255,255,255,0.04)] border border-[rgba(0,201,255,0.15)] rounded-xl px-4 py-3 text-white text-sm placeholder-[#8892b0] focus:border-[#00c9ff] outline-none transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                />
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0,201,255,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubscribe}
                  className="grad-bg text-[#080d2e] font-bold text-sm px-5 py-3 rounded-xl flex items-center gap-2 flex-shrink-0"
                >
                  <Send size={14} />
                  Subscribe
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <Image src="/assets/logo-icon-color.png" alt="Ahren Foundation" width={38} height={38} className="rounded-xl" />
              <div>
                <div className="font-bold text-white text-lg" style={{ fontFamily: "var(--font-display)" }}>
                  Ahren Foundation
                </div>
                <div className="text-[9px] grad-text font-semibold tracking-widest uppercase">
                  Tech Skills. Kingdom Purpose. Global Impact.
                </div>
              </div>
            </Link>
            <p className="text-[#8892b0] text-sm leading-relaxed max-w-sm mb-7">
              Creativity, Tech, Purpose &amp; Community
            </p>
            <div className="flex gap-2 flex-wrap">
              {["Faith", "Tech", "Community", "Kingdom", "CCLabs"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(0,201,255,0.07)",
                    border: "1px solid rgba(0,201,255,0.15)",
                    color: "#00c9ff",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-white font-bold mb-5 text-sm tracking-widest uppercase"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Explore
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <motion.span
                      whileHover={{ x: 4, color: "#00c9ff" }}
                      className="text-[#8892b0] text-sm cursor-pointer transition-colors duration-200 flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full grad-bg inline-block flex-shrink-0" />
                      {link.label}
                    </motion.span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/apply">
                  <motion.span
                    whileHover={{ x: 4, color: "#00ff9d" }}
                    className="text-[#8892b0] text-sm cursor-pointer transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#00ff9d] inline-block flex-shrink-0" />
                    Join Us
                  </motion.span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-white font-bold mb-5 text-sm tracking-widest uppercase"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Contact
            </h4>
            <ul className="space-y-4">
              {[
                { icon: <Mail size={14} />, value: "hello@ahrenfoundation.org", href: "mailto:hello@ahrenfoundation.org" },
                { icon: <Phone size={14} />, value: "+234 806 131 5942", href: "tel:+2348061315942" },
                { icon: <Phone size={14} />, value: "+44 7762 496766", href: "tel:+447762496766" },
                { icon: <MapPin size={14} />, value: "TMCG - 21 Karmo District Modern Market, Abuja", href: null },
              ].map((c, i) => (
                <li key={i}>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="flex items-start gap-3 text-[#8892b0] text-sm hover:text-[#00c9ff] transition-colors"
                    >
                      <span className="text-[#00c9ff] flex-shrink-0 mt-0.5">{c.icon}</span>
                      {c.value}
                    </a>
                  ) : (
                    <div className="flex items-start gap-3 text-[#8892b0] text-sm">
                      <span className="text-[#00ff9d] flex-shrink-0 mt-0.5">{c.icon}</span>
                      {c.value}
                    </div>
                  )}
                </li>
              ))}
            </ul>

          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(0,201,255,0.08)" }}
        >
          <p className="text-[#8892b0] text-xs text-center md:text-left">
            © 2026 Ahren Foundation. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[#8892b0] text-xs">
            <span>
              Built for the Kingdom ·{" "}
              <span className="grad-text font-semibold">To His Glory</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
