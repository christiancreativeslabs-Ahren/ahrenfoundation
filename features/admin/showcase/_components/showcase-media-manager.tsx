"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  addShowcaseMediaAction,
  deleteShowcaseMediaAction,
} from "../_actions/showcase-media-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type ShowcaseMediaRow = {
  id: string;
  mediaKind: string;
  url: string;
  caption: string | null;
  sortOrder: number;
};

export function ShowcaseMediaManager({
  itemId,
  media,
}: {
  itemId: string;
  media: ShowcaseMediaRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [mediaKind, setMediaKind] = useState("image");
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  function refresh(result: { ok: boolean; message: string }) {
    setMessage(result.message);
    if (result.ok) {
      setUrl("");
      setCaption("");
      router.refresh();
    }
  }

  return (
    <Card className="border-white/10 bg-white/[0.03] text-white">
      <CardHeader>
        <CardTitle className="text-lg">Media</CardTitle>
        <CardDescription className="text-slate-300">
          Attach images, audio, YouTube videos, or external links (podcast,
          demo, repo).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form
          className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:grid-cols-2"
          action={(formData) => {
            startTransition(async () => {
              const result = await addShowcaseMediaAction(formData);
              refresh(result);
            });
          }}
        >
          <input type="hidden" name="item_id" value={itemId} />

          <label className="space-y-2">
            <span className="text-sm text-slate-200">Type</span>
            <select
              name="media_kind"
              value={mediaKind}
              onChange={(e) => setMediaKind(e.target.value)}
              className="flex h-11 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
            >
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="youtube">YouTube</option>
              <option value="link">Link</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-200">Sort order</span>
            <Input
              name="sort_order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="h-11 border-white/10 bg-white/[0.04] text-white"
            />
          </label>

          {mediaKind === "image" || mediaKind === "audio" ? (
            <label className="space-y-2 lg:col-span-2">
              <span className="text-sm text-slate-200">Upload file</span>
              <Input
                type="file"
                name="file"
                accept={mediaKind === "image" ? "image/*" : "audio/*"}
                className="border-white/10 bg-white/[0.04] text-white file:text-white"
              />
            </label>
          ) : null}

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm text-slate-200">
              {mediaKind === "youtube"
                ? "YouTube URL"
                : mediaKind === "link"
                  ? "External URL"
                  : "Or paste URL"}
            </span>
            <Input
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://"
              className="h-11 border-white/10 bg-white/[0.04] text-white"
            />
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm text-slate-200">Caption / label</span>
            <Input
              name="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="h-11 border-white/10 bg-white/[0.04] text-white"
            />
          </label>

          <div className="lg:col-span-2">
            <Button
              type="submit"
              disabled={pending}
              className="gap-2 bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]"
            >
              <Plus className="h-4 w-4" />
              {pending ? "Adding…" : "Add media"}
            </Button>
          </div>
        </form>

        {message ? <p className="text-sm text-slate-300">{message}</p> : null}

        <div className="space-y-3">
          {media.length === 0 ? (
            <p className="text-sm text-slate-400">No media attached yet.</p>
          ) : (
            media.map((row) => (
              <div
                key={row.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0d1538] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#00c9ff]">
                    {row.mediaKind} · #{row.sortOrder}
                  </p>
                  <p className="truncate text-sm text-white">
                    {row.caption || "No caption"}
                  </p>
                  <a
                    href={row.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate text-xs text-[#00c9ff] hover:underline"
                  >
                    {row.url}
                  </a>
                  {row.mediaKind === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={row.url}
                      alt={row.caption || ""}
                      className="mt-2 max-h-28 rounded-lg object-cover"
                    />
                  ) : null}
                </div>

                <form
                  action={(formData) => {
                    startTransition(async () => {
                      const result = await deleteShowcaseMediaAction(formData);
                      refresh(result);
                    });
                  }}
                >
                  <input type="hidden" name="item_id" value={itemId} />
                  <input type="hidden" name="media_id" value={row.id} />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    disabled={pending}
                    className="text-rose-200 hover:bg-rose-500/10"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Remove
                  </Button>
                </form>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
