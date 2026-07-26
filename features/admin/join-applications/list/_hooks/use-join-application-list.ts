"use client";

import { useEffect, useMemo, useRef } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import type {
  JoinApplicationListInput,
  JoinApplicationListResponse,
} from "@/lib/admin/join-applications";
import {
  parseJoinApplicationListInput,
  type RawJoinApplicationListParams,
} from "../_lib/parse-join-application-list-input";
import { serializeJoinApplicationListQueryKey } from "../_lib/join-application-list-query-options";

const applicationTypeValues = ["all", "youth", "mentor"] as const;
const statusValues = ["pending", "reviewing", "approved", "rejected"] as const;
const directionValues = ["next", "last"] as const;

interface UseJoinApplicationListProps {
  initialData: JoinApplicationListResponse;
  initialInput: JoinApplicationListInput;
}

async function fetchJoinApplicationList(input: JoinApplicationListInput) {
  const params = new URLSearchParams();
  params.set("page", String(input.page));
  params.set("limit", String(input.limit));
  params.set("direction", input.direction);
  if (input.cursor) params.set("cursor", input.cursor);
  if (input.search) params.set("search", input.search);
  if (input.applicationType) params.set("applicationType", input.applicationType);
  if (input.status) params.set("status", input.status);

  const response = await fetch(`/api/admin/join-applications?${params.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch join applications");
  }

  return (await response.json()) as JoinApplicationListResponse;
}

export function useJoinApplicationList({
  initialData,
  initialInput,
}: UseJoinApplicationListProps) {
  const queryClient = useQueryClient();
  const cursorStackRef = useRef<(string | undefined)[]>([undefined]);

  const [params, setParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(initialInput.limit),
      cursor: parseAsString,
      direction: parseAsStringLiteral(directionValues).withDefault("next"),
      search: parseAsString.withDefault(""),
      applicationType: parseAsStringLiteral(applicationTypeValues).withDefault("all"),
      status: parseAsStringLiteral(statusValues),
    },
    { shallow: false },
  );

  const currentInput = useMemo(
    () => parseJoinApplicationListInput(params as unknown as RawJoinApplicationListParams),
    [params],
  );

  const currentKey = serializeJoinApplicationListQueryKey(currentInput);
  const initialKey = serializeJoinApplicationListQueryKey(initialInput);

  const query = useQuery({
    queryKey: ["admin", "join-applications", currentKey],
    queryFn: () => fetchJoinApplicationList(currentInput),
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
    const nextInput: JoinApplicationListInput = {
      ...currentInput,
      page: nextPage,
      cursor: query.data.nextCursor,
      direction: "next",
    };
    void queryClient.prefetchQuery({
      queryKey: ["admin", "join-applications", serializeJoinApplicationListQueryKey(nextInput)],
      queryFn: () => fetchJoinApplicationList(nextInput),
      staleTime: 30_000,
    });
  }, [currentInput, query.data?.hasMore, query.data?.nextCursor, queryClient]);

  const resetCursorStack = () => {
    cursorStackRef.current = [undefined];
  };

  const updateFilters = (
    updates: Partial<{
      search: string | null;
      applicationType: JoinApplicationListInput["applicationType"] | null;
      status: JoinApplicationListInput["status"] | null;
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
