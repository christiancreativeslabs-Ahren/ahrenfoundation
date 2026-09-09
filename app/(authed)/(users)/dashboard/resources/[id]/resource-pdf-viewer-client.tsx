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

  return <PdfDocument fileUrl={fileUrl} title={title} />;
}
