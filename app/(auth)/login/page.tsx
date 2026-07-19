import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, Users, Zap } from "lucide-react";
import { auth } from "@/lib/auth/auth";
import LoginForm from "@/components/auth/login-form";
import { FadeUp, GradientOrb, SectionLabel } from "@/components/ui/custom";
import { headers } from "next/headers";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/dashboard");
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
    <main className="relative overflow-hidden bg-[#080d2e]">
      <section className="relative min-h-screen pt-28 pb-16">
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

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <FadeUp>
              <SectionLabel>Member Access</SectionLabel>
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
                Log in to the{" "}
                <span className="grad-text">Ahren Foundation</span> workspace
              </h1>
            </FadeUp>

            <FadeUp delay={0.08}>
              <p className="max-w-xl text-[17px] leading-relaxed text-[#8892b0]">
                Sign in with Google or your email and password to access private
                community features, member-only updates, and the next layer of
                the platform.
              </p>
            </FadeUp>

            <FadeUp delay={0.16} className="mt-8 grid gap-4 sm:grid-cols-3">
              {benefits.map((item) => (
                <div key={item.title} className="glass rounded-2xl p-4">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl grad-bg text-[#080d2e]">
                    {item.icon}
                  </div>
                  <h2 className="mb-2 text-sm font-bold text-white">
                    {item.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-[#8892b0]">
                    {item.text}
                  </p>
                </div>
              ))}
            </FadeUp>

            <FadeUp
              delay={0.22}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-[rgba(0,201,255,0.16)] px-5 py-3 text-sm font-bold text-[#8892b0] transition-colors hover:text-white"
              >
                Back to home
              </Link>
              <span className="text-sm text-[#8892b0]">
                New here?{" "}
                <Link href="/join" className="grad-text font-bold">
                  Join the community
                </Link>
              </span>
            </FadeUp>
          </div>

          <FadeUp delay={0.12}>
            <div className="relative">
              <div className="absolute -left-6 top-10 hidden h-24 w-24 rounded-full border border-[rgba(0,201,255,0.18)] lg:block" />
              <div className="absolute -right-4 bottom-12 hidden h-16 w-16 rounded-full border border-[rgba(0,255,157,0.18)] lg:block" />
              <LoginForm />
              <div className="mt-4 rounded-2xl border border-[rgba(0,201,255,0.08)] bg-[rgba(17,24,80,0.55)] px-4 py-3 text-xs text-[#8892b0]">
                By signing in you agree to keep the community space respectful
                and aligned with the mission.
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
