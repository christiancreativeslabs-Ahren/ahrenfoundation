"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import {
  Bold,
  CalendarDays,
  FileText,
  Italic,
  Link2,
  List,
  ListOrdered,
  RefreshCw,
  Send,
  Save,
  Sparkles,
  Underline,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { saveBulkEmailCampaignAction } from "@/actions/bulk-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DateTimeInput,
  HiddenInput,
  Select,
  Textarea,
} from "@/components/ui/input-fields";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ActionState = {
  ok: boolean;
  message: string;
  campaignId?: string;
};

const initialActionState: ActionState = {
  ok: false,
  message: "",
};

function execFormatCommand(command: string, value?: string) {
  if (typeof document === "undefined") return;
  document.execCommand(command, false, value);
}

function getEditorHtml(editor: HTMLDivElement | null) {
  return editor?.innerHTML ?? "";
}

export type BulkEmailComposerProps = {
  initialCampaign?: {
    id: string;
    title: string;
    subject: string;
    bodyHtml: string;
    audienceType: string;
    audienceLabel: string | null;
    scheduledFor: Date | string | null;
    replyTo: string | null;
    senderLabel: string | null;
    status: string;
  } | null;
  initialAttachmentNames?: string[];
  recipientCount?: number;
  statusSummary?: Record<string, number>;
  audiencePreview?: {
    audienceType: string;
    count: number;
    samples: string[];
  };
};

