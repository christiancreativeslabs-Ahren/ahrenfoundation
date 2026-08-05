"use client";

import { Badge } from "@/components/ui/badge";
import type { CommunityPostListRow } from "@/lib/admin/community-posts";
import { communityPostStatusVariant, formatCommunityPostStatus } from "./community-post.columns";

export function CommunityPostCard({ post }: { post: CommunityPostListRow }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-all hover:border-[#00c9ff]/30 hover:shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
      <div className="space-y-2 border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-base font-semibold leading-5 tracking-tight text-white group-hover:text-[#00ff9d]">
            {post.body}
          </h3>
          <Badge
            variant={communityPostStatusVariant(post.status)}
            className={`shrink-0 whitespace-nowrap ${
              post.status === "published"
                ? "bg-[#00ff9d]/15 text-[#00ff9d]"
                : post.status === "hidden"
                  ? "bg-[#00c9ff]/15 text-[#00c9ff]"
                  : "border-white/10 bg-white/[0.04] text-[#e8eeff]"
            }`}
          >
            {formatCommunityPostStatus(post.status)}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/15 bg-[#00c9ff]/10 px-2 py-0.5 text-[#00c9ff]">
            {post.channel}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[#e8eeff]">
            {post.authorName || post.memberName || "Anonymous"}
          </span>
        </div>
      </div>

      <div className="space-y-3 px-4 py-4">
        <div className="text-xs text-[#8892b0]">
          {new Intl.DateTimeFormat("en-NG", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(post.createdAt))}
        </div>
        <div className="text-xs text-[#8892b0]">
          {post.authorEmail || post.memberEmail || "No author email"}
        </div>
      </div>
    </div>
  );
}
