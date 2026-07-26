"use client";

import { X, Trash2, Archive, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  onExport?: () => void;
  onEmail?: () => void;
}

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onDelete,
  onArchive,
  onExport,
  onEmail,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 min-w-[32px] items-center justify-center rounded-full bg-primary px-2 text-sm font-semibold text-primary-foreground">
          {selectedCount}
        </div>
        <span className="text-sm font-medium">
          {selectedCount === 1 ? "item selected" : "items selected"}
        </span>
        <div className="flex items-center gap-2">
          {onDelete ? (
            <Button variant="outline" size="sm" onClick={onDelete} className="h-8">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          ) : null}
          {onArchive ? (
            <Button variant="outline" size="sm" onClick={onArchive} className="h-8">
              <Archive className="h-4 w-4" />
              Archive
            </Button>
          ) : null}
          {onExport ? (
            <Button variant="outline" size="sm" onClick={onExport} className="h-8">
              <Download className="h-4 w-4" />
              Export
            </Button>
          ) : null}
          {onEmail ? (
            <Button variant="outline" size="sm" onClick={onEmail} className="h-8">
              <Mail className="h-4 w-4" />
              Email
            </Button>
          ) : null}
        </div>
      </div>

      <Button variant="ghost" size="sm" onClick={onClearSelection} className="h-8">
        <X className="h-4 w-4" />
        Clear
      </Button>
    </div>
  );
}
