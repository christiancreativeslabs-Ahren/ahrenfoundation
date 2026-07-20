"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { NAV_LINKS } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Split nav: left links + right CTA
  const mainLinks = NAV_LINKS;

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-nav py-2.5" : "bg-transparent py-4"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-5 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <motion.div whileHover={{ scale: 1.05, rotate: 2 }} transition={{ type: "spring", stiffness: 400 }}>
              <Image
                src="/assets/logo-icon-color.png"
                alt="Ahren Foundation"
                width={34}
                height={34}
                className="rounded-xl"
              />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-white text-[14px] tracking-tight" style={{ fontFamily: "var(--font-display, Syne, sans-serif)" }}>
                Ahren Foundation
              </span>
              <span className="text-[9px] grad-text font-semibold tracking-widest uppercase hidden sm:block">
                Faith · Tech · Purpose
              </span>
            </div>
          </Link>

          {/* Desktop nav — scrollable horizontally if needed */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {mainLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <motion.span
                    whileHover={{ color: "#00c9ff" }}
                    className={`relative px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-200 cursor-pointer block whitespace-nowrap ${
                      active ? "text-[#00c9ff]" : "text-[#8892b0]"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {link.label}
                    {active && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: "rgba(0,201,255,0.08)" }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.span>
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            <Link href="/apply">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(0,201,255,0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="grad-bg text-[#080d2e] font-bold text-[13px] px-5 py-2.5 rounded-full transition-all duration-200"
              >
                Join Us
              </motion.button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-white p-2 flex-shrink-0"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col pt-20 px-6 pb-10 lg:hidden overflow-y-auto"
            style={{ background: "rgba(8,13,46,0.98)", backdropFilter: "blur(24px)" }}
          >
            <div className="flex flex-col gap-1 flex-1">
              {mainLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center justify-between py-4 text-lg font-semibold border-b transition-colors ${
                      pathname === link.href ? "grad-text border-[rgba(0,201,255,0.2)]" : "text-[#8892b0] border-[rgba(0,201,255,0.06)]"
                    }`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {link.label}
                    {pathname === link.href && (
                      <span className="w-2 h-2 rounded-full grad-bg" />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mainLinks.length * 0.05 + 0.1 }}
              className="mt-8 space-y-3"
            >
              <Link href="/apply">
                <button className="grad-bg text-[#080d2e] font-bold text-base w-full py-4 rounded-2xl">
                  Join the Community
                </button>
              </Link>
              <Link href="/contact">
                <button
                  className="w-full py-4 rounded-2xl font-bold text-sm text-[#8892b0] transition-colors"
                  style={{ border: "1px solid rgba(0,201,255,0.15)" }}
                >
                  Contact Us
                </button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
