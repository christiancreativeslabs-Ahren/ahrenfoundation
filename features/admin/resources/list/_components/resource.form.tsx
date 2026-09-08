"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input-fields";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createResource } from "../../_actions/create-resource";

export function ResourceForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [audience, setAudience] = useState<"all" | "youth" | "mentor">("all");
  const [category, setCategory] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setUploading(true);

    try {
      let url: string | null = externalUrl.trim() || null;
      let fileName: string | null = null;
      let contentType: string | null = null;
      let sizeBytes: number | null = null;
      let blobPathname: string | null = null;

      if (file) {
        const blob = await upload(`resources/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
        });

        url = blob.url;
        fileName = file.name;
        contentType = blob.contentType ?? file.type;
        sizeBytes = file.size;
        blobPathname = blob.pathname;
      }

      if (!url) {
        throw new Error("Provide either a file or an external URL");
      }

      await createResource({
        title,
        summary: summary || null,
        audience,
        category,
        isPublished,
        url,
        fileName,
        contentType,
        sizeBytes,
        blobPathname,
      });

      router.push("/admin/resources");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create resource",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <TextInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Summary</label>
        <TextInput
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Audience</label>
        <Select
          value={audience}
          onValueChange={(v) => setAudience(v as "all" | "youth" | "mentor")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="youth">Youth</SelectItem>
            <SelectItem value="mentor">Mentor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <TextInput
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Books, templates, links..."
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">File (PDF, image, doc…)</label>
        <input
          type="file"
          accept=".pdf,image/*,.doc,.docx,.xls,.xlsx,.txt,.zip"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-sm file:text-white"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Or external URL</label>
        <TextInput
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
        />
        <label htmlFor="published" className="text-sm">
          Publish immediately
        </label>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <Button type="submit" disabled={uploading}>
        {uploading ? "Uploading…" : "Create resource"}
      </Button>
    </form>
  );
}
