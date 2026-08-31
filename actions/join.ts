"use server";

import { db } from "@/db";
import {
  joinApplications,
  programMembers,
  users,
} from "@/db/schema";
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
  formData: FormData
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

    const [record] = await db
      .insert(joinApplications)
      .values({
        applicationType: parsed.data.applicationType,
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        phoneNumber: parsed.data.phoneNumber,
        location: parsed.data.location,
        ageRange: parsed.data.ageRange,
        sex: parsed.data.sex,
        skills: parsed.data.skills,
        skillsOther: parsed.data.skillsOther,
        skillsToLearn: parsed.data.skillsToLearn,
        availability: parsed.data.availability,
        whyJoin: parsed.data.whyJoin,
        faithBornAgain: parsed.data.faithBornAgain,
        faithHolySpirit: parsed.data.faithHolySpirit,
        testimony: parsed.data.testimony,
        status: "pending",
        consent: parsed.data.consent,
        payload: parsed.data.payload,
      })
      .returning({ id: joinApplications.id });

    void record;

    const { firstName, lastName } = splitFullName(parsed.data.fullName);

    const [user] = await db
      .insert(users)
      .values({
        email: parsed.data.email,
        name: parsed.data.fullName,
        firstName,
        lastName,
        emailVerified: false,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          name: parsed.data.fullName,
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
        role: parsed.data.applicationType,
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        status: getInitialProgramStatus(parsed.data),
        currentStep: getInitialProgramStep(parsed.data),
        payload: parsed.data.payload,
      })
      .returning({ id: programMembers.id });

    if (parsed.data.applicationType === "youth" && member?.id) {
      await enrollMemberInWorkbookProgram(member.id);
    }

    await syncJoinApplicationProjection(record.id);

    let emailSent = false;
    try {
      const result = await sendJoinNotificationEmails(parsed.data, {
        programMemberId: member?.id,
      });
      emailSent = result.sent;
    } catch (emailError) {
      console.error("Join email notification failed:", emailError);
    }

    return {
      ok: true,
      error: "",
      submittedType: parsed.data.applicationType,
      fieldErrors: {},
      emailSent,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save application.";
    return { ...initialState, error: message };
  }
}
