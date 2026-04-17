"use client";

import { useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-[2px] grad-bg rounded-full" />
      <span className="text-[11px] font-bold tracking-[0.18em] uppercase grad-text">
        {children}
      </span>
    </div>
  );
}

export function GlowButton({
  children,
  onClick,
  outline = false,
  className = "",
  href,
}: {
  children: ReactNode;
  onClick?: () => void;
  outline?: boolean;
  className?: string;
  href?: string;
}) {
  const base = `inline-flex items-center justify-center gap-2 font-bold text-sm rounded-full px-7 py-3.5 transition-all duration-200 cursor-pointer ${className}`;

  const solidStyle = {
    background: "linear-gradient(135deg, #00c9ff 0%, #00ff9d 100%)",
    color: "#080d2e",
  };
  const outlineStyle = {
    background: "transparent",
    border: "1.5px solid #00c9ff",
    color: "#00c9ff",
  };

  if (href) {
    return (
      <a href={href}>
        <motion.span
          whileHover={{
            scale: 1.04,
            boxShadow: outline
              ? "0 0 28px rgba(0,201,255,0.25)"
              : "0 0 40px rgba(0,201,255,0.4)",
          }}
          whileTap={{ scale: 0.97 }}
          className={base}
          style={outline ? outlineStyle : solidStyle}
        >
          {children}
        </motion.span>
      </a>
    );
  }

  return (
    <motion.button
      whileHover={{
        scale: 1.04,
        boxShadow: outline
          ? "0 0 28px rgba(0,201,255,0.25)"
          : "0 0 40px rgba(0,201,255,0.4)",
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={base}
      style={outline ? outlineStyle : solidStyle}
    >
      {children}
    </motion.button>
  );
}

export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerParent({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerChild({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GradientOrb({
  className = "",
  color = "cyan",
  size = 400,
}: {
  className?: string;
  color?: "cyan" | "mint";
  size?: number;
}) {
  const c = color === "cyan" ? "rgba(0,201,255,0.08)" : "rgba(0,255,157,0.07)";
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${c} 0%, transparent 70%)`,
        filter: "blur(60px)",
      }}
    />
  );
}
