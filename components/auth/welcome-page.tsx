import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { joinApplications, programMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FadeUp, GradientOrb, SectionLabel } from "@/components/ui/custom";

type WelcomePageProps = {
  sectionLabel: string;
  heading: ReactNode;
  description: string;
  ctaHref: string;
  ctaLabel: string;
  expectedRole: "youth" | "mentor";
  fallbackLoginHref: string;
};

function valueOrDash(value: string | null | undefined) {
  return value && value.trim() ? value : "-";
}

export default async function WelcomePage({
  sectionLabel,
  heading,
  description,
  ctaHref,
  ctaLabel,
  expectedRole,
  fallbackLoginHref,
}: WelcomePageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect(fallbackLoginHref);
  }

  const [member] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.email, session.user.email))
    .limit(1);

  if (!member || member.role !== expectedRole) {
    redirect(fallbackLoginHref);
  }

  const [application] = await db
    .select()
    .from(joinApplications)
    .where(eq(joinApplications.id, member.joinApplicationId))
    .limit(1);

  const roleLabel = member.role === "mentor" ? "Mentor" : "Creative Youth";
  const phoneNumber = application?.phoneNumber ?? "-";

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-[#080d2e]">
        <section className="relative min-h-screen pt-28 pb-16">
          <div className="absolute inset-0 grid-bg opacity-40" />
          <GradientOrb className="top-[-10%] right-[-8%]" size={620} color="cyan" />
          <GradientOrb className="bottom-[-10%] left-[-10%]" size={560} color="mint" />

          <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="max-w-2xl">
              <FadeUp>
                <SectionLabel>{sectionLabel}</SectionLabel>
                <h1
                  className="font-display mb-6 text-white"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(42px, 6vw, 78px)",
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {heading}
                </h1>
              </FadeUp>

              <FadeUp delay={0.08}>
                <p className="max-w-xl text-[17px] leading-relaxed text-[#8892b0]">
                  {description}
                </p>
              </FadeUp>

              <FadeUp delay={0.16} className="mt-8">
                <div className="rounded-3xl border border-[rgba(0,201,255,0.12)] bg-[rgba(17,24,80,0.6)] p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                    Welcome back
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                    Your access is active
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#8892b0]">
                    {roleLabel} access only. We are showing your identity and contact details for now.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={ctaHref}
                      className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-[#080d2e] transition-transform hover:scale-[1.02]"
                    >
                      {ctaLabel}
                    </Link>
                  </div>
                </div>
              </FadeUp>
            </div>

            <FadeUp delay={0.12}>
              <div className="rounded-[28px] border border-[rgba(0,201,255,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(17,24,80,0.72))] p-6 sm:p-8">
                <div className="mb-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00ff9d]">
                    Contact Details
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                    {valueOrDash(member.fullName)}
                  </h2>
                  <p className="mt-2 text-sm text-[#8892b0]">
                    Role: <span className="text-white">{roleLabel}</span>
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-2xl border border-[rgba(0,201,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                      Email Address
                    </p>
                    <p className="mt-2 text-sm text-white">{valueOrDash(member.email)}</p>
                  </div>

                  <div className="rounded-2xl border border-[rgba(0,201,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                      Phone Number
                    </p>
                    <p className="mt-2 text-sm text-white">{valueOrDash(phoneNumber)}</p>
                  </div>

                  <div className="rounded-2xl border border-[rgba(0,201,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                      User Role
                    </p>
                    <p className="mt-2 text-sm text-white">{valueOrDash(member.role)}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-[rgba(0,201,255,0.08)] bg-[rgba(0,201,255,0.06)] p-4 text-sm leading-relaxed text-[#8892b0]">
                  {description}
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
