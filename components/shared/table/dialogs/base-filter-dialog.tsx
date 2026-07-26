"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useCallback, useEffect, useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";

export interface BaseFilterDialogProps<TFilters extends Record<string, any>> {
  isOpen: boolean;
  onClose: () => void;
  filters: TFilters;
  onApply: (filters: TFilters) => void;
  onReset: () => void;
  title: string;
  subtitle?: string;
    children: (props: {
      localFilters: TFilters;
    setLocalFilters: Dispatch<SetStateAction<TFilters>>;
    handleChange: <K extends keyof TFilters>(key: K, value: TFilters[K]) => void;
  }) => ReactNode;
}

export function BaseFilterDialog<TFilters extends Record<string, any>>({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
  title,
  subtitle = "Refine your search",
  children,
}: BaseFilterDialogProps<TFilters>) {
  const [localFilters, setLocalFilters] = useState<TFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = useCallback(
    <K extends keyof TFilters>(key: K, value: TFilters[K]) => {
      setLocalFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex flex-col p-0 sm:max-w-sm [&>button]:hidden">
        <div className="border-b bg-muted/50 px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <Filter className="h-4 w-4 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold uppercase leading-4">
                  {title}
                </SheetTitle>
                <SheetDescription className="p-0 text-sm text-muted-foreground">
                  {subtitle}
                </SheetDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {children({ localFilters, setLocalFilters, handleChange })}
        </div>

        <SheetFooter className="sticky bottom-0 border-t bg-background px-6 py-4">
          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={() => { onReset(); onClose(); }} className="flex-1">
              Reset
            </Button>
            <Button onClick={() => { onApply(localFilters); onClose(); }} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
