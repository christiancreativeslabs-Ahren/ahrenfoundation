"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  saveShowcaseItemAction,
  type ShowcaseActionState,
} from "../_actions/showcase-actions";
import { uploadShowcaseImageAction } from "../_actions/upload-showcase-image";
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

export type ShowcaseTaxonomyCategory = {
  id: string;
  name: string;
  slug: string;
  subcategories: Array<{ id: string; name: string; slug: string }>;
};

export type ShowcaseItemEditorProps = {
  categories: ShowcaseTaxonomyCategory[];
  initialItem?: {
    id: string;
    title: string;
    slug: string;
    summary: string | null;
    bodyHtml: string;
    categoryId: string;
    subcategoryId: string | null;
    status: string;
    creatorName: string | null;
    coverImageUrl: string | null;
    coverImageCaption: string | null;
    isFeatured: boolean;
  } | null;
  /** First / primary media row when editing */
  initialPrimaryMedia?: {
    mediaKind: string;
    url: string;
    caption: string | null;
  } | null;
};

const initialActionState: ShowcaseActionState = {
  ok: false,
  message: "",
};

const TEXTUAL_SLUGS = new Set(["articles", "writing"]);

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

function primaryKindForSlug(
  slug: string,
): "youtube" | "audio" | "image" | "link" | null {
  switch (slug) {
    case "videos":
    case "animations":
      return "youtube";
    case "music":
      return "audio";
    case "podcasts":
    case "tech":
      return "link";
    case "artworks":
    case "photography":
    case "design":
      return "image";
    default:
      return null;
  }
}

function execFormatCommand(command: string, value?: string) {
  if (typeof document === "undefined") return;
  document.execCommand(command, false, value);
}

function getEditorHtml(editor: HTMLDivElement | null) {
  return editor?.innerHTML ?? "";
}

