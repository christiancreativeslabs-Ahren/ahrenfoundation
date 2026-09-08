"use client";

import { useState } from "react";

type PdfDocumentProps = {
  fileUrl: string;
  title: string;
};

export function PdfDocument({ fileUrl, title }: PdfDocumentProps) {
  const [loaded, setLoaded] = useState(false);
  const pdfUrl = `${fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

  return (
    <div className="relative h-[min(70vh,640px)] w-full">
      {!loaded ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-md border border-white/10 bg-[#0a122e]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#00c9ff]" />
          <p className="text-sm text-slate-400">Loading PDF…</p>
        </div>
      ) : null}

      <iframe
        src={pdfUrl}
        title={title || "PDF preview"}
        // onLoad={() => setLoaded(true)}
        onLoad={() => {
          // optional polish — not a real browser event
          window.setTimeout(() => setLoaded(true), 35000);
        }}
        className={`h-full w-full rounded-md border border-white/10 bg-white transition-opacity duration-200 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
