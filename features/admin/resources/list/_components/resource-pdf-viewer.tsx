"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceId: string;
  title: string;
};

const PdfDocument = dynamic(
  async () => (await import("./pdf-document")).PdfDocument,
  {
    ssr: false,
    loading: () => (
      <div className="py-20 text-slate-400">Loading PDF viewer…</div>
    ),
  },
);

export function ResourcePdfViewer({
  open,
  onOpenChange,
  resourceId,
  title,
}: Props) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.1);

  // const fileUrl = `/api/resources/view/${resourceId}`;
  const fileUrl = `/api/resources/view/${resourceId}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex h-fit max-w-5xl md:min-w-[890px] flex-col gap-0 overflow-hidden border-white/10 bg-[#07102c] p-0 text-white"
        onContextMenu={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex flex-row items-center justify-between border-b border-white/10 px-4 py-3">
          <DialogTitle className="truncate text-base font-semibold">
            {title}
          </DialogTitle>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setScale((s) => Math.max(0.6, s - 0.15))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>

            <span className="w-12 text-center text-xs text-slate-300">
              {Math.round(scale * 100)}%
            </span>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setScale((s) => Math.min(2.5, s + 0.15))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="relative flex-1 overflow-auto bg-[#0a122e]">
          <div className="flex justify-center p-4">
            <PdfDocument
              fileUrl={fileUrl}
              title={title}
              // scale={scale}
              // onLoadSuccess={({ numPages: pages }) => {
              //   setNumPages(pages);
              //   setPageNumber(1);
              // }}
            />
          </div>
        </div>

        {numPages > 0 && (
          <div className="flex items-center justify-center gap-4 border-t border-white/10 py-3">
            <Button
              variant="outline"
              size="sm"
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber((p) => p - 1)}
              className="border-white/15 bg-transparent"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Prev
            </Button>

            <span className="text-sm text-slate-300">
              Page {pageNumber} of {numPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber((p) => p + 1)}
              className="border-white/15 bg-transparent"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
