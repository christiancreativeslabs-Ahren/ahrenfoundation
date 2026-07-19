import type { JoinTab } from "@/types/join";
import type { JoinFieldErrors } from "@/types/join";
import { db } from "@/db";
import { emailEvents } from "@/db/schema";
import {
  adminJoinNotificationEmail,
  mentorWelcomeEmail,
  sendResendEmail,
  youthWelcomeEmail,
} from "@/lib/email";

export type JoinParsedData = {
  applicationType: JoinTab;
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  consent: boolean;
  payload: Record<string, unknown>;
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function splitAdminEmails(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function requireText(fieldErrors: JoinFieldErrors, key: string, value: string, label: string) {
  if (!value) {
    fieldErrors[key] = `${label} is required.`;
  }
}

function requireAtLeastOne(fieldErrors: JoinFieldErrors, key: string, values: string[], label: string) {
  if (!values.length) {
    fieldErrors[key] = `Please select at least one ${label}.`;
  }
}

function requireYesNo(fieldErrors: JoinFieldErrors, key: string, value: string, label: string) {
  if (value !== "yes" && value !== "no") {
    fieldErrors[key] = `Please answer ${label}.`;
  }
}

export function parseJoinApplication(formData: FormData): {
  data: JoinParsedData | null;
  fieldErrors: JoinFieldErrors;
} {
  const applicationType = String(formData.get("application_type") ?? "") as JoinTab;
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phoneNumber = String(formData.get("phone_number") ?? "").trim();
  const consent = String(formData.get("consent") ?? "") === "true";
  const fieldErrors: JoinFieldErrors = {};

  if (applicationType !== "youth" && applicationType !== "mentor") {
    fieldErrors.application_type = "Choose an application type.";
  }

  requireText(fieldErrors, "full_name", fullName, "Full name");
  requireText(fieldErrors, "email", email, "Email address");
  requireText(fieldErrors, "phone_number", phoneNumber, "Phone number");

  if (email && !isEmail(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (!consent) {
    fieldErrors.consent = "You must agree before submitting.";
  }

  if (applicationType === "youth") {
    const location = String(formData.get("country_state") ?? "").trim();
    const ageRange = String(formData.get("age_range") ?? "").trim();
    const skills = formData.getAll("skills").map(String).filter(Boolean);
    const otherEnabled = String(formData.get("skills_other_enabled") ?? "") === "other";
    const otherSkill = String(formData.get("skills_other") ?? "").trim();
    const skillsToLearn = String(formData.get("skills_to_learn") ?? "").trim();
    const whyJoin = String(formData.get("why_join") ?? "").trim();
    const projectExperience = String(formData.get("project_experience") ?? "").trim();
    const participationFormats = formData.getAll("participation_formats").map(String).filter(Boolean);
    const faithBornAgain = String(formData.get("faith_born_again") ?? "");
    const faithHolySpirit = String(formData.get("faith_holy_spirit") ?? "");
    const faithDependency = String(formData.get("faith_dependency") ?? "");
    const testimony = String(formData.get("testimony") ?? "").trim();
    const church = String(formData.get("church") ?? "").trim();

    requireText(fieldErrors, "country_state", location, "Country / State");
    requireText(fieldErrors, "age_range", ageRange, "Age range");
    requireAtLeastOne(fieldErrors, "skills", skills, "skill");
    requireText(fieldErrors, "skills_to_learn", skillsToLearn, "Learning goals");
    requireText(fieldErrors, "why_join", whyJoin, "Motivation");
    requireAtLeastOne(fieldErrors, "participation_formats", participationFormats, "participation format");
    requireYesNo(fieldErrors, "faith_born_again", faithBornAgain, "whether you are born again");
    requireYesNo(fieldErrors, "faith_holy_spirit", faithHolySpirit, "whether you received the baptism of the Holy Spirit");
    requireYesNo(fieldErrors, "faith_dependency", faithDependency, "your dependence on the Holy Spirit");
    requireText(fieldErrors, "testimony", testimony, "Testimony");

    if (otherEnabled && !otherSkill) {
      fieldErrors.skills_other = "Please specify your other skill.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { data: null, fieldErrors };
    }

    return {
      data: {
        applicationType,
        fullName,
        email,
        phoneNumber,
        location,
        consent,
        payload: {
          ageRange,
          skills,
          otherSkill,
          skillsToLearn,
          motivation: whyJoin,
          projectExperience,
          participationFormats,
          faith: {
            bornAgain: faithBornAgain,
            holySpirit: faithHolySpirit,
            dependency: faithDependency,
          },
          testimony,
          church,
        },
      },
      fieldErrors,
    };
  }

  const location = String(formData.get("country_continent") ?? "").trim();
  const profession = String(formData.get("profession") ?? "").trim();
  const yearsExperience = String(formData.get("years_experience") ?? "").trim();
  const expertise = formData.getAll("expertise").map(String).filter(Boolean);
  const otherEnabled = String(formData.get("expertise_other_enabled") ?? "") === "other";
  const otherExpertise = String(formData.get("expertise_other") ?? "").trim();
  const whyMentor = String(formData.get("why_mentor") ?? "").trim();
  const commitment = String(formData.get("commitment") ?? "").trim();
  const preferredFormat = String(formData.get("preferred_format") ?? "").trim();
  const faithBornAgain = String(formData.get("mentor_faith_born_again") ?? "");
  const faithHolySpirit = String(formData.get("mentor_faith_holy_spirit") ?? "");
  const faithDependency = String(formData.get("mentor_faith_dependency") ?? "");
  const testimony = String(formData.get("testimony") ?? "").trim();
  const church = String(formData.get("church") ?? "").trim();

  requireText(fieldErrors, "country_continent", location, "Country / Continent");
  requireText(fieldErrors, "profession", profession, "Profession / Industry");
  requireText(fieldErrors, "years_experience", yearsExperience, "Years of experience");
  requireAtLeastOne(fieldErrors, "expertise", expertise, "area of expertise");
  requireText(fieldErrors, "why_mentor", whyMentor, "Mentorship reason");
  requireText(fieldErrors, "commitment", commitment, "Commitment level");
  requireText(fieldErrors, "preferred_format", preferredFormat, "Preferred mentorship format");
  requireYesNo(fieldErrors, "mentor_faith_born_again", faithBornAgain, "whether you are born again");
  requireYesNo(fieldErrors, "mentor_faith_holy_spirit", faithHolySpirit, "whether you received the baptism of the Holy Spirit");
  requireYesNo(fieldErrors, "mentor_faith_dependency", faithDependency, "your dependence on the Holy Spirit");
  requireText(fieldErrors, "testimony", testimony, "Testimony");

  if (otherEnabled && !otherExpertise) {
    fieldErrors.expertise_other = "Please specify your other area of expertise.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { data: null, fieldErrors };
  }

  return {
    data: {
      applicationType,
      fullName,
      email,
      phoneNumber,
      location,
      consent,
      payload: {
        profession,
        yearsExperience,
        expertise,
        otherExpertise,
        mentorshipReason: whyMentor,
        commitment,
        preferredFormat,
        faith: {
          bornAgain: faithBornAgain,
          holySpirit: faithHolySpirit,
          dependency: faithDependency,
        },
        testimony,
        church,
      },
    },
    fieldErrors,
  };
}

async function sendAndLogJoinEmail(
  payload: ReturnType<typeof youthWelcomeEmail>,
  context: { programMemberId?: string } = {},
) {
  try {
    const result = await sendResendEmail(payload);
    await db.insert(emailEvents).values({
      programMemberId: context.programMemberId ?? null,
      recipientEmail: Array.isArray(payload.to) ? payload.to.join(",") : payload.to,
      templateKey: payload.templateKey,
      status: result.sent ? "sent" : "skipped",
      providerId: result.providerId,
      sentAt: result.sent ? new Date() : null,
      payload: {
        subject: payload.subject,
      },
    });
    return result;
  } catch (error) {
    await db.insert(emailEvents).values({
      programMemberId: context.programMemberId ?? null,
      recipientEmail: Array.isArray(payload.to) ? payload.to.join(",") : payload.to,
      templateKey: payload.templateKey,
      status: "failed",
      error: error instanceof Error ? error.message : "Join email failed.",
      payload: {
        subject: payload.subject,
      },
    });
    throw error;
  }
}

export async function sendJoinNotificationEmails(
  data: JoinParsedData,
  context: { programMemberId?: string } = {},
) {
  const applicantEmail =
    data.applicationType === "mentor"
      ? mentorWelcomeEmail(data)
      : youthWelcomeEmail(data);
  const adminEmail = adminJoinNotificationEmail(data);

  const applicantResult = await sendAndLogJoinEmail(applicantEmail, context);
  if (adminEmail) {
    await sendAndLogJoinEmail(adminEmail);
  }

  return {
    sent: applicantResult.sent,
    skipped: applicantResult.skipped,
  };
}

export function getAdminEmails() {
  return splitAdminEmails(process.env.ADMIN_EMAILS);
}
