"use client";

import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { ProjectShowcaseListRow } from "@/lib/admin/project-showcases";
import { cn } from "@/lib/utils";
import { formatProjectShowcaseStatus, projectShowcaseStatusVariant } from "./project-showcase.columns";

export function ProjectShowcaseCard({ project }: { project: ProjectShowcaseListRow }) {
  return (
    <div className="group overflow-hidden rounded-sm border border-border bg-background transition-all hover:border-primary/40 hover:shadow-sm">
      <div className="space-y-2 bg-muted/40 px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-base font-semibold leading-5">{project.title}</h3>
          <Badge variant={projectShowcaseStatusVariant(project.status)} className="shrink-0 whitespace-nowrap">
            {formatProjectShowcaseStatus(project.status)}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border px-2 py-0.5">
            {project.memberName || project.authorName || "Unknown"}
          </span>
          {project.projectUrl ? <span className="rounded-full border px-2 py-0.5">Has URL</span> : null}
        </div>
      </div>
      <div className="space-y-3 px-4 py-4">
        <p className="line-clamp-3 text-sm text-muted-foreground">{project.summary}</p>
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            {new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(project.createdAt))}
          </div>
          {project.projectUrl ? (
            <a
              href={project.projectUrl}
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
