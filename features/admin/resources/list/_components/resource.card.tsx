"use client";

import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { ResourceListRow } from "@/lib/admin/resources";
import { cn } from "@/lib/utils";
import { formatResourceStatus, resourceStatusVariant } from "./resource.columns";

export function ResourceCard({
  resource,
}: {
  resource: ResourceListRow;
}) {
  return (
    <div className="group overflow-hidden rounded-sm border border-border bg-background transition-all hover:border-primary/40 hover:shadow-sm">
      <div className="space-y-2 bg-muted/40 px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-base font-semibold leading-5">{resource.title}</h3>
          <Badge variant={resourceStatusVariant(resource.isPublished)} className="shrink-0 whitespace-nowrap">
            {formatResourceStatus(resource.isPublished)}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border px-2 py-0.5 capitalize">{resource.audience}</span>
          <span className="rounded-full border px-2 py-0.5">{resource.category}</span>
        </div>
      </div>

      <div className="space-y-3 px-4 py-4">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {resource.summary || "No summary provided"}
        </p>
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            {new Intl.DateTimeFormat("en-NG", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(resource.createdAt))}
          </div>
          {resource.url ? (
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8")}
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
