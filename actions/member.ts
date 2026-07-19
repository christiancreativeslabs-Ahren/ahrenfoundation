"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { db } from "@/db";
import { communityPosts, programMembers, projectShowcases } from "@/db/schema";

async function requireVerifiedMember() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    throw new Error("You must be signed in.");
  }

  const [member] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.email, session.user.email))
    .limit(1);

  if (
    !member ||
    (member.status !== "verified_member" && member.status !== "verified_mentor")
  ) {
    throw new Error("Verified access is required.");
  }

  return { user: session.user, member };
}

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createCommunityPost(formData: FormData) {
  const { user, member } = await requireVerifiedMember();
  const body = value(formData, "body");

  if (!body) {
    return;
  }

  await db.insert(communityPosts).values({
    userId: user.id,
    programMemberId: member.id,
    channel: member.role === "mentor" ? "mentor_channel" : "verified_members",
    body,
    status: "published",
  });

  revalidatePath("/dashboard");
}

export async function createProjectShowcase(formData: FormData) {
  const { user, member } = await requireVerifiedMember();
  const title = value(formData, "title");
  const summary = value(formData, "summary");
  const projectUrl = value(formData, "project_url");

  if (!title || !summary) {
    return;
  }

  await db.insert(projectShowcases).values({
    userId: user.id,
    programMemberId: member.id,
    title,
    summary,
    projectUrl,
    status: "submitted",
  });

  revalidatePath("/dashboard");
}
