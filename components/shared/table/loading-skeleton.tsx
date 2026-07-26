"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface TableLoadingSkeletonProps {
  columnCount: number;
  rowCount?: number;
  className?: string;
}

const widths = ["w-16", "w-24", "w-32", "w-48"] as const;

export function TableLoadingSkeleton({
  columnCount,
  rowCount = 10,
  className,
}: TableLoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className={cn("hover:bg-transparent", className)}>
          {Array.from({ length: columnCount }).map((_, cellIndex) => (
            <TableCell key={cellIndex} className="py-4">
              <div className={cn("h-4 animate-pulse rounded bg-muted", widths[cellIndex % widths.length])} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
