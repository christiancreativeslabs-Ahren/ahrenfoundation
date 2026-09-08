"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  deleteResourceAction,
  setResourcePublishedAction,
} from "../../_actions/resource-actions";

const ResourcePdfViewer = dynamic(
  () => import("./resource-pdf-viewer").then((mod) => mod.ResourcePdfViewer),
  { ssr: false },
);

function isPdfUrl(url: string | null | undefined) {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower.endsWith(".pdf") || lower.includes(".pdf?");
}

export function ResourceRowActions({
  resourceId,
  title,
  url,
  isPublished,
}: {
  resourceId: string;
  title: string;
  url: string | null;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const isPdf = isPdfUrl(url);

  function run(
    action: () => Promise<{ ok: boolean; message: string }>,
    confirmMessage?: string,
  ) {
    if (confirmMessage && !window.confirm(confirmMessage)) return;

    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1">
          {isPdf ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-[#00c9ff] hover:bg-white/10"
              title="View PDF"
              onClick={() => setViewerOpen(true)}
            >
              <FileText className="h-4 w-4" />
            </Button>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-[#e8eeff] hover:bg-white/10"
            disabled={pending}
            title={isPublished ? "Unpublish" : "Publish"}
            onClick={() =>
              run(() => setResourcePublishedAction(resourceId, !isPublished))
            }
          >
            {isPublished ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-red-300 hover:bg-red-500/10 hover:text-red-200"
            disabled={pending}
            title="Delete"
            onClick={() =>
              run(
                () => deleteResourceAction(resourceId),
                "Delete this resource? This cannot be undone.",
              )
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        {error ? <p className="text-xs text-red-400">{error}</p> : null}
      </div>

      {isPdf ? (
        <ResourcePdfViewer
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          resourceId={resourceId}
          title={title}
        />
      ) : null}
    </>
  );
}