export function BulkEmailComposer({
  initialCampaign = null,
  initialAttachmentNames = [],
  recipientCount = 0,
  statusSummary = {},
  audiencePreview,
}: BulkEmailComposerProps) {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [state, formAction, pending] = useActionState(
    saveBulkEmailCampaignAction,
    initialActionState,
  );
  const [title, setTitle] = useState(initialCampaign?.title ?? "");
  const [subject, setSubject] = useState(initialCampaign?.subject ?? "");
  const [audienceType, setAudienceType] = useState(
    initialCampaign?.audienceType ?? "custom",
  );
  const [audienceLabel, setAudienceLabel] = useState(
    initialCampaign?.audienceLabel ?? "",
  );
  const [replyTo, setReplyTo] = useState(initialCampaign?.replyTo ?? "");
  const [senderLabel, setSenderLabel] = useState(
    initialCampaign?.senderLabel ?? "",
  );
  const [scheduledFor, setScheduledFor] = useState(
    initialCampaign?.scheduledFor
      ? new Date(initialCampaign.scheduledFor).toISOString().slice(0, 16)
      : "",
  );
  const [editorHtml, setEditorHtml] = useState(initialCampaign?.bodyHtml ?? "");
  const [customEmails, setCustomEmails] = useState("");
  const [attachmentNames, setAttachmentNames] = useState(
    initialAttachmentNames,
  );

  useEffect(() => {
    if (!state.ok || !state.campaignId) return;
    router.push(`/admin/bulk-email/${state.campaignId}`);
    router.refresh();
  }, [router, state.campaignId, state.ok]);

  useEffect(() => {
    if (!editorRef.current) return;

    if (editorRef.current.innerHTML !== editorHtml) {
      editorRef.current.innerHTML = editorHtml;
    }
  }, []);

  const summaryLabel = useMemo(() => {
    if (!recipientCount) return "No saved recipients yet";
    const parts = [
      `${recipientCount} recipient${recipientCount === 1 ? "" : "s"}`,
      statusSummary.sent ? `${statusSummary.sent} sent` : null,
      statusSummary.failed ? `${statusSummary.failed} failed` : null,
      statusSummary.skipped ? `${statusSummary.skipped} skipped` : null,
      statusSummary.scheduled ? `${statusSummary.scheduled} scheduled` : null,
    ].filter(Boolean);

    return parts.join(" · ");
  }, [
    recipientCount,
    statusSummary.failed,
    statusSummary.scheduled,
    statusSummary.sent,
    statusSummary.skipped,
  ]);

  const insertLink = () => {
    const href = window.prompt("Enter link URL", "https://");
    if (!href) return;
    execFormatCommand("createLink", href);
    editorRef.current?.focus();
    setEditorHtml(getEditorHtml(editorRef.current));
  };

  const buttonStyles =
    "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.08]";

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader className="space-y-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight">
                {initialCampaign
                  ? "Edit bulk email campaign"
                  : "Create bulk email campaign"}
              </CardTitle>
              <CardDescription className="max-w-3xl text-slate-300">
                Compose a campaign, attach files, and choose whether to save it
                as a draft, schedule it, or send it immediately.
              </CardDescription>
            </div>
            <div className="rounded-full border border-cyan-400/10 bg-white/[0.04] px-4 py-2 text-sm text-[#cfe6ff]">
              {summaryLabel}
            </div>
          </div>
        </CardHeader>
      </Card>

      <form
        action={async (formData) => {
          formData.set("title", title);
          formData.set("subject", subject);
          formData.set("audience_type", audienceType);
          formData.set("audience_label", audienceLabel);
          formData.set("reply_to", replyTo);
          formData.set("sender_label", senderLabel);
          formData.set("scheduled_for", scheduledFor);
          formData.set("body_html", editorHtml);
          formData.set("custom_emails", customEmails);
          if (initialCampaign?.id) {
            formData.set("campaign_id", initialCampaign.id);
          }
          await formAction(formData);
        }}
        className="space-y-6"
      >
        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardContent className="grid gap-4 p-6 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">
                Campaign title
              </span>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Weekly mentor update"
                className="h-11 border-white/10 bg-white/[0.04] text-white"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">
                Email subject
              </span>
              <Input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="A fresh update from Ahren Foundation"
                className="h-11 border-white/10 bg-white/[0.04] text-white"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">
                Audience
              </span>
              <Select
                value={audienceType}
                onValueChange={(value) => {
                  if (value) setAudienceType(value);
                }}
                options={[
                  { value: "custom", label: "Custom emails" },
                  { value: "all_members", label: "All members" },
                  { value: "youth_members", label: "Youth members" },
                  { value: "mentor_members", label: "Mentors" },
                  { value: "applicants", label: "Applicants" },
                ]}
                triggerClassName="h-11 border-white/10 bg-white/[0.04] text-white"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">
                Audience label
              </span>
              <Input
                value={audienceLabel}
                onChange={(event) => setAudienceLabel(event.target.value)}
                placeholder="Optional label for this segment"
                className="h-11 border-white/10 bg-white/[0.04] text-white"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">
                Reply-to email
              </span>
              <Input
                type="email"
                value={replyTo}
                onChange={(event) => setReplyTo(event.target.value)}
                placeholder="support@ahrenfoundation.org"
                className="h-11 border-white/10 bg-white/[0.04] text-white"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">
                Sender label
              </span>
              <Input
                value={senderLabel}
                onChange={(event) => setSenderLabel(event.target.value)}
                placeholder="Ahren Foundation"
                className="h-11 border-white/10 bg-white/[0.04] text-white"
              />
            </label>
            <label className="space-y-2 lg:col-span-2">
              <span className="text-sm font-medium text-slate-200">
                Schedule time
              </span>
              <DateTimeInput
                value={scheduledFor}
                onChange={(event) => setScheduledFor(event.target.value)}
                className="h-11 border-white/10 bg-white/[0.04] text-white"
              />
            </label>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardContent className="space-y-4 p-6">
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
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    execFormatCommand(item.command);
                    editorRef.current?.focus();
                    setEditorHtml(getEditorHtml(editorRef.current));
                  }}
                  className={buttonStyles}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={insertLink}
                className={buttonStyles}
              >
                <Link2 className="h-3.5 w-3.5" />
                Link
              </button>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  execFormatCommand("removeFormat");
                  editorRef.current?.focus();
                  setEditorHtml(getEditorHtml(editorRef.current));
                }}
                className={buttonStyles}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Clear
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(event) => {
                  setEditorHtml(
                    (event.currentTarget as HTMLDivElement).innerHTML,
                  );
                }}
                className={cn(
                  "min-h-[360px] rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-white outline-none",
                  "focus:border-[#00c9ff] focus:ring-2 focus:ring-[#00c9ff]/20",
                )}
                // dangerouslySetInnerHTML={{ __html: editorHtml }}
              />

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Sparkles className="h-4 w-4 text-[#00ff9d]" />
                    Campaign notes
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Keep the body concise, link out to the lesson or resource
                    page, and attach only the files the audience needs.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <FileText className="h-4 w-4 text-[#00c9ff]" />
                    Attachments
                  </div>
                  <Input
                    type="file"
                    name="attachments"
                    multiple
                    onChange={(event) => {
                      setAttachmentNames(
                        Array.from(event.target.files ?? []).map(
                          (file) => file.name,
                        ),
                      );
                    }}
                    className="mt-3 border-white/10 bg-white/[0.04] text-white file:border-0 file:bg-white/10 file:text-white"
                  />
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    Each attachment is limited to 5 MB. Files are stored with
                    the campaign so scheduled sends can still deliver them
                    later.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {attachmentNames.length ? (
                      attachmentNames.map((name) => (
                        <Badge
                          key={name}
                          variant="outline"
                          className="border-white/15 text-white"
                        >
                          {name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400">
                        {initialAttachmentNames.length
                          ? "Existing attachments will be kept unless you upload replacements."
                          : "No attachments selected."}
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span className="text-sm font-semibold text-white">
                    Custom recipients
                  </span>
                  <Textarea
                    value={customEmails}
                    onChange={(event) => setCustomEmails(event.target.value)}
                    placeholder="name@example.com, second@example.com"
                    className="mt-3 min-h-32 border-white/10 bg-white/[0.04] text-white"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <HiddenInput name="body_html" value={editorHtml} />

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
          <div>
            <p className="font-medium text-white">Send options</p>
            <p className="mt-1">
              Save a draft, schedule for later, or send immediately to the
              selected audience.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              name="intent"
              value="draft"
              variant="secondary"
              disabled={pending}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save draft
            </Button>
            <Button
              type="submit"
              name="intent"
              value="schedule"
              variant="outline"
              disabled={pending}
              className="gap-2 border-white/15 bg-transparent text-white hover:bg-white/10"
            >
              <CalendarDays className="h-4 w-4" />
              Schedule
            </Button>
            <Button
              type="submit"
              name="intent"
              value="send"
              disabled={pending}
              className="gap-2 bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]"
            >
              <Send className="h-4 w-4" />
              Send now
            </Button>
          </div>
        </div>

        {state.message ? (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              state.ok
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                : "border-rose-400/30 bg-rose-400/10 text-rose-200",
            )}
          >
            {state.message}
          </div>
        ) : null}
      </form>

      {audiencePreview ? (
        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="text-xl">Audience preview</CardTitle>
            <CardDescription className="text-slate-300">
              This is the current recipient snapshot for the selected audience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-300">
              {audiencePreview.count} recipient
              {audiencePreview.count === 1 ? "" : "s"} in this audience.
            </p>
            <div className="flex flex-wrap gap-2">
              {audiencePreview.samples.map((sample) => (
                <Badge
                  key={sample}
                  variant="outline"
                  className="border-white/15 text-white"
                >
                  {sample}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
