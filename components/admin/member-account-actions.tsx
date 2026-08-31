"use client";

import { useActionState, useEffect, useState } from "react";
import { ChevronDown, Power, RotateCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  deactivateProgramMemberAction,
  permanentlyDeleteProgramMemberAction,
  reactivateProgramMemberAction,
} from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { HiddenInput, TextInput } from "@/components/ui/input-fields";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const initialActionState = { ok: false, message: "" };

export function MemberAccountActions({
  memberId,
  memberEmail,
  memberName,
  role,
  status,
  className,
}: {
  memberId: string;
  memberEmail: string;
  memberName: string;
  role: "mentor" | "youth";
  status: string;
  className?: string;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deactivateState, deactivateAction, deactivating] = useActionState(
    deactivateProgramMemberAction,
    initialActionState,
  );
  const [reactivateState, reactivateAction, reactivating] = useActionState(
    reactivateProgramMemberAction,
    initialActionState,
  );
  const [deleteState, deleteAction, deleting] = useActionState(
    permanentlyDeleteProgramMemberAction,
    initialActionState,
  );
  const isVerified = status === "verified_mentor" || status === "verified_member";

  useEffect(() => {
    if (!deactivateState.ok && !reactivateState.ok) return;
    setMenuOpen(false);
    router.refresh();
  }, [deactivateState.ok, reactivateState.ok, router]);

  useEffect(() => {
    if (!deleteState.ok) return;
    setDeleteOpen(false);
    router.push(role === "mentor" ? "/admin/mentors" : "/admin/mentees");
    router.refresh();
  }, [deleteState.ok, role, router]);

  return (
    <div className={cn("relative inline-flex", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2 border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
        onClick={(event) => {
          event.stopPropagation();
          setMenuOpen((value) => !value);
        }}
      >
        Actions
        <ChevronDown className="h-4 w-4" />
      </Button>

      {menuOpen ? (
        <>
          <button
            type="button"
            aria-label="Close actions menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#07102c] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            {isVerified ? (
              <form action={deactivateAction}>
                <HiddenInput name="program_member_id" value={memberId} />
                <button
                  type="submit"
                  disabled={deactivating}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white transition hover:bg-white/[0.08] disabled:opacity-50"
                >
                  <Power className="h-4 w-4 text-amber-300" />
                  Deactivate account
                </button>
              </form>
            ) : (
              <form action={reactivateAction}>
                <HiddenInput name="program_member_id" value={memberId} />
                <button
                  type="submit"
                  disabled={reactivating}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white transition hover:bg-white/[0.08] disabled:opacity-50"
                >
                  <RotateCcw className="h-4 w-4 text-[#00ff9d]" />
                  Reactivate account
                </button>
              </form>
            )}

            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose-100 transition hover:bg-rose-500/10"
              onClick={(event) => {
                event.stopPropagation();
                setMenuOpen(false);
                setDeleteOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4 text-rose-300" />
              Delete permanently
            </button>
          </div>
        </>
      ) : null}

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="border border-rose-400/20 bg-[#07102c] text-white">
          <DialogHeader>
            <DialogTitle>Delete permanently</DialogTitle>
            <DialogDescription className="text-slate-300">
              This will permanently delete {memberName} and related records for this account only. Type the email address to confirm.
            </DialogDescription>
          </DialogHeader>
          <form action={deleteAction} className="space-y-4">
            <HiddenInput name="program_member_id" value={memberId} />
            <TextInput
              name="confirmation"
              placeholder={memberEmail}
              className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500"
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="border-white/15 bg-transparent text-white hover:bg-white/10"
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={deleting} className="bg-rose-500 text-white hover:bg-rose-400">
                Delete permanently
              </Button>
            </DialogFooter>
            {deleteState.message ? (
              <p className={deleteState.ok ? "text-sm text-[#00ff9d]" : "text-sm text-rose-200"}>
                {deleteState.message}
              </p>
            ) : null}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
