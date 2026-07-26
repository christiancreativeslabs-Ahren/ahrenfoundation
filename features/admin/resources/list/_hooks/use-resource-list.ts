"use client";

import { useEffect, useMemo, useRef } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import type { ResourceListInput, ResourceListResponse } from "@/lib/admin/resources";
import {
  parseResourceListInput,
  type RawResourceListParams,
} from "../_lib/parse-resource-list-input";
import { serializeResourceListQueryKey } from "../_lib/resource-list-query-options";

const audienceValues = ["all", "youth", "mentor"] as const;
const visibilityValues = ["all", "published", "draft"] as const;
const directionValues = ["next", "last"] as const;

interface UseResourceListProps {
  initialData: ResourceListResponse;
  initialInput: ResourceListInput;
}

async function fetchResourceList(input: ResourceListInput) {
  const params = new URLSearchParams();
  params.set("page", String(input.page));
  params.set("limit", String(input.limit));
  params.set("direction", input.direction);
  if (input.cursor) params.set("cursor", input.cursor);
  if (input.search) params.set("search", input.search);
  if (input.audience) params.set("audience", input.audience);
  if (input.visibility) params.set("visibility", input.visibility);
  if (input.category) params.set("category", input.category);

  const response = await fetch(`/api/admin/resources?${params.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch resources");
  }

  return (await response.json()) as ResourceListResponse;
}

export function useResourceList({ initialData, initialInput }: UseResourceListProps) {
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
      visibility: parseAsStringLiteral(visibilityValues).withDefault("all"),
      category: parseAsString.withDefault(""),
    },
    { shallow: false },
  );

  const currentInput = useMemo(
    () => parseResourceListInput(params as unknown as RawResourceListParams),
    [params],
  );

  const currentKey = serializeResourceListQueryKey(currentInput);
  const initialKey = serializeResourceListQueryKey(initialInput);

  const query = useQuery({
    queryKey: ["admin", "resources", currentKey],
    queryFn: () => fetchResourceList(currentInput),
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
    const nextInput: ResourceListInput = {
      ...currentInput,
      page: nextPage,
      cursor: query.data.nextCursor,
      direction: "next",
    };
    void queryClient.prefetchQuery({
      queryKey: ["admin", "resources", serializeResourceListQueryKey(nextInput)],
      queryFn: () => fetchResourceList(nextInput),
      staleTime: 30_000,
    });
  }, [currentInput, query.data?.hasMore, query.data?.nextCursor, queryClient]);

  const resetCursorStack = () => {
    cursorStackRef.current = [undefined];
  };

  const updateFilters = (
    updates: Partial<{
      search: string | null;
      audience: ResourceListInput["audience"] | null;
      visibility: ResourceListInput["visibility"] | null;
      category: string | null;
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
