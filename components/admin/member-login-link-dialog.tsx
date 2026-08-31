"use client";

import { useActionState, useEffect, useState } from "react";
import { KeyRound, Send } from "lucide-react";
import { sendProgramMemberLoginLinkAction } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HiddenInput } from "@/components/ui/input-fields";
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

type MemberLoginLinkDialogProps = {
  member: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    status: string;
    currentStep: string;
    userId: string | null;
    verifiedAt: Date | string | null;
    loginCredentialsSentAt: Date | string | null;
  };
};

function formatStatus(value: string | null | undefined) {
  return value ? value.replaceAll("_", " ") : "-";
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "Not sent";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function MemberLoginLinkDialog({ member }: MemberLoginLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    sendProgramMemberLoginLinkAction,
    initialActionState,
  );

  useEffect(() => {
    if (!state.ok) return;
    setOpen(false);
  }, [state.ok]);

  const hasAuthUser = Boolean(member.userId);
  const hasVerifiedAccess =
    member.status === "verified_member" || member.status === "verified_mentor";
  const mode = hasAuthUser && hasVerifiedAccess ? "resend" : "grant";
  const roleLabel = member.role === "mentor" ? "mentor" : "mentee";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant={mode === "resend" ? "secondary" : "default"}
        className={
          mode === "resend"
            ? "gap-2"
            : "gap-2 bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e] hover:opacity-95"
        }
        onClick={() => setOpen(true)}
      >
        {mode === "resend" ? <Send className="h-4 w-4" /> : <KeyRound className="h-4 w-4" />}
        {mode === "resend" ? "Resend login link" : "Give login access"}
      </Button>

      <DialogContent className="w-[min(96vw,34rem)] border border-white/10 bg-[#07102c] text-white">
        <DialogHeader>
          <DialogTitle>
            {mode === "resend" ? "Resend login link" : "Give platform access"}
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            {mode === "resend"
              ? `Send a fresh one-time login link to this ${roleLabel}.`
              : `Create or connect the auth account, verify this ${roleLabel}, and send a one-time login link.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div>
            <p className="font-semibold text-white">{member.fullName}</p>
            <p className="mt-1 text-sm text-slate-300">{member.email}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Auth account
              </p>
              <Badge variant="outline" className="mt-2 border-white/15 text-cyan-200">
                {hasAuthUser ? "Connected" : "Will be created"}
              </Badge>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Access status
              </p>
              <Badge variant="outline" className="mt-2 border-white/15 text-cyan-200">
                {hasVerifiedAccess ? "Verified" : "Will be verified"}
              </Badge>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Current status
              </p>
              <p className="mt-2 text-sm capitalize text-white">{formatStatus(member.status)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                Last login link
              </p>
              <p className="mt-2 text-sm text-white">
                {formatDate(member.loginCredentialsSentAt)}
              </p>
            </div>
          </div>
        </div>

        <form action={formAction}>
          <HiddenInput name="program_member_id" value={member.id} />
          <DialogFooter className="mt-5">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className={state.ok ? "text-sm text-[#00ff9d]" : "text-sm text-slate-300"}>
                {state.message || "This will email a secure one-time login link."}
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
                  {pending
                    ? "Sending..."
                    : mode === "resend"
                      ? "Resend link"
                      : "Give access and send"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
