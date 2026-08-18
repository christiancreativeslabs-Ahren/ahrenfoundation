"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { Bold, CalendarDays, Italic, Link2, List, ListOrdered, LockKeyhole, RefreshCw, Save, Underline } from "lucide-react";
import { useRouter } from "next/navigation";

import { updateTrainingApplicationSettings } from "@/actions/admin";
import {
  formatTrainingApplicationDateInput,
  type TrainingApplicationSettings as TrainingApplicationSettingsState,
} from "@/lib/application-settings.shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/input-fields";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ActionState = {
  ok: boolean;
  message: string;
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

export function TrainingApplicationSettingsDialog({
  settings,
}: {
  settings: TrainingApplicationSettingsState;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [forceClosed, setForceClosed] = useState(settings.forceClosed);
  const [openAt, setOpenAt] = useState(formatTrainingApplicationDateInput(settings.applicationsOpenAt));
  const [closeAt, setCloseAt] = useState(formatTrainingApplicationDateInput(settings.applicationsCloseAt));
  const [title, setTitle] = useState(settings.closedTitle);
  const [editorHtml, setEditorHtml] = useState(settings.closedMessageHtml);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [state, formAction, pending] = useActionState(updateTrainingApplicationSettings, initialActionState);

  useEffect(() => {
    if (!open) return;

    setForceClosed(settings.forceClosed);
    setOpenAt(formatTrainingApplicationDateInput(settings.applicationsOpenAt));
    setCloseAt(formatTrainingApplicationDateInput(settings.applicationsCloseAt));
    setTitle(settings.closedTitle);
    setEditorHtml(settings.closedMessageHtml);

    if (editorRef.current) {
      editorRef.current.innerHTML = settings.closedMessageHtml;
    }
  }, [
    open,
    settings.applicationsCloseAt,
    settings.applicationsOpenAt,
    settings.closedMessageHtml,
    settings.closedTitle,
    settings.forceClosed,
  ]);

  useEffect(() => {
    if (!state.ok) return;

    setOpen(false);
    router.refresh();
  }, [router, state.ok]);

  const summary = useMemo(() => {
    const openLabel = openAt || "unset";
    const closeLabel = closeAt || "unset";

    return forceClosed
      ? "Currently forced closed"
      : `Window: ${openLabel} → ${closeLabel}`;
  }, [closeAt, forceClosed, openAt]);

  const handleOpen = (nextOpen: boolean) => {
    setOpen(nextOpen);
  };

  const insertLink = () => {
    const href = window.prompt("Enter link URL", "https://");
    if (!href) return;
    execFormatCommand("createLink", href);
    editorRef.current?.focus();
    setEditorHtml(getEditorHtml(editorRef.current));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="secondary"
            className="gap-2 border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
          />
        }
      >
        <CalendarDays className="h-4 w-4" />
        Application window
      </DialogTrigger>

      <DialogContent className="max-w-5xl sm:max-w-5xl max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] flex flex-col overflow-hidden border border-white/10 bg-[#07102c] text-white">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <DialogTitle className="text-2xl">Training application window</DialogTitle>
              <DialogDescription className="max-w-2xl text-slate-300">
                Control when the public join form is visible. When forced closed, the page shows only the closed message on the same route.
              </DialogDescription>
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-[#cfe6ff]">
              {summary}
            </div>
          </div>
        </DialogHeader>

        <form
          action={async (formData) => {
            formData.set("force_closed", forceClosed ? "true" : "false");
            formData.set("closed_title", title);
            formData.set("closed_message_html", editorHtml);
            await formAction(formData);
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto pr-1">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">Start date</span>
                <DateInput
                  name="applications_open_at"
                  value={openAt}
                  onChange={(event) => setOpenAt(event.target.value)}
                  className="h-11 border-white/10 bg-white/[0.04] text-white"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">End date</span>
                <DateInput
                  name="applications_close_at"
                  value={closeAt}
                  onChange={(event) => setCloseAt(event.target.value)}
                  className="h-11 border-white/10 bg-white/[0.04] text-white"
                />
              </label>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={forceClosed}
                  onChange={(event) => setForceClosed(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent accent-[#00c9ff]"
                />
                <span className="space-y-1">
                  <span className="block text-sm font-semibold text-white">
                    Force close applications
                  </span>
                  <span className="block text-sm leading-relaxed text-slate-300">
                    This override keeps the form closed even if the date range says it should be open.
                  </span>
                </span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Closed title
              </label>
              <Input
                name="closed_title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-11 border-white/10 bg-white/[0.04] text-white"
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { icon: Bold, command: "bold", label: "Bold" },
                  { icon: Italic, command: "italic", label: "Italic" },
                  { icon: Underline, command: "underline", label: "Underline" },
                  { icon: List, command: "insertUnorderedList", label: "Bullets" },
                  { icon: ListOrdered, command: "insertOrderedList", label: "Numbered" },
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
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.08]"
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </button>
                ))}
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={insertLink}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.08]"
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
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Clear
                </button>
              </div>

              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(event) => {
                  setEditorHtml((event.currentTarget as HTMLDivElement).innerHTML);
                }}
                className={cn(
                  "min-h-[220px] rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-white outline-none",
                  "focus:border-[#00c9ff] focus:ring-2 focus:ring-[#00c9ff]/20",
                )}
                dangerouslySetInnerHTML={{ __html: editorHtml }}
              />
              <p className="text-xs leading-relaxed text-slate-400">
                Basic formatting is supported. Keep the message concise and welcoming.
              </p>
            </div>

            <input type="hidden" name="force_closed" value={forceClosed ? "true" : "false"} />
            <input type="hidden" name="closed_message_html" value={editorHtml} />

            {state.message ? (
              <div
                className={cn(
                  "rounded-2xl border px-4 py-3 text-sm",
                  state.ok
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                    : "border-rose-400/20 bg-rose-400/10 text-rose-200",
                )}
              >
                {state.message}
              </div>
            ) : null}
          </div>

          <DialogFooter className="shrink-0 border-white/10 bg-white/[0.03]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-white/15 bg-transparent text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="gap-2 bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]"
            >
              <Save className="h-4 w-4" />
              {pending ? "Saving..." : "Save settings"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
