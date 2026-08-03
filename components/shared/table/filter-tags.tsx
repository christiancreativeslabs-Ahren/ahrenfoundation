"use client";

import { XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FilterTag {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}

interface FilterTagsProps {
  tags: FilterTag[];
  onClearAll: () => void;
}

export function FilterTags({ tags, onClearAll }: FilterTagsProps) {
  if (tags.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      {tags.map((tag) => (
        <Badge
          key={tag.key}
          variant="secondary"
          className="gap-1 border border-cyan-400/15 bg-[#00c9ff]/10 text-[#00c9ff]"
        >
          <span>
            {tag.label}: {tag.value}
          </span>
          <button type="button" onClick={tag.onRemove} className="inline-flex">
            <XCircle size={14} />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-8 border border-white/10 px-3 text-xs text-white hover:bg-white/[0.08] hover:text-white"
      >
        Clear All
      </Button>
    </div>
  );
}
