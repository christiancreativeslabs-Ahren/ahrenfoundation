"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createResourceAction,
  type CreateResourceActionState,
} from "../../_actions/create-resource";
import { Button } from "@/components/ui/button";
import { Checkbox, TextInput, Textarea } from "@/components/ui/input-fields";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const initialState: CreateResourceActionState = {
  ok: false,
  message: "",
};

export function ResourceCreateDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createResourceAction,
    initialState,
  );

  useEffect(() => {
    if (!state.ok) return;
    setOpen(false);
    router.refresh();
  }, [router, state.ok]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        className="gap-2 bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e] hover:opacity-95"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        New resource
      </Button>

      <DialogContent className="flex max-h-[calc(100vh-1.5rem)] min-w-[600px] w-[min(96vw,42rem)] flex-col overflow-hidden border border-white/10 bg-[#07102c] p-0 text-white sm:max-h-[calc(100vh-3rem)]">
        <DialogHeader className="border-b border-white/10 px-6 py-5">
          <DialogTitle className="text-2xl">New resource</DialogTitle>
          <DialogDescription className="text-slate-300">
            Upload a file to Blob storage or link an external URL.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex flex-1 flex-col gap-2 md:gap-4 overflow-y-auto px-6 py-5">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Title</span>
              <TextInput
                name="title"
                required
                placeholder="Resource title"
                className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">
                Summary
              </span>
              <Textarea
                name="summary"
                placeholder="Short description"
                className="min-h-24 border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Audience
                </span>
                <select
                  name="audience"
                  defaultValue="all"
                  className="flex h-10 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-white"
                >
                  <option value="all">All</option>
                  <option value="youth">Youth</option>
                  <option value="mentor">Mentor</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Category
                </span>
                <TextInput
                  name="category"
                  required
                  placeholder="Books, templates..."
                  className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">
                File (PDF, image, doc…)
              </span>
              <input
                type="file"
                name="file"
                accept=".pdf,image/*,.doc,.docx,.xls,.xlsx,.txt,.zip"
                className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-sm file:text-white"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">
                Or external URL
              </span>
              <TextInput
                name="external_url"
                type="url"
                placeholder="https://..."
                className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
              />
            </label>

            <Checkbox
              name="is_published"
              value="true"
              label="Publish immediately"
              description="Make this resource visible on the dashboard."
              containerClassName="items-start"
            />
          </div>

          <DialogFooter className="border-t border-white/10 bg-[#07102c] px-6 py-4">
            <div className="flex pb-4 sm:w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p
                className={
                  state.ok ? "text-sm text-[#00ff9d]" : "text-sm text-slate-300"
                }
              >
                {state.message || "Ready to create a resource."}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/15 bg-transparent text-white hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={pending}
                  className="bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e] hover:opacity-95"
                >
                  {pending ? "Saving…" : "Create resource"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
