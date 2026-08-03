"use client";

import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type LessonDeliveryOption = {
  deliveryId: string;
  label: string;
  status: string;
  scheduledFor: string;
  sentAt?: string | null;
  failedAt?: string | null;
};

type ResendLessonEmailDialogProps = {
  deliveries: LessonDeliveryOption[];
  resendAction: (formData: FormData) => void | Promise<void>;
  disabled?: boolean;
};

export function ResendLessonEmailDialog({
  deliveries,
  resendAction,
  disabled = false,
}: ResendLessonEmailDialogProps) {
  const [open, setOpen] = useState(false);
  const [deliveryId, setDeliveryId] = useState(deliveries[0]?.deliveryId ?? "");

  const selectedDelivery = deliveries.find(
    (delivery) => delivery.deliveryId === deliveryId,
  );

  if (!deliveries.length) {
    return (
      <Button type="button" disabled>
        Resend lesson email
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="secondary"
            disabled={disabled}
            className="gap-2"
          />
        }
      >
        <Mail className="h-4 w-4" />
        Resend lesson email
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Resend a lesson email</DialogTitle>
          <DialogDescription>
            Choose one lesson delivery to resend. This will send only the selected module email.
          </DialogDescription>
        </DialogHeader>

        <form
          action={async (formData) => {
            await resendAction(formData);
            setOpen(false);
          }}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor="delivery_id"
              className="text-sm font-medium text-slate-200"
            >
              Select lesson
            </label>
            <select
              id="delivery_id"
              name="delivery_id"
              value={deliveryId}
              onChange={(event) => setDeliveryId(event.target.value)}
              className={cn(
                "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-[#00c9ff] focus:ring-2 focus:ring-[#00c9ff]/30",
              )}
            >
              {deliveries.map((delivery) => (
                <option key={delivery.deliveryId} value={delivery.deliveryId}>
                  {delivery.label}
                </option>
              ))}
            </select>
          </div>

          {selectedDelivery ? (
            <div className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 md:grid-cols-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                  Status
                </p>
                <p className="mt-1">{selectedDelivery.status}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                  Scheduled
                </p>
                <p className="mt-1">{selectedDelivery.scheduledFor}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00c9ff]">
                  Last send
                </p>
                <p className="mt-1">
                  {selectedDelivery.sentAt || selectedDelivery.failedAt || "-"}
                </p>
              </div>
              <div className="md:col-span-3">
                <Badge variant="outline" className="border-white/15 text-white">
                  One lesson email will be resent
                </Badge>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-white/15 bg-transparent text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-2 bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]">
              <ArrowRight className="h-4 w-4" />
              Resend selected lesson
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
