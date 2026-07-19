import Link from "next/link";
import { BookOpen, Mail } from "lucide-react";
import { getOnboardingPreviewTemplates } from "@/lib/onboarding/email-shared";

export const dynamic = "force-dynamic";

export default function EmailPreviewIndexPage() {
  const templates = getOnboardingPreviewTemplates();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00c9ff]">
            Ahren Foundation
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">
            Email Previews
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Preview onboarding emails, welcome emails, and all dynamic module
            templates.
          </p>
        </header>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#00ff9d]" />
            <h2 className="text-xl font-bold">Onboarding</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => {
              const Icon = template.templateKey.startsWith("module-")
                ? BookOpen
                : Mail;

              return (
                <Link
                  key={template.templateKey}
                  href={`/email-preview/onboarding/${template.templateKey}`}
                  className="group rounded-lg border border-white/10 bg-white/[0.04] p-5 transition hover:border-[#00c9ff]/45 hover:bg-white/[0.07]"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-[#00c9ff]/10 p-3 text-[#00c9ff] transition group-hover:bg-[#00ff9d]/10 group-hover:text-[#00ff9d]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {template.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {template.description}
                  </p>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-[#00c9ff]">
                    {template.templateKey}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
