"use client";

import { useActionState, useEffect, useState } from "react";
import { UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { registerProgramMemberAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Checkbox,
  HiddenInput,
  TextInput,
  Textarea,
} from "@/components/ui/input-fields";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const initialActionState = {
  ok: false,
  message: "",
};

export function MemberRegistrationDialog({
  role,
  label,
}: {
  role: "mentor" | "youth";
  label: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    registerProgramMemberAction,
    initialActionState,
  );

  useEffect(() => {
    if (!state.ok) return;
    setOpen(false);
    router.refresh();
  }, [router, state.ok]);

  const noun = role === "mentor" ? "mentor" : "mentee";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        className="gap-2 bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e] hover:opacity-95"
        onClick={() => setOpen(true)}
      >
        <UserRoundPlus className="h-4 w-4" />
        {label}
      </Button>

      <DialogContent className="flex max-h-[calc(100vh-1.5rem)] w-[min(96vw,42rem)] flex-col overflow-hidden border border-white/10 bg-[#07102c] p-0 text-white sm:max-h-[calc(100vh-3rem)]">
        <DialogHeader className="border-b border-white/10 px-6 py-5">
          <DialogTitle className="text-2xl">Register {noun}</DialogTitle>
          <DialogDescription className="text-slate-300">
            Create a verified {noun} record directly from admin.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex min-h-0 flex-1 flex-col">
          <HiddenInput name="role" value={role} />
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Full name</span>
              <TextInput
                name="full_name"
                required
                placeholder="Full name"
                className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Email</span>
              <TextInput
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">Phone</span>
                <TextInput
                  name="phone_number"
                  placeholder="Phone number"
                  className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-200">Location</span>
                <TextInput
                  name="location"
                  placeholder="City, country"
                  className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Admin notes</span>
              <Textarea
                name="notes"
                placeholder="Optional registration notes"
                className="min-h-28 border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
              />
            </label>

            <Checkbox
              name="send_login"
              value="true"
              label="Send login link"
              description="Send a secure one-time login link after creating the account."
              containerClassName="items-start"
            />
          </div>

          <DialogFooter className="border-t border-white/10 bg-[#07102c] px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className={state.ok ? "text-sm text-[#00ff9d]" : "text-sm text-slate-300"}>
                {state.message || `Ready to create a verified ${noun}.`}
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
                  Register {noun}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
