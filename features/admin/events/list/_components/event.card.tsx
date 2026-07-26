"use client";

import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { EventListRow } from "@/lib/admin/events";
import { cn } from "@/lib/utils";
import { eventStatusVariant, formatEventStatus } from "./event.columns";

export function EventCard({ event }: { event: EventListRow }) {
  return (
    <div className="group overflow-hidden rounded-sm border border-border bg-background transition-all hover:border-primary/40 hover:shadow-sm">
      <div className="space-y-2 bg-muted/40 px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-base font-semibold leading-5">{event.title}</h3>
          <Badge variant={eventStatusVariant(event.status)} className="shrink-0 whitespace-nowrap">
            {formatEventStatus(event.status)}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border px-2 py-0.5 capitalize">{event.audience}</span>
          <span className="rounded-full border px-2 py-0.5">
            {new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(
              new Date(event.startsAt),
            )}
          </span>
        </div>
      </div>

      <div className="space-y-3 px-4 py-4">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {event.summary || "No summary provided"}
        </p>
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">{event.location || "No location"}</div>
          {event.meetingUrl ? (
            <a
              href={event.meetingUrl}
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
