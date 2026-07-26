"use client";

import type { ReactNode } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";

export interface BaseDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  itemName: string;
  isDeleting: boolean;
  itemDetails?: ReactNode;
  description?: string;
}

export function BaseDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  isDeleting,
  itemDetails,
  description,
}: BaseDeleteDialogProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex flex-col p-0 sm:max-w-md [&>button]:hidden">
        <div className="border-b border-destructive/20 bg-destructive/10 px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-destructive/20 p-2">
                <Trash2 className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold uppercase leading-4">
                  {title}
                </SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground">
                  Confirm deletion
                </SheetDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} disabled={isDeleting} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4 px-6 py-6">
          <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {description || `Are you sure you want to delete this ${itemName}?`}
              </p>
              <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
            </div>
          </div>

          {itemDetails ? (
            <div className="rounded-lg border bg-muted/50 p-4">{itemDetails}</div>
          ) : null}
        </div>

        <SheetFooter className="border-t px-6 py-4">
          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={onClose} disabled={isDeleting} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm} disabled={isDeleting} className="flex-1">
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
