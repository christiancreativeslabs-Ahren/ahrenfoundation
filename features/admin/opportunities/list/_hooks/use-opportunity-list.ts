"use client";

import { useEffect, useMemo, useRef } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import type { OpportunityListInput, OpportunityListResponse } from "@/lib/admin/opportunities";
import {
  parseOpportunityListInput,
  type RawOpportunityListParams,
} from "../_lib/parse-opportunity-list-input";
import { serializeOpportunityListQueryKey } from "../_lib/opportunity-list-query-options";

const audienceValues = ["all", "youth", "mentor"] as const;
const statusValues = ["all", "published", "draft"] as const;
const directionValues = ["next", "last"] as const;

interface UseOpportunityListProps {
  initialData: OpportunityListResponse;
  initialInput: OpportunityListInput;
}

async function fetchOpportunityList(input: OpportunityListInput) {
  const params = new URLSearchParams();
  params.set("page", String(input.page));
  params.set("limit", String(input.limit));
  params.set("direction", input.direction);
  if (input.cursor) params.set("cursor", input.cursor);
  if (input.search) params.set("search", input.search);
  if (input.audience) params.set("audience", input.audience);
  if (input.status) params.set("status", input.status);
  if (input.type) params.set("type", input.type);

  const response = await fetch(`/api/admin/opportunities?${params.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch opportunities");
  }

  return (await response.json()) as OpportunityListResponse;
}

export function useOpportunityList({
  initialData,
  initialInput,
}: UseOpportunityListProps) {
  const queryClient = useQueryClient();
  const cursorStackRef = useRef<(string | undefined)[]>([undefined]);

  const [params, setParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(initialInput.limit),
      cursor: parseAsString,
      direction: parseAsStringLiteral(directionValues).withDefault("next"),
      search: parseAsString.withDefault(""),
      audience: parseAsStringLiteral(audienceValues).withDefault("all"),
      status: parseAsStringLiteral(statusValues).withDefault("all"),
      type: parseAsString.withDefault(""),
    },
    { shallow: false },
  );

  const currentInput = useMemo(
    () => parseOpportunityListInput(params as unknown as RawOpportunityListParams),
    [params],
  );

  const currentKey = serializeOpportunityListQueryKey(currentInput);
  const initialKey = serializeOpportunityListQueryKey(initialInput);

  const query = useQuery({
    queryKey: ["admin", "opportunities", currentKey],
    queryFn: () => fetchOpportunityList(currentInput),
    initialData: currentKey === initialKey ? initialData : undefined,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });

  const totalPages = Math.max(
    1,
    Math.ceil((query.data?.totalCount ?? 0) / currentInput.limit),
  );

  useEffect(() => {
    if (!query.data?.hasMore || !query.data.nextCursor) return;
    const nextPage = currentInput.page + 1;
    const nextInput: OpportunityListInput = {
      ...currentInput,
      page: nextPage,
      cursor: query.data.nextCursor,
      direction: "next",
    };
    void queryClient.prefetchQuery({
      queryKey: ["admin", "opportunities", serializeOpportunityListQueryKey(nextInput)],
      queryFn: () => fetchOpportunityList(nextInput),
      staleTime: 30_000,
    });
  }, [currentInput, query.data?.hasMore, query.data?.nextCursor, queryClient]);

  const resetCursorStack = () => {
    cursorStackRef.current = [undefined];
  };

  const updateFilters = (
    updates: Partial<{
      search: string | null;
      audience: OpportunityListInput["audience"] | null;
      status: OpportunityListInput["status"] | null;
      type: string | null;
      limit: number | null;
    }>,
  ) => {
    resetCursorStack();
    void setParams({
      ...updates,
      page: 1,
      cursor: null,
      direction: "next",
    });
  };

  const goToNextPage = () => {
    if (!query.data?.hasMore || !query.data.nextCursor) return;
    const nextPage = currentInput.page + 1;
    cursorStackRef.current = [
      ...cursorStackRef.current.slice(0, nextPage),
      query.data.nextCursor,
    ];
    void setParams({
      page: nextPage,
      cursor: query.data.nextCursor,
      direction: "next",
    });
  };

  const goToPrevPage = () => {
    if (currentInput.page <= 1) return;
    const prevPage = currentInput.page - 1;
    void setParams({
      page: prevPage,
      cursor: cursorStackRef.current[prevPage - 1] ?? null,
      direction: "next",
    });
  };

  const goToFirstPage = () => {
    resetCursorStack();
    void setParams({
      page: 1,
      cursor: null,
      direction: "next",
    });
  };

  const goToLastPage = () => {
    resetCursorStack();
    void setParams({
      page: totalPages,
      cursor: null,
      direction: "last",
    });
  };

  return {
    currentInput,
    query,
    updateFilters,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
    totalPages,
  };
}
