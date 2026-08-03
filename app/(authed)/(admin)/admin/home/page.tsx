import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth/auth";
import { getAdminEmails } from "@/lib/validations/join";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email || !getAdminEmails().includes(session.user.email)) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
            Admin home
          </p>
          <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome, <span className="text-[#00ff9d]">{session.user.name || "admin"}</span>
          </CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-relaxed text-slate-300">
            This is a lightweight placeholder admin landing page. It is here so
            we can confirm admin auth and routing before returning to the full
            dashboard experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00c9ff] to-[#00ff9d] text-[#080d2e]">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Signed in as
              </p>
              <p className="text-sm font-semibold text-white">{session.user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/join-applications"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#080d2e]"
            >
              Open join applications
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white"
            >
              Try dashboard
              <Sparkles size={14} />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