export function ShowcaseItemEditor({
  categories,
  initialItem = null,
  initialPrimaryMedia = null,
}: ShowcaseItemEditorProps) {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const inlineImageInputRef = useRef<HTMLInputElement | null>(null);
  const primaryFileInputRef = useRef<HTMLInputElement | null>(null);

  const [state, formAction, pending] = useActionState(
    saveShowcaseItemAction,
    initialActionState,
  );

  const [title, setTitle] = useState(initialItem?.title ?? "");
  const [slug, setSlug] = useState(initialItem?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialItem?.slug));
  const [summary, setSummary] = useState(initialItem?.summary ?? "");
  const [bodyHtml, setBodyHtml] = useState(initialItem?.bodyHtml ?? "");
  const [categoryId, setCategoryId] = useState(
    initialItem?.categoryId ?? categories[0]?.id ?? "",
  );
  const [subcategoryId, setSubcategoryId] = useState(
    initialItem?.subcategoryId ?? "",
  );
  const [status, setStatus] = useState(initialItem?.status ?? "draft");
  const [creatorName, setCreatorName] = useState(
    initialItem?.creatorName ?? "",
  );
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialItem?.coverImageUrl ?? "",
  );
  const [coverImageCaption, setCoverImageCaption] = useState(
    initialItem?.coverImageCaption ?? "",
  );
  const [isFeatured, setIsFeatured] = useState(
    initialItem?.isFeatured ?? false,
  );
  const [primaryMediaUrl, setPrimaryMediaUrl] = useState(
    initialPrimaryMedia?.url ?? "",
  );
  const [primaryMediaCaption, setPrimaryMediaCaption] = useState(
    initialPrimaryMedia?.caption ?? "",
  );
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === categoryId) ?? null,
    [categories, categoryId],
  );
  const subcategories = selectedCategory?.subcategories ?? [];
  const categorySlug = selectedCategory?.slug ?? "";
  const isTextual = TEXTUAL_SLUGS.has(categorySlug);
  const primaryKind = primaryKindForSlug(categorySlug);

  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = bodyHtml;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!state.ok || !state.itemId) return;
    router.push(`/admin/showcase/${state.itemId}/edit`);
    router.refresh();
  }, [router, state.itemId, state.ok]);

  useEffect(() => {
    if (subcategoryId && !subcategories.some((s) => s.id === subcategoryId)) {
      setSubcategoryId("");
    }
  }, [categoryId, subcategoryId, subcategories]);

  const syncEditorHtml = () => {
    setBodyHtml(getEditorHtml(editorRef.current));
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadShowcaseImageAction(formData);
    if (!result.ok) throw new Error(result.message);
    return result.url;
  };

  const onCoverSelected = async (file: File | null) => {
    if (!file) return;
    setLocalError(null);
    setUploadingCover(true);
    try {
      setCoverImageUrl(await uploadFile(file));
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Cover upload failed.",
      );
    } finally {
      setUploadingCover(false);
    }
  };

  const onPrimaryFileSelected = async (file: File | null) => {
    if (!file) return;
    setLocalError(null);
    setUploadingPrimary(true);
    try {
      setPrimaryMediaUrl(await uploadFile(file));
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Media upload failed.",
      );
    } finally {
      setUploadingPrimary(false);
      if (primaryFileInputRef.current) primaryFileInputRef.current.value = "";
    }
  };

  const onInlineImageSelected = async (file: File | null) => {
    if (!file || !editorRef.current) return;
    setLocalError(null);
    setUploadingInline(true);
    try {
      const url = await uploadFile(file);
      const caption =
        window.prompt("Image caption (optional)", "")?.trim() ?? "";
      const alt =
        window
          .prompt("Image alt text (optional)", caption || file.name)
          ?.trim() ?? file.name;

      const html = `
        <figure class="showcase-figure" style="margin:1.5rem 0">
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
      if (inlineImageInputRef.current) inlineImageInputRef.current.value = "";
    }
  };

  const insertLink = () => {
    const href = window.prompt("Enter link URL", "https://");
    if (!href) return;
    execFormatCommand("createLink", href);
    editorRef.current?.focus();
    syncEditorHtml();
  };

  const editorButtonStyles =
    "inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-white transition hover:bg-white/[0.08]";

  const primaryLabel =
    primaryKind === "youtube"
      ? "YouTube URL"
      : primaryKind === "audio"
        ? "Audio file or URL"
        : primaryKind === "image"
          ? "Image file or URL"
          : primaryKind === "link"
            ? "External link (podcast, demo, repo…)"
            : "Media URL";

  return (
    <form
      action={async (formData) => {
        formData.set("title", title);
        formData.set("slug", slug);
        formData.set("summary", summary);
        formData.set("body_html", getEditorHtml(editorRef.current));
        formData.set("category_id", categoryId);
        formData.set("subcategory_id", subcategoryId);
        formData.set("status", status);
        formData.set("creator_name", creatorName);
        formData.set("cover_image_url", coverImageUrl);
        formData.set("cover_image_caption", coverImageCaption);
        formData.set("is_featured", isFeatured ? "true" : "false");
        if (primaryKind) {
          formData.set("primary_media_kind", primaryKind);
          formData.set("primary_media_url", primaryMediaUrl);
          formData.set("primary_media_caption", primaryMediaCaption);
        }
        if (initialItem?.id) formData.set("item_id", initialItem.id);
        await formAction(formData);
      }}
      className="space-y-6"
    >
      {/* Meta */}
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {initialItem ? "Edit showcase item" : "New showcase item"}
          </CardTitle>
          <CardDescription className="text-slate-300">
            Taxonomy, credit, and status. Use cover + body like the blog editor;
            non-text categories also get a primary embed link/file.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-medium text-slate-200">Title</span>
            <Input
              value={title}
              onChange={(e) => {
                const value = e.target.value;
                setTitle(value);
                if (!slugTouched) setSlug(slugify(value));
              }}
              required
              placeholder="Item title"
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
              <option value="review">Review</option>
              <option value="published">Published</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-200">Category</span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="flex h-11 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-200">
              Sub-category
            </span>
            <select
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              className="flex h-11 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
            >
              <option value="">None</option>
              {subcategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-medium text-slate-200">
              Creator name
            </span>
            <Input
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="Community member credit"
              className="h-11 border-white/10 bg-white/[0.04] text-white"
            />
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-medium text-slate-200">Summary</span>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Short description for cards"
              className="min-h-24 border-white/10 bg-white/[0.04] text-white"
            />
          </label>

          <label className="flex items-center gap-3 lg:col-span-2 text-sm text-white">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-white/20"
            />
            Featured on Showcase
          </label>
        </CardContent>
      </Card>

      {/* Cover — blog parity */}
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

      {/* Primary embed — non-textual categories */}
      {!isTextual && primaryKind ? (
        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="text-lg">Primary media / embed</CardTitle>
            <CardDescription className="text-slate-300">
              Main file or link embedded on the public Showcase page (
              {selectedCategory?.name}).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {primaryKind === "image" || primaryKind === "audio" ? (
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/15 bg-transparent text-white hover:bg-white/10"
                  disabled={uploadingPrimary}
                  onClick={() => primaryFileInputRef.current?.click()}
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  {uploadingPrimary
                    ? "Uploading…"
                    : primaryKind === "image"
                      ? "Upload image"
                      : "Upload audio"}
                </Button>
                <input
                  ref={primaryFileInputRef}
                  type="file"
                  accept={primaryKind === "image" ? "image/*" : "audio/*"}
                  className="hidden"
                  onChange={(e) =>
                    onPrimaryFileSelected(e.target.files?.[0] ?? null)
                  }
                />
              </div>
            ) : null}

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">
                {primaryLabel}
              </span>
              <Input
                value={primaryMediaUrl}
                onChange={(e) => setPrimaryMediaUrl(e.target.value)}
                placeholder="https://"
                className="h-11 border-white/10 bg-white/[0.04] text-white"
              />
            </label>

            {primaryKind === "image" && primaryMediaUrl ? (
              <div className="overflow-hidden rounded-2xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={primaryMediaUrl}
                  alt={primaryMediaCaption || title}
                  className="max-h-56 w-full object-cover"
                />
              </div>
            ) : null}

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">
                Caption / label
              </span>
              <Input
                value={primaryMediaCaption}
                onChange={(e) => setPrimaryMediaCaption(e.target.value)}
                className="h-11 border-white/10 bg-white/[0.04] text-white"
              />
            </label>
          </CardContent>
        </Card>
      ) : null}

      {/* Body — blog parity */}
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle className="text-lg">Body</CardTitle>
          <CardDescription className="text-slate-300">
            Story, poem, project notes, or description. Toolbar supports
            formatting, links, and inline images.
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
              "min-h-[320px] rounded-2xl border border-white/10 bg-[#090f32] px-5 py-4 text-base leading-8 text-white outline-none",
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
            "Save as draft, send to review, or publish."}
        </p>
        <Button
          type="submit"
          disabled={
            pending ||
            uploadingCover ||
            uploadingInline ||
            uploadingPrimary ||
            !categoryId
          }
          className="gap-2 bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]"
        >
          <Save className="h-4 w-4" />
          {pending ? "Saving…" : "Save item"}
        </Button>
      </div>
    </form>
  );
}
