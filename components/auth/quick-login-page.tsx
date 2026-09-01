import type { ReactNode } from "react";
import Link from "next/link";
import { ShieldCheck, Users, Zap } from "lucide-react";
import { auth } from "@/lib/auth/auth";
import LoginForm from "@/components/auth/login-form";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FadeUp, GradientOrb, SectionLabel } from "@/components/ui/custom";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import QuickLoginForm from "./quick-login-form";

type LoginPageProps = {
  sectionLabel: string;
  heading: ReactNode;
  description: string;
  homeHref: string;
  newUserHref: string;
  newUserLabel: string;
  callbackURL?: string;
  newUserCallbackURL?: string;
  signedInRedirect?: string;
  note?: string;
  defaultEmail?: string;
  defaultPassword?: string;
};

// Emeke File
export default async function QuickLoginPage({
  sectionLabel,
  heading,
  description,
  homeHref,
  newUserHref,
  newUserLabel,
  callbackURL = "/dashboard",
  newUserCallbackURL = "/training/apply",
  signedInRedirect = "/dashboard",
  note,
  defaultEmail,
  defaultPassword,
}: LoginPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    console.log("User is already signed in:", session.user);
    // redirect(signedInRedirect);
  }

  const benefits = [
    {
      icon: <ShieldCheck size={16} />,
      title: "Secure access",
      text: "Protected with Better Auth and Neon-backed sessions.",
    },
    {
      icon: <Users size={16} />,
      title: "Member tools",
      text: "Gain access to private updates and future community resources.",
    },
    {
      icon: <Zap size={16} />,
      title: "Fast sign-in",
      text: "Use Google or email/password with a polished mobile-friendly flow.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-[#080d2e]">
        <section className="relative min-h-[82vh] pt-28 pb-16">
          <div className="absolute inset-0 grid-bg opacity-40" />
          <GradientOrb
            className="top-[-10%] right-[-8%]"
            size={620}
            color="cyan"
          />
          <GradientOrb
            className="bottom-[-10%] left-[-10%]"
            size={560}
            color="mint"
          />

          <div className="relative z-10 lg:mt-[5vh] mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr]">
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

              <FadeUp
                delay={0.22}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <Link
                  href={homeHref}
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(0,201,255,0.16)] px-5 py-3 text-sm font-bold text-[#8892b0] transition-colors hover:text-white"
                >
                  Back to home
                </Link>
                <span className="text-sm text-[#8892b0]">
                  New here?{" "}
                  <Link href={newUserHref} className="grad-text font-bold">
                    {newUserLabel}
                  </Link>
                </span>
              </FadeUp>
            </div>

            <FadeUp delay={0.12}>
              <div className="relative">
                <div className="absolute -left-6 top-10 hidden h-24 w-24 rounded-full border border-[rgba(0,201,255,0.18)] lg:block" />
                <div className="absolute -right-4 bottom-12 hidden h-16 w-16 rounded-full border border-[rgba(0,255,157,0.18)] lg:block" />
                <QuickLoginForm
                  callbackURL={callbackURL}
                  newUserCallbackURL={newUserCallbackURL}
                  newUserLabel={newUserLabel}
                  note={note}
                  defaultEmail={defaultEmail}
                  defaultPassword={defaultPassword}
                />
                <div className="mt-4 rounded-2xl border border-[rgba(0,201,255,0.08)] bg-[rgba(17,24,80,0.55)] px-4 py-3 text-xs text-[#8892b0]">
                  By signing in you agree to keep the community space respectful
                  and aligned with the mission.
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        <section className="border-t border-[rgba(0,201,255,0.08)] bg-[#0d1340]">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="flex flex-col gap-5 rounded-3xl border border-[rgba(0,201,255,0.12)] bg-[linear-gradient(135deg,rgba(0,201,255,0.08),rgba(0,255,157,0.06))] p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                  Need help choosing?
                </p>
                <h2
                  className="mt-2 text-2xl font-bold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Use the route that matches your role
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#8892b0]">
                  Members should log in at the member portal, while mentors can
                  use the mentor login to access the same workspace with the
                  right journey context.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/hub/login"
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-[#080d2e] transition-transform hover:scale-[1.02]"
                >
                  Member Login
                </Link>
                <Link
                  href="/mentor/login"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  Mentor Login
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
