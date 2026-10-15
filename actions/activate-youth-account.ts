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

function baseUrl() {
  return process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
}

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

    if (!member) {
      return { ok: true, message: genericSuccess };
    }

    const { firstName, lastName } = splitFullName(member.fullName);

    // Always resolve user by email (don't trust userId alone)
    let [user] = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(sql`lower(${users.email}) = ${email}`)
      .limit(1);

    if (!user) {
      // Create through Better Auth so password-reset can find the user
      const tempPassword = `${crypto.randomUUID()}Aa1!`;

      try {
        await auth.api.signUpEmail({
          body: {
            email,
            password: tempPassword,
            name: member.fullName,
          },
        });
      } catch (signUpErr) {
        console.error("activateYouth signUpEmail failed", signUpErr);
        // May already exist in auth — fall through and re-query
      }

      [user] = await db
        .select({ id: users.id, email: users.email })
        .from(users)
        .where(sql`lower(${users.email}) = ${email}`)
        .limit(1);

      if (!user) {
        // Last resort: direct insert (reset may still fail on some BA versions)
        const [created] = await db
          .insert(users)
          .values({
            email,
            name: member.fullName,
            firstName,
            lastName,
            emailVerified: false,
          })
          .returning({ id: users.id, email: users.email });
        user = created;
      }
    }

    // Link member → user (no duplicate members)
    if (member.userId !== user.id) {
      await db
        .update(programMembers)
        .set({ userId: user.id, updatedAt: new Date() })
        .where(eq(programMembers.id, member.id));
    }

    await db
      .update(users)
      .set({
        name: member.fullName,
        firstName,
        lastName,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Request reset (sends set-password email)
    try {
      await auth.api.requestPasswordReset({
        body: {
          email,
          redirectTo: `${baseUrl()}/reset-password`,
        },
      });
    } catch (err) {
      console.error(
        "activateYouth requestPasswordReset failed, trying forgetPassword",
        err,
      );
      // try {
      //   // Some better-auth versions use this name instead
      //   await auth.api.forgetPassword({
      //     body: {
      //       email,
      //       redirectTo: `${baseUrl()}/reset-password`,
      //     },
      //   });
      // } catch (err2) {
      //   console.error("activateYouth forgetPassword failed", err2);
      // }
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
