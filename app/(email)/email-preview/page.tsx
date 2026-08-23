import Link from "next/link";
import { BookOpen, Mail } from "lucide-react";
import { getEmailPreviewCatalog } from "@/lib/onboarding/email-preview-catalog";

export const dynamic = "force-dynamic";

export default function EmailPreviewIndexPage() {
  const categories = getEmailPreviewCatalog();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 rounded-2xl border border-white/10 bg-white/[0.04] p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00c9ff]">
            Ahren Foundation
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">
            Email Templates
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Browse every email template from a single index, then open any
            template preview from the catalog below.
          </p>
        </header>

        {categories.map((category) => (
          <section key={category.categoryKey} className="mb-12">
            <div className="mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#00ff9d]" />
              <div>
                <h2 className="text-xl font-bold">{category.title}</h2>
                <p className="text-sm text-slate-400">{category.description}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.templates.map((template) => {
                const Icon = template.templateKey.startsWith("module-")
                  ? BookOpen
                  : Mail;

                return (
                  <Link
                    key={template.templateKey}
                    href={`/email-preview/${category.categoryKey}/${template.templateKey}`}
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
        ))}
      </div>
    </main>
  );
}
