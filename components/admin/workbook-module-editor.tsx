"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Plus,
  RefreshCw,
  Trash2,
  Underline,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox, HiddenInput, Select, Textarea } from "@/components/ui/input-fields";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type WorkbookQuestionRow = {
  prompt: string;
  responseType: string;
  isRequired: boolean;
};

type WorkbookModuleEditorProps = {
  action: (formData: FormData) => Promise<void>;
  module: {
    id: string;
    moduleKey: string;
    moduleNumber: number;
    weekNumber: number;
    sendOffsetDays: number;
    sendDayLabel: string;
    title: string;
    subtitle: string | null;
    subject: string;
    previewText: string | null;
    openingCopy: string;
    scriptureText: string;
    scriptureReference: string;
    reflection: string;
    focus: string;
    action: string;
    contentHtml: string;
    status: string;
  };
  questions: WorkbookQuestionRow[];
};

function createQuestionRow(question?: Partial<WorkbookQuestionRow>): WorkbookQuestionRow {
  return {
    prompt: question?.prompt ?? "",
    responseType: question?.responseType ?? "long_text",
    isRequired: question?.isRequired ?? true,
  };
}

function execFormatCommand(command: string, value?: string) {
  if (typeof document === "undefined") return;
  document.execCommand(command, false, value);
}

function getEditorHtml(editor: HTMLDivElement | null) {
  return editor?.innerHTML ?? "";
}

