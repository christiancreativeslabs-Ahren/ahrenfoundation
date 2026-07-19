"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  Mail,
  LayoutDashboard,
  LineChart,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import SignOutButton from "@/components/auth/sign-out-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/join-applications",
    label: "Join applications",
    icon: ClipboardList,
  },
  {
    href: "/admin/onboarding",
    label: "Onboarding",
    icon: LineChart,
  },
  {
    href: "/admin/email-events",
    label: "Email events",
    icon: Mail,
  },
  {
    href: "/admin/engagement",
    label: "Engagement",
    icon: ScrollText,
  },
  {
    href: "/admin/module-submissions",
    label: "Module submissions",
    icon: BookOpen,
  },
  {
    href: "/admin/content",
    label: "Content",
    icon: BookOpen,
  },
];

export default function AdminShell({
  children,
  email,
}: {
  children: ReactNode;
  email?: string | null;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        collapsible="icon"
        className="border-r border-cyan-400/10 bg-[#091033] text-white [&_[data-sidebar=sidebar]]:bg-[#091033] [&_[data-sidebar=sidebar]]:text-[#e8eeff]"
      >
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00c9ff] to-[#00ff9d] text-[#080d2e]">
              <ShieldCheck size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Admin console
              </p>
              <h2 className="truncate text-sm font-semibold text-white">
                Ahren Foundation
              </h2>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 pb-3">
          <SidebarGroup>
            <SidebarGroupLabel className="text-[#e8eeff]/70">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={active}
                        className={
                          active
                            ? "bg-gradient-to-r from-[#00c9ff]/20 to-[#00ff9d]/15 text-white shadow-[inset_3px_0_0_#00ff9d]"
                            : "text-[#c5d5e8] hover:bg-cyan-400/10 hover:text-white"
                        }
                      >
                        <Icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="my-4 bg-white/10" />

          <SidebarGroup>
            <SidebarGroupLabel className="text-[#e8eeff]/70">
              Quick note
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="rounded-2xl border border-cyan-400/10 bg-[#111850]/80 p-4 text-sm leading-relaxed text-[#c5d5e8]">
                Review applicants, monitor onboarding delivery health, and keep
                the new module engine moving cleanly.
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-cyan-400/10 bg-[#091033] p-4">
          <div className="space-y-3 rounded-2xl border border-cyan-400/10 bg-[#111850]/80 p-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Signed in as
              </p>
              <p className="mt-1 truncate text-sm font-medium text-white">
                {email ?? "Admin"}
              </p>
            </div>
            <SignOutButton className="w-full justify-center rounded-2xl" />
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="bg-[#080d2e]">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/10 bg-[#080d2e]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <SidebarTrigger className="text-white" />
            <div className="h-6 w-px bg-white/10" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Admin area
              </p>
              <p className="truncate text-sm font-semibold text-white">
                Manage join applications and admin activity
              </p>
            </div>
          </header>

          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
