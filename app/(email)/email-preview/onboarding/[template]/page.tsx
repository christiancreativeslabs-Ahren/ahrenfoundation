import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { renderOnboardingPreviewTemplate } from "@/lib/onboarding/email-renderer";

export const dynamic = "force-dynamic";

export default async function OnboardingEmailPreviewPage({
  params,
}: {
  params: Promise<{ template: string }>;
}) {
  const { template } = await params;
  const rendered = renderOnboardingPreviewTemplate(template);

  if (!rendered) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/email-preview"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#00ff9d] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to previews
            </Link>
            <h1 className="mt-3 text-2xl font-bold">{rendered.subject}</h1>
            <p className="mt-2 text-sm text-slate-400">
              Template key: {rendered.templateKey}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10 bg-white">
          <iframe
            srcDoc={rendered.html}
            title={`Email preview: ${template}`}
            className="h-[900px] w-full border-0 bg-white"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </main>
  );
}
