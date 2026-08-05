"use client";

import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { OpportunityListRow } from "@/lib/admin/opportunities";
import { cn } from "@/lib/utils";
import { formatOpportunityStatus, opportunityStatusVariant } from "./opportunity.columns";

export function OpportunityCard({ opportunity }: { opportunity: OpportunityListRow }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-all hover:border-[#00c9ff]/30 hover:shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
      <div className="space-y-2 border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-base font-semibold leading-5 tracking-tight text-white group-hover:text-[#00ff9d]">
            {opportunity.title}
          </h3>
          <Badge
            variant={opportunityStatusVariant(opportunity.status)}
            className={`shrink-0 whitespace-nowrap ${
              opportunity.status === "published"
                ? "bg-[#00ff9d]/15 text-[#00ff9d]"
                : "border-white/10 bg-white/[0.04] text-[#e8eeff]"
            }`}
          >
            {formatOpportunityStatus(opportunity.status)}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/15 bg-[#00c9ff]/10 px-2 py-0.5 capitalize text-[#00c9ff]">
            {opportunity.audience}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[#e8eeff]">
            {opportunity.type}
          </span>
        </div>
      </div>

      <div className="space-y-3 px-4 py-4">
        <p className="line-clamp-3 text-sm leading-6 text-[#8892b0]">
          {opportunity.summary || "No summary provided"}
        </p>
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-[#8892b0]">
            {new Intl.DateTimeFormat("en-NG", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(opportunity.createdAt))}
          </div>
            {opportunity.url ? (
            <a
              href={opportunity.url}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-8 border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]",
              )}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