export function WorkbookModuleEditor({
  action,
  module,
  questions,
}: WorkbookModuleEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const initialQuestions = useMemo(
    () => (questions.length ? questions : Array.from({ length: 5 }, () => createQuestionRow())),
    [questions],
  );
  const [rows, setRows] = useState<WorkbookQuestionRow[]>(initialQuestions);
  const [contentHtml, setContentHtml] = useState(module.contentHtml);

  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = contentHtml;
  }, []);

  const syncEditorHtml = () => {
    setContentHtml(getEditorHtml(editorRef.current));
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

  return (
    <form
      action={async (formData) => {
        formData.set("content_html", getEditorHtml(editorRef.current));
        await action(formData);
      }}
      className="space-y-6"
    >
      <HiddenInput name="module_id" value={module.id} />
      <HiddenInput name="question_count" value={String(rows.length)} />
      <HiddenInput name="content_html" value={contentHtml} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-white">Module key</span>
          <Input name="module_key" defaultValue={module.moduleKey} className="border-white/10 bg-white/[0.04] text-white" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-white">Module number</span>
          <Input name="module_number" type="number" min={1} defaultValue={module.moduleNumber} className="border-white/10 bg-white/[0.04] text-white" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-white">Week number</span>
          <Input name="week_number" type="number" min={1} defaultValue={module.weekNumber} className="border-white/10 bg-white/[0.04] text-white" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-white">Send offset days</span>
          <Input name="send_offset_days" type="number" min={0} defaultValue={module.sendOffsetDays} className="border-white/10 bg-white/[0.04] text-white" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-white">Send day label</span>
          <Select
            defaultValue={module.sendDayLabel}
            name="send_day_label"
            options={[
              { value: "Monday", label: "Monday" },
              { value: "Tuesday", label: "Tuesday" },
              { value: "Wednesday", label: "Wednesday" },
              { value: "Thursday", label: "Thursday" },
              { value: "Friday", label: "Friday" },
              { value: "Saturday", label: "Saturday" },
              { value: "Sunday", label: "Sunday" },
            ]}
            triggerClassName="border-white/10 bg-white/[0.04]"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-white">Status</span>
          <Select
            defaultValue={module.status}
            name="status"
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" },
            ]}
            triggerClassName="border-white/10 bg-white/[0.04]"
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-white">Title</span>
          <Input name="title" defaultValue={module.title} className="border-white/10 bg-white/[0.04] text-white" />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-white">Subtitle</span>
          <Input name="subtitle" defaultValue={module.subtitle ?? ""} className="border-white/10 bg-white/[0.04] text-white" />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-white">Workbook email subject</span>
          <Input name="subject" defaultValue={module.subject} className="border-white/10 bg-white/[0.04] text-white" />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-white">Preview text</span>
          <Textarea name="preview_text" defaultValue={module.previewText ?? ""} className="min-h-20 border-white/10 bg-white/[0.04] text-white" />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-white">Opening copy</span>
          <Textarea name="opening_copy" defaultValue={module.openingCopy} className="min-h-32 border-white/10 bg-white/[0.04] text-white" />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-white">Scripture text</span>
          <Textarea name="scripture_text" defaultValue={module.scriptureText} className="min-h-28 border-white/10 bg-white/[0.04] text-white" />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-white">Scripture reference</span>
          <Textarea name="scripture_reference" defaultValue={module.scriptureReference} className="min-h-20 border-white/10 bg-white/[0.04] text-white" />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-white">Reflection</span>
          <Textarea name="reflection" defaultValue={module.reflection} className="min-h-32 border-white/10 bg-white/[0.04] text-white" />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-white">Focus</span>
          <Textarea name="focus" defaultValue={module.focus} className="min-h-24 border-white/10 bg-white/[0.04] text-white" />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-white">Creative growth action</span>
          <Textarea name="action" defaultValue={module.action} className="min-h-24 border-white/10 bg-white/[0.04] text-white" />
        </label>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">Main Workbook content</h3>
            <p className="mt-1 max-w-3xl text-sm text-slate-300">
              This is the full module body shown in the Workbook experience when supplied.
            </p>
          </div>
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
                  syncEditorHtml();
                }}
                className={editorButtonStyles}
                title={item.label}
              >
                <item.icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            ))}
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={insertLink}
              className={editorButtonStyles}
              title="Insert link"
            >
              <Link2 className="h-3.5 w-3.5" />
              <span>Link</span>
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                execFormatCommand("removeFormat");
                editorRef.current?.focus();
                syncEditorHtml();
              }}
              className={editorButtonStyles}
              title="Clear formatting"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={syncEditorHtml}
          onBlur={syncEditorHtml}
          className={cn(
            "mt-5 min-h-[520px] rounded-2xl border border-white/10 bg-[#090f32] px-5 py-4 text-base leading-8 text-white outline-none",
            "prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-100 prose-strong:text-white prose-a:text-[#00c9ff] prose-li:text-slate-100",
            "focus:border-[#00c9ff] focus:ring-2 focus:ring-[#00c9ff]/20",
            "empty:before:text-slate-500 empty:before:content-['Start_writing_the_full_Workbook_module...']",
          )}
        />
      </section>

      <section className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">Workbook questions</h3>
            <p className="text-sm text-slate-300">
              These questions are used by both emailed Workbook links and the Hub Workbook pages.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="gap-2 border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08]"
            onClick={() => setRows((current) => [...current, createQuestionRow()])}
          >
            <Plus className="h-4 w-4" />
            Add question
          </Button>
        </div>

        <div className="grid gap-4">
          {rows.map((row, index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-[#090f32] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">Question {index + 1}</p>
                {rows.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-rose-200 hover:bg-rose-500/10 hover:text-rose-100"
                    onClick={() => setRows((current) => current.filter((_, rowIndex) => rowIndex !== index))}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                ) : null}
              </div>

              <div className="mt-4 space-y-4">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-200">Prompt</span>
                  <Textarea name={`question_prompt_${index}`} defaultValue={row.prompt} className="min-h-32 border-white/10 bg-white/[0.04] text-white" />
                </label>
                <div className="grid gap-4 md:grid-cols-[minmax(240px,360px)_minmax(220px,1fr)] md:items-end">
                  <label className="space-y-2 md:max-w-sm">
                    <span className="text-sm font-medium text-slate-200">Response type</span>
                    <Select
                      name={`question_response_type_${index}`}
                      defaultValue={row.responseType}
                      options={[
                        { value: "short_text", label: "Short text" },
                        { value: "long_text", label: "Long text" },
                        { value: "multiple_choice", label: "Multiple choice" },
                      ]}
                      triggerClassName="border-white/10 bg-white/[0.04]"
                    />
                  </label>
                  <label className="flex min-h-10 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 md:w-fit">
                    <Checkbox name={`question_required_${index}`} value="true" defaultChecked={row.isRequired} />
                    <span className="text-sm text-white">Required question</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" className="bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]">
          Save Workbook module
        </Button>
        <p className="text-sm text-slate-400">
          Saving updates the Workbook module used by email delivery, Hub access, and mentor review.
        </p>
      </div>
    </form>
  );
}
