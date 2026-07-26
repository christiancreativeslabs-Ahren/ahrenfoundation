"use client";

import { useEffect, useMemo, useRef } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import type { EventListInput, EventListResponse } from "@/lib/admin/events";
import {
  parseEventListInput,
  type RawEventListParams,
} from "../_lib/parse-event-list-input";
import { serializeEventListQueryKey } from "../_lib/event-list-query-options";

const audienceValues = ["all", "youth", "mentor"] as const;
const statusValues = ["all", "published", "draft"] as const;
const directionValues = ["next", "last"] as const;

interface UseEventListProps {
  initialData: EventListResponse;
  initialInput: EventListInput;
}

async function fetchEventList(input: EventListInput) {
  const params = new URLSearchParams();
  params.set("page", String(input.page));
  params.set("limit", String(input.limit));
  params.set("direction", input.direction);
  if (input.cursor) params.set("cursor", input.cursor);
  if (input.search) params.set("search", input.search);
  if (input.audience) params.set("audience", input.audience);
  if (input.status) params.set("status", input.status);

  const response = await fetch(`/api/admin/events?${params.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return (await response.json()) as EventListResponse;
}

export function useEventList({ initialData, initialInput }: UseEventListProps) {
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
    },
    { shallow: false },
  );

  const currentInput = useMemo(
    () => parseEventListInput(params as unknown as RawEventListParams),
    [params],
  );

  const currentKey = serializeEventListQueryKey(currentInput);
  const initialKey = serializeEventListQueryKey(initialInput);

  const query = useQuery({
    queryKey: ["admin", "events", currentKey],
    queryFn: () => fetchEventList(currentInput),
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
    const nextInput: EventListInput = {
      ...currentInput,
      page: nextPage,
      cursor: query.data.nextCursor,
      direction: "next",
    };
    void queryClient.prefetchQuery({
      queryKey: ["admin", "events", serializeEventListQueryKey(nextInput)],
      queryFn: () => fetchEventList(nextInput),
      staleTime: 30_000,
    });
  }, [currentInput, query.data?.hasMore, query.data?.nextCursor, queryClient]);

  const resetCursorStack = () => {
    cursorStackRef.current = [undefined];
  };

  const updateFilters = (
    updates: Partial<{
      search: string | null;
      audience: EventListInput["audience"] | null;
      status: EventListInput["status"] | null;
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
