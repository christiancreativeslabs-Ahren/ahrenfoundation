"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone, Globe } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";

export default function Footer() {
  return (
    <footer
      className="relative border-t overflow-hidden"
      style={{ borderColor: "rgba(0,201,255,0.1)", background: "#0a0f35" }}
    >
      {/* Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(0,201,255,0.06) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <Image src="/assets/logo-icon-color.png" alt="Ahren Foundation" width={40} height={40} className="rounded-xl" />
              <div>
                <div className="font-bold text-white text-lg" style={{ fontFamily: "var(--font-display)" }}>
                  Ahren Foundation
                </div>
                <div className="text-[10px] grad-text font-semibold tracking-widest uppercase">
                  Tech Skills. Kingdom Purpose. Global Impact.
                </div>
              </div>
            </Link>
            <p className="text-[#8892b0] text-sm leading-relaxed max-w-sm mb-8">
              Aligning tech skills and creativity with God&apos;s purpose — partnering with the Holy Spirit to create value that impacts lives and reveals Jesus Christ to the world.
            </p>
            <div className="flex gap-3 flex-wrap">
              {["Faith", "Tech", "Community", "Kingdom"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: "rgba(0,201,255,0.08)", border: "1px solid rgba(0,201,255,0.15)", color: "#00c9ff" }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm tracking-widest uppercase" style={{ fontFamily: "var(--font-display)" }}>
              Explore
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <motion.span
                      whileHover={{ x: 4, color: "#00c9ff" }}
                      className="text-[#8892b0] text-sm cursor-pointer transition-colors duration-200 flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full grad-bg inline-block" />
                      {link.label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm tracking-widest uppercase" style={{ fontFamily: "var(--font-display)" }}>
              Contact
            </h4>
            <ul className="space-y-4">
              {[
                { icon: <Mail size={14} />, value: "ahrenfoundation@gmail.com", href: "mailto:ahrenfoundation@gmail.com" },
                { icon: <Phone size={14} />, value: "+234 806 131 5942", href: "tel:+2348061315942" },
                { icon: <Phone size={14} />, value: "+44 7762 496766", href: "tel:+447762496766" },
                { icon: <Globe size={14} />, value: "Global · 7 Continents", href: null },
              ].map((c, i) => (
                <li key={i}>
                  {c.href ? (
                    <a href={c.href} className="flex items-center gap-3 text-[#8892b0] text-sm hover:text-[#00c9ff] transition-colors">
                      <span className="text-[#00c9ff] flex-shrink-0">{c.icon}</span>
                      {c.value}
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 text-[#8892b0] text-sm">
                      <span className="text-[#00ff9d] flex-shrink-0">{c.icon}</span>
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
          <p className="text-[#8892b0] text-xs">
            © 2026 Ahren Foundation. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "#8892b0" }}>
            Built for the Kingdom ·{" "}
            <span className="grad-text font-semibold">To His Glory</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
