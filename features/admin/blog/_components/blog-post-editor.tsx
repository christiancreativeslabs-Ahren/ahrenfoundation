"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadBlogImageAction } from "../_actions/upload-blog-image";
import {
  Bold,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  RefreshCw,
  Save,
  Underline,
} from "lucide-react";
import {
  saveBlogPostAction,
  type BlogActionState,
} from "../_actions/blog-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input-fields";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type BlogPostEditorProps = {
  initialPost?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    contentHtml: string;
    coverImageUrl: string | null;
    coverImageCaption: string | null;
    authorName: string | null;
    status: string;
  } | null;
};

const initialActionState: BlogActionState = {
  ok: false,
  message: "",
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

function execFormatCommand(command: string, value?: string) {
  if (typeof document === "undefined") return;
  document.execCommand(command, false, value);
}

function getEditorHtml(editor: HTMLDivElement | null) {
  return editor?.innerHTML ?? "";
}

export function BlogPostEditor({ initialPost = null }: BlogPostEditorProps) {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const inlineImageInputRef = useRef<HTMLInputElement | null>(null);

  const [state, formAction, pending] = useActionState(
    saveBlogPostAction,
    initialActionState,
  );

  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialPost?.slug));
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [authorName, setAuthorName] = useState(initialPost?.authorName ?? "");
  const [status, setStatus] = useState(initialPost?.status ?? "draft");
  const [contentHtml, setContentHtml] = useState(
    initialPost?.contentHtml ?? "",
  );
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialPost?.coverImageUrl ?? "",
  );
  const [coverImageCaption, setCoverImageCaption] = useState(
    initialPost?.coverImageCaption ?? "",
  );
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = contentHtml;
  }, []);

  useEffect(() => {
    if (!state.ok || !state.postId) return;
    router.push(`/admin/blog/${state.postId}/edit`);
    router.refresh();
  }, [router, state.ok, state.postId]);

  const syncEditorHtml = () => {
    setContentHtml(getEditorHtml(editorRef.current));
  };

  const onTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  };

  const insertLink = () => {
    const href = window.prompt("Enter link URL", "https://");
    if (!href) return;
    execFormatCommand("createLink", href);
    editorRef.current?.focus();
    syncEditorHtml();
  };

  const uploadToBlob = async (file: File) => {
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadBlogImageAction(formData);
    if (!result.ok) {
      throw new Error(result.message);
    }
    return result.url;
  };

  const onCoverSelected = async (file: File | null) => {
    if (!file) return;
    setLocalError(null);
    setUploadingCover(true);
    try {
      const url = await uploadToBlob(file);
      setCoverImageUrl(url);
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Cover upload failed.",
      );
    } finally {
      setUploadingCover(false);
    }
  };

  const onInlineImageSelected = async (file: File | null) => {
    if (!file || !editorRef.current) return;
    setLocalError(null);
    setUploadingInline(true);
    try {
      const url = await uploadToBlob(file);
      const caption =
        window.prompt("Image caption (optional)", "")?.trim() ?? "";
      const alt =
        window
          .prompt("Image alt text (optional)", caption || file.name)
          ?.trim() ?? file.name;

      const html = `
        <figure class="blog-figure" style="margin:1.5rem 0">
          <img src="${url}" alt="${alt.replace(/"/g, "&quot;")}" style="max-width:100%;height:auto;border-radius:12px" />
          ${
            caption
              ? `<figcaption style="margin-top:0.5rem;font-size:0.875rem;opacity:0.8">${caption}</figcaption>`
              : ""
          }
        </figure>
        <p><br/></p>
      `;

      editorRef.current.focus();
      document.execCommand("insertHTML", false, html);
      syncEditorHtml();
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Image upload failed.",
      );
    } finally {
      setUploadingInline(false);
      if (inlineImageInputRef.current) {
        inlineImageInputRef.current.value = "";
      }
    }
  };

  const editorButtonStyles =
    "inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-white transition hover:bg-white/[0.08]";

  return (
    <form
      action={async (formData) => {
        formData.set("title", title);
        formData.set("slug", slug);
        formData.set("excerpt", excerpt);
        formData.set("author_name", authorName);
        formData.set("status", status);
        formData.set("content_html", getEditorHtml(editorRef.current));
        formData.set("cover_image_url", coverImageUrl);
        formData.set("cover_image_caption", coverImageCaption);
        if (initialPost?.id) {
          formData.set("post_id", initialPost.id);
        }
        await formAction(formData);
      }}
      className="space-y-6"
    >
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {initialPost ? "Edit blog post" : "New blog post"}
          </CardTitle>
          <CardDescription className="text-slate-300">
            Write the post body, insert links, and attach images with captions.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-medium text-slate-200">Title</span>
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              required
              placeholder="Post title"
              className="h-11 border-white/10 bg-white/[0.04] text-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-200">Slug</span>
            <Input
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              required
              placeholder="post-url-slug"
              className="h-11 border-white/10 bg-white/[0.04] text-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-200">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex h-11 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-200">
              Author name
            </span>
            <Input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Optional public byline"
              className="h-11 border-white/10 bg-white/[0.04] text-white"
            />
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-medium text-slate-200">Excerpt</span>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary for cards and SEO"
              className="min-h-24 border-white/10 bg-white/[0.04] text-white"
            />
          </label>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">Cover image</CardTitle>
          <CardDescription className="text-slate-300">
            Optional hero image with caption.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-white/15 bg-transparent text-white hover:bg-white/10"
              disabled={uploadingCover}
              onClick={() => coverInputRef.current?.click()}
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              {uploadingCover ? "Uploading…" : "Upload cover"}
            </Button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onCoverSelected(e.target.files?.[0] ?? null)}
            />
            {coverImageUrl ? (
              <Button
                type="button"
                variant="ghost"
                className="text-rose-200 hover:bg-rose-500/10"
                onClick={() => {
                  setCoverImageUrl("");
                  setCoverImageCaption("");
                }}
              >
                Remove cover
              </Button>
            ) : null}
          </div>

          {coverImageUrl ? (
            <div className="overflow-hidden rounded-2xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImageUrl}
                alt={coverImageCaption || title || "Cover"}
                className="max-h-72 w-full object-cover"
              />
            </div>
          ) : null}

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-200">
              Cover caption
            </span>
            <Input
              value={coverImageCaption}
              onChange={(e) => setCoverImageCaption(e.target.value)}
              placeholder="Optional caption"
              className="h-11 border-white/10 bg-white/[0.04] text-white"
            />
          </label>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">Post body</CardTitle>
          <CardDescription className="text-slate-300">
            Use the toolbar for formatting, links, and inline images with
            captions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { icon: Bold, command: "bold", label: "Bold" },
              { icon: Italic, command: "italic", label: "Italic" },
              { icon: Underline, command: "underline", label: "Underline" },
              {
                icon: List,
                command: "insertUnorderedList",
                label: "Bullets",
              },
              {
                icon: ListOrdered,
                command: "insertOrderedList",
                label: "Numbered",
              },
            ].map((item) => (
              <button
                key={item.command}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  execFormatCommand(item.command);
                  editorRef.current?.focus();
                  syncEditorHtml();
                }}
                className={editorButtonStyles}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            ))}

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={insertLink}
              className={editorButtonStyles}
            >
              <Link2 className="h-3.5 w-3.5" />
              Link
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              disabled={uploadingInline}
              onClick={() => inlineImageInputRef.current?.click()}
              className={editorButtonStyles}
            >
              <ImagePlus className="h-3.5 w-3.5" />
              {uploadingInline ? "Uploading…" : "Image"}
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                execFormatCommand("removeFormat");
                editorRef.current?.focus();
                syncEditorHtml();
              }}
              className={editorButtonStyles}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Clear
            </button>

            <input
              ref={inlineImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                onInlineImageSelected(e.target.files?.[0] ?? null)
              }
            />
          </div>

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={syncEditorHtml}
            onBlur={syncEditorHtml}
            className={cn(
              "min-h-[420px] rounded-2xl border border-white/10 bg-[#090f32] px-5 py-4 text-base leading-8 text-white outline-none",
              "prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-100 prose-a:text-[#00c9ff]",
              "focus:border-[#00c9ff] focus:ring-2 focus:ring-[#00c9ff]/20",
            )}
          />
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm text-slate-300">
          {localError ||
            state.message ||
            "Save as draft or publish when ready."}
        </p>
        <Button
          type="submit"
          disabled={pending || uploadingCover || uploadingInline}
          className="gap-2 bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]"
        >
          <Save className="h-4 w-4" />
          {pending ? "Saving…" : "Save post"}
        </Button>
      </div>
    </form>
  );
}
