import Link from "next/link";
import { BookOpenCheck, CalendarDays, ClipboardList, LayoutDashboard, Users } from "lucide-react";

const items = [
  { href: "/mentor/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/mentor/mentees", label: "Mentees", icon: Users },
  { href: "/mentor/submissions", label: "Reviews", icon: ClipboardList },
  { href: "/mentor/sessions", label: "Sessions", icon: CalendarDays },
];

export function MentorWorkspaceNav() {
  return (
    <nav className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white"
          >
            <Icon size={15} />
            {item.label}
          </Link>
        );
      })}
      <Link
        href="/dashboard/workbook"
        className="ml-auto inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-[#00ff9d] hover:bg-white/10"
      >
        <BookOpenCheck size={15} />
        Workbook Context
      </Link>
    </nav>
  );
}
