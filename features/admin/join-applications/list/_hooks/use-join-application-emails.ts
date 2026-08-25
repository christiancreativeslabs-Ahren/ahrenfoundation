"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchJoinApplicationEmails(): Promise<string[]> {
  const response = await fetch("/api/admin/join-applications/emails", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch join application emails");
  }

  const data = (await response.json()) as { emails: string[] };

  return data.emails;
}

export function useJoinApplicationEmails() {
  return useQuery({
    queryKey: ["admin", "join-application-emails"],
    queryFn: fetchJoinApplicationEmails,
    staleTime: 30_000,
  });
}
