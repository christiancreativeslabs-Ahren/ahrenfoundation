"use server";

import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { accounts, joinApplications, programMembers, users } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { syncJoinApplicationProjection } from "@/lib/admin/join-applications";
import {
  parseJoinApplication,
  sendJoinNotificationEmails,
} from "@/lib/validations/join";
import { splitFullName } from "@/lib/names";
import { getInitialProgramStatus, getInitialProgramStep } from "@/lib/program";
import { enrollMemberInWorkbookProgram } from "@/lib/workbook/service";
import type { JoinTab } from "@/types/join";
import type { JoinFieldErrors } from "@/types/join";

export type JoinActionState = {
  ok: boolean;
  error: string;
  submittedType: JoinTab | null;
  fieldErrors: JoinFieldErrors;
  emailSent: boolean;
};

const initialState: JoinActionState = {
  ok: false,
  error: "",
  submittedType: null,
  fieldErrors: {},
  emailSent: false,
};

export async function submitJoinApplication(
  _previousState: JoinActionState,
  formData: FormData,
): Promise<JoinActionState> {
  try {
    const parsed = parseJoinApplication(formData);

    if (!parsed.data) {
      return {
        ...initialState,
        error: "Please fix the highlighted fields.",
        fieldErrors: parsed.fieldErrors,
      };
    }

    const data = parsed.data;
    const { firstName, lastName } = splitFullName(data.fullName);

    // ── Community: create Better Auth user + password, then join rows ──
    if (data.applicationType === "community") {
      if (!data.password) {
        return {
          ...initialState,
          error: "Password is required.",
          fieldErrors: { password: "Password is required." },
        };
      }

      const normalizedEmail = data.email.trim().toLowerCase();

      const [existingUser] = await db
        .select({ id: users.id })
        .from(users)
        .where(sql`lower(${users.email}) = ${normalizedEmail}`)
        .limit(1);

      if (existingUser) {
        const [existingCredential] = await db
          .select({ id: accounts.id })
          .from(accounts)
          .where(
            sql`${accounts.userId} = ${existingUser.id} AND ${accounts.providerId} = 'credential'`,
          )
          .limit(1);

        if (existingCredential) {
          return {
            ...initialState,
            error:
              "An account with this email already exists. Please log in or use Forgot password.",
            fieldErrors: {
              email: "Account already exists. Please log in.",
            },
          };
        }
      }

      // Creates user + credential password the same way login expects
      try {
        await auth.api.signUpEmail({
          body: {
            email: normalizedEmail,
            password: data.password,
            name: data.fullName,
          },
        });
      } catch (signUpError) {
        const message =
          signUpError instanceof Error
            ? signUpError.message
            : "Could not create login account.";
        console.error("community signUpEmail failed", signUpError);
        return {
          ...initialState,
          error: message,
          fieldErrors: { email: message },
        };
      }

      const [user] = await db
        .select({ id: users.id })
        .from(users)
        .where(sql`lower(${users.email}) = ${normalizedEmail}`)
        .limit(1);

      if (!user?.id) {
        throw new Error("Account was created but user record was not found.");
      }

      // Mark verified so nothing else in the stack treats them as unverified
      await db
        .update(users)
        .set({
          // emailVerified: true,
          name: data.fullName,
          firstName,
          lastName,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

      const [record] = await db
        .insert(joinApplications)
        .values({
          applicationType: "community",
          fullName: data.fullName,
          email: normalizedEmail,
          phoneNumber: data.phoneNumber,
          location: data.location,
          ageRange: data.ageRange,
          sex: data.sex,
          skills: data.skills,
          skillsOther: data.skillsOther,
          skillsToLearn: data.skillsToLearn,
          whyJoin: data.whyJoin,
          participationInterests: data.participationInterests,
          participationOther: data.participationOther,
          status: "pending",
          consent: data.consent,
          payload: data.payload,
        })
        .returning({ id: joinApplications.id });

      const [member] = await db
        .insert(programMembers)
        .values({
          joinApplicationId: record.id,
          userId: user.id,
          role: "community",
          fullName: data.fullName,
          email: normalizedEmail,
          status: "active", // hub-ready; not verified_member
          currentStep: "welcome_email",
          payload: data.payload,
        })
        .returning({ id: programMembers.id });

      await syncJoinApplicationProjection(record.id);

      let emailSent = false;
      try {
        const result = await sendJoinNotificationEmails(data, {
          programMemberId: member?.id,
        });
        emailSent = result.sent;
      } catch (emailError) {
        console.error("Community welcome email failed:", emailError);
      }

      return {
        ok: true,
        error: "",
        submittedType: "community",
        fieldErrors: {},
        emailSent,
      };
    }

    // ── Youth / mentor: existing flow (unchanged) ──
    const [record] = await db
      .insert(joinApplications)
      .values({
        applicationType: data.applicationType,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        location: data.location,
        ageRange: data.ageRange,
        sex: data.sex,
        skills: data.skills,
        skillsOther: data.skillsOther,
        skillsToLearn: data.skillsToLearn,
        availability: data.availability,
        whyJoin: data.whyJoin,
        faithBornAgain: data.faithBornAgain,
        faithHolySpirit: data.faithHolySpirit,
        testimony: data.testimony,
        status: "pending",
        consent: data.consent,
        payload: data.payload,
      })
      .returning({ id: joinApplications.id });

    const [user] = await db
      .insert(users)
      .values({
        email: data.email,
        name: data.fullName,
        firstName,
        lastName,
        emailVerified: false,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          name: data.fullName,
          firstName,
          lastName,
          updatedAt: new Date(),
        },
      })
      .returning({ id: users.id });

    if (!user?.id) {
      throw new Error("Could not create or locate user account.");
    }

    const [member] = await db
      .insert(programMembers)
      .values({
        joinApplicationId: record.id,
        userId: user.id,
        role: data.applicationType,
        fullName: data.fullName,
        email: data.email,
        status: getInitialProgramStatus(data),
        currentStep: getInitialProgramStep(data),
        payload: data.payload,
      })
      .returning({ id: programMembers.id });

    if (data.applicationType === "youth" && member?.id) {
      await enrollMemberInWorkbookProgram(member.id);
    }

    await syncJoinApplicationProjection(record.id);

    let emailSent = false;
    try {
      const result = await sendJoinNotificationEmails(data, {
        programMemberId: member?.id,
      });
      emailSent = result.sent;
    } catch (emailError) {
      console.error("Join email notification failed:", emailError);
    }

    return {
      ok: true,
      error: "",
      submittedType: data.applicationType,
      fieldErrors: {},
      emailSent,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save application.";
    console.error("submitJoinApplication failed", error);
    return { ...initialState, error: message };
  }
}
