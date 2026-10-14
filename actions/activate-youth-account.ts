"use server";

import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { programMembers, users } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { splitFullName } from "@/lib/names";

export type ActivateYouthState = {
  ok: boolean;
  message: string;
};

const genericSuccess =
  "If this email is registered as a youth member, you’ll receive a link shortly. Check your inbox and spam folder.";

export async function activateYouthAccountAction(
  _prev: ActivateYouthState,
  formData: FormData,
): Promise<ActivateYouthState> {
  try {
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, message: "Enter a valid email address." };
    }

    const [member] = await db
      .select({
        id: programMembers.id,
        fullName: programMembers.fullName,
        email: programMembers.email,
        userId: programMembers.userId,
      })
      .from(programMembers)
      .where(
        sql`lower(${programMembers.email}) = ${email} AND ${programMembers.role} = 'youth'`,
      )
      .limit(1);

    // Do not reveal whether the email exists
    if (!member) {
      return { ok: true, message: genericSuccess };
    }

    let userId = member.userId;

    if (!userId) {
      const { firstName, lastName } = splitFullName(member.fullName);

      const [existingUser] = await db
        .select({ id: users.id })
        .from(users)
        .where(sql`lower(${users.email}) = ${email}`)
        .limit(1);

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const [created] = await db
          .insert(users)
          .values({
            email,
            name: member.fullName,
            firstName,
            lastName,
            emailVerified: false,
          })
          .returning({ id: users.id });
        userId = created.id;
      }

      await db
        .update(programMembers)
        .set({ userId, updatedAt: new Date() })
        .where(eq(programMembers.id, member.id));
    }

    // Ensure name stays in sync
    await db
      .update(users)
      .set({
        name: member.fullName,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // Triggers sendResetPassword → setPasswordEmail (24h token)
    try {
      await auth.api.requestPasswordReset({
        body: {
          email,
          redirectTo: `${process.env.BETTER_AUTH_URL ?? "http://localhost:3000"}/reset-password`,
        },
      });
    } catch (err) {
      // Fallback name used by some BA versions:
      // await auth.api.forgetPassword({ body: { email, redirectTo: "..." } });
      console.error("activateYouthAccount requestPasswordReset failed", err);
      // Still return generic success to avoid enumeration
    }

    return { ok: true, message: genericSuccess };
  } catch (error) {
    console.error("activateYouthAccountAction failed", error);
    return {
      ok: false,
      message: "Something went wrong. Please try again shortly.",
    };
  }
}
