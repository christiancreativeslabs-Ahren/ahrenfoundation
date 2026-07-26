"use client";

import { Badge } from "@/components/ui/badge";
import type { CommunityPostListRow } from "@/lib/admin/community-posts";
import { communityPostStatusVariant, formatCommunityPostStatus } from "./community-post.columns";

export function CommunityPostCard({ post }: { post: CommunityPostListRow }) {
  return (
    <div className="group overflow-hidden rounded-sm border border-border bg-background transition-all hover:border-primary/40 hover:shadow-sm">
      <div className="space-y-2 bg-muted/40 px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-base font-semibold leading-5">{post.body}</h3>
          <Badge variant={communityPostStatusVariant(post.status)} className="shrink-0 whitespace-nowrap">
            {formatCommunityPostStatus(post.status)}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border px-2 py-0.5">{post.channel}</span>
          <span className="rounded-full border px-2 py-0.5">
            {post.authorName || post.memberName || "Anonymous"}
          </span>
        </div>
      </div>

      <div className="space-y-3 px-4 py-4">
        <div className="text-xs text-muted-foreground">
          {new Intl.DateTimeFormat("en-NG", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(post.createdAt))}
        </div>
        <div className="text-xs text-muted-foreground">
          {post.authorEmail || post.memberEmail || "No author email"}
        </div>
      </div>
    </div>
  );
}
