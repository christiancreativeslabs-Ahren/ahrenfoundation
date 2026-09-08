"use client";

import { PdfDocument } from "@/features/admin/resources/list/_components/pdf-document";

export function ResourcePdfViewerClient({
  resourceId,
  title,
}: {
  resourceId: string;
  title: string;
}) {
  const fileUrl = `/api/resources/view/${resourceId}`;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a122e]">
      <PdfDocument fileUrl={fileUrl} title={title} />
    </div>
  );
}
