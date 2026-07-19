"use client";

import Link from "next/link";
import { LogIn, LayoutDashboard, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import SignOutButton from "@/components/auth/sign-out-button";

export default function AuthActions({ mobile = false }: { mobile?: boolean }) {
  const session = authClient.useSession();
  const isAuthed = Boolean(session.data?.user);

  const containerClass = mobile
    ? "flex flex-col gap-3"
    : "flex items-center gap-3";

  const linkBase =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200";

  const outlineClass = "text-[#8892b0] hover:text-white";

  const solidStyle = {
    background: "linear-gradient(135deg, #00c9ff 0%, #00ff9d 100%)",
    color: "#080d2e",
  };

  if (isAuthed) {
    return (
      <div className={containerClass}>
        <Link
          href="/dashboard"
          className={`${linkBase} ${mobile ? "w-full" : ""}`}
          style={solidStyle}
        >
          <LayoutDashboard size={14} />
          Dashboard
        </Link>
        <div className={mobile ? "w-full" : ""}>
          <SignOutButton className={mobile ? "w-full" : ""} />
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <Link
        href="/login"
        className={`${linkBase} ${outlineClass} ${mobile ? "w-full" : ""}`}
        style={{ border: "1px solid rgba(0,201,255,0.15)" }}
      >
        <LogIn size={14} />
        Log in
      </Link>
      <Link
        href="/join"
        className={`${linkBase} ${mobile ? "w-full" : ""}`}
        style={solidStyle}
      >
        <Sparkles size={14} />
        Join Us
      </Link>
    </div>
  );
}
