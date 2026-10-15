"use server";

import { sql } from "drizzle-orm";
import { db } from "@/db";
import { programMembers, users } from "@/db/schema";

export async function markEmailVerifiedAfterPasswordReset(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return;

  await db
    .update(users)
    .set({
      emailVerified: true,
      updatedAt: new Date(),
    })
    .where(sql`lower(${users.email}) = ${normalized}`);

  await db
    .update(programMembers)
    .set({
      currentStep: "awaiting_approval",
      updatedAt: new Date(),
    })
    .where(
      sql`lower(${programMembers.email}) = ${normalized} AND ${programMembers.role} IN ('youth', 'community')`,
    );
}
