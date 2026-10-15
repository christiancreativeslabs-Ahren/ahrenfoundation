import type { JoinTab } from "@/types/join";
import type { JoinFieldErrors } from "@/types/join";
import { db } from "@/db";
import { emailEvents } from "@/db/schema";
import {
  adminJoinNotificationEmail,
  communityWelcomeEmail,
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
  ageRange?: string;
  sex?: string;
  skills?: string[];
  skillsOther?: string;
  skillsToLearn?: string;
  availability?: string[];
  whyJoin?: string;
  faithBornAgain?: string;
  faithHolySpirit?: string;
  testimony?: string;
  /** Community only */
  participationInterests?: string[];
  participationOther?: string;
  /** Community only — used to create login, never stored on join_application */
  password?: string;
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

function requireText(
  fieldErrors: JoinFieldErrors,
  key: string,
  value: string,
  label: string,
) {
  if (!value) {
    fieldErrors[key] = `${label} is required.`;
  }
}

function requireAtLeastOne(
  fieldErrors: JoinFieldErrors,
  key: string,
  values: string[],
  label: string,
) {
  if (!values.length) {
    fieldErrors[key] = `Please select at least one ${label}.`;
  }
}

function requireYesNo(
  fieldErrors: JoinFieldErrors,
  key: string,
  value: string,
  label: string,
) {
  if (value !== "yes" && value !== "no") {
    fieldErrors[key] = `Please answer ${label}.`;
  }
}

export function parseJoinApplication(formData: FormData): {
  data: JoinParsedData | null;
  fieldErrors: JoinFieldErrors;
} {
  const applicationType = String(
    formData.get("application_type") ?? "",
  ) as JoinTab;

  if (applicationType === "community") {
    return parseCommunityApplication(formData);
  }

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
    const sex = String(formData.get("sex") ?? "").trim();
    const skills = formData.getAll("skills").map(String).filter(Boolean);
    const otherEnabled =
      String(formData.get("skills_other_enabled") ?? "") === "other";
    const otherSkill = String(formData.get("skills_other") ?? "").trim();
    const skillsToLearn = String(formData.get("skills_to_learn") ?? "").trim();
    const whyJoin = String(formData.get("why_join") ?? "").trim();
    const availability = formData
      .getAll("availability")
      .map(String)
      .filter(Boolean);
    const faithBornAgain = String(formData.get("faith_born_again") ?? "");
    const faithHolySpirit = String(formData.get("faith_holy_spirit") ?? "");
    const testimony = String(formData.get("testimony") ?? "").trim();

    requireText(fieldErrors, "country_state", location, "Country / State");
    requireText(fieldErrors, "age_range", ageRange, "Age range");
    requireText(fieldErrors, "sex", sex, "Sex");
    requireAtLeastOne(fieldErrors, "skills", skills, "skill");
    requireText(
      fieldErrors,
      "skills_to_learn",
      skillsToLearn,
      "Learning goals",
    );
    requireText(fieldErrors, "why_join", whyJoin, "Motivation");
    requireAtLeastOne(
      fieldErrors,
      "availability",
      availability,
      "availability option",
    );
    requireYesNo(
      fieldErrors,
      "faith_born_again",
      faithBornAgain,
      "whether you are born again",
    );
    requireYesNo(
      fieldErrors,
      "faith_holy_spirit",
      faithHolySpirit,
      "whether you received the baptism of the Holy Spirit",
    );
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
        ageRange,
        sex,
        skills,
        skillsOther: otherSkill,
        skillsToLearn,
        availability,
        whyJoin,
        faithBornAgain,
        faithHolySpirit,
        testimony,
        payload: {
          ageRange,
          sex,
          skills,
          skillsOther: otherSkill,
          skillsToLearn,
          availability,
          whyJoin,
          faithBornAgain,
          faithHolySpirit,
          testimony,
        },
      },
      fieldErrors,
    };
  }

  const location = String(formData.get("country_continent") ?? "").trim();
  const profession = String(formData.get("profession") ?? "").trim();
  const yearsExperience = String(formData.get("years_experience") ?? "").trim();
  const expertise = formData.getAll("expertise").map(String).filter(Boolean);
  const otherEnabled =
    String(formData.get("expertise_other_enabled") ?? "") === "other";
  const otherExpertise = String(formData.get("expertise_other") ?? "").trim();
  const whyMentor = String(formData.get("why_mentor") ?? "").trim();
  const commitment = String(formData.get("commitment") ?? "").trim();
  const preferredFormat = String(formData.get("preferred_format") ?? "").trim();
  const faithBornAgain = String(formData.get("mentor_faith_born_again") ?? "");
  const faithHolySpirit = String(
    formData.get("mentor_faith_holy_spirit") ?? "",
  );
  const faithDependency = String(formData.get("mentor_faith_dependency") ?? "");
  const testimony = String(formData.get("testimony") ?? "").trim();
  const church = String(formData.get("church") ?? "").trim();

  requireText(
    fieldErrors,
    "country_continent",
    location,
    "Country / Continent",
  );
  requireText(fieldErrors, "profession", profession, "Profession / Industry");
  requireText(
    fieldErrors,
    "years_experience",
    yearsExperience,
    "Years of experience",
  );
  requireAtLeastOne(fieldErrors, "expertise", expertise, "area of expertise");
  requireText(fieldErrors, "why_mentor", whyMentor, "Mentorship reason");
  requireText(fieldErrors, "commitment", commitment, "Commitment level");
  requireText(
    fieldErrors,
    "preferred_format",
    preferredFormat,
    "Preferred mentorship format",
  );
  requireYesNo(
    fieldErrors,
    "mentor_faith_born_again",
    faithBornAgain,
    "whether you are born again",
  );
  requireYesNo(
    fieldErrors,
    "mentor_faith_holy_spirit",
    faithHolySpirit,
    "whether you received the baptism of the Holy Spirit",
  );
  requireYesNo(
    fieldErrors,
    "mentor_faith_dependency",
    faithDependency,
    "your dependence on the Holy Spirit",
  );
  requireText(fieldErrors, "testimony", testimony, "Testimony");

  if (otherEnabled && !otherExpertise) {
    fieldErrors.expertise_other =
      "Please specify your other area of expertise.";
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
    // Join-form emails should use Resend for now while we keep Nodemailer disabled on this path.
    const result = await sendResendEmail(payload, { provider: "resend" });
    await db.insert(emailEvents).values({
      programMemberId: context.programMemberId ?? null,
      recipientEmail: Array.isArray(payload.to)
        ? payload.to.join(",")
        : payload.to,
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
      recipientEmail: Array.isArray(payload.to)
        ? payload.to.join(",")
        : payload.to,
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
  // const applicantEmail =
  //   data.applicationType === "mentor"
  //     ? mentorWelcomeEmail(data)
  //     : youthWelcomeEmail(data);

  const applicantEmail =
    data.applicationType === "mentor"
      ? mentorWelcomeEmail(data)
      : youthWelcomeEmail(data);

  // : data.applicationType === "community"
  // ? communityWelcomeEmail(data)

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
  return Array.from(
    new Set([
      "christiancreativeslabs@gmail.com",
      ...splitAdminEmails(process.env.ADMIN_EMAILS),
    ]),
  );
}

const COMMUNITY_AGE_RANGES = [
  "16-18",
  "19-22",
  "23-26",
  "27-30",
  "31-35",
] as const;

const COMMUNITY_SKILL_OPTIONS = [
  "Software Development",
  "UI/UX Design",
  "Graphic Design",
  "Video Production",
  "Audio Engineering",
  "Writing / Content Creation",
  "Digital Marketing",
  "Data Science / AI",
  "Photography",
  "Music / Singing",
  "Animation",
  "Product Management",
  "Cybersecurity",
] as const;

const COMMUNITY_PARTICIPATION_OPTIONS = [
  "Join a mentorship group",
  "Attend live trainings and events",
  "Share my creative work on the platform",
  "Connect with other Christian creatives",
  "Become a mentor (if qualified)",
  "Volunteer with Ahren Foundation",
] as const;

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getStringArray(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean);
}

function parseCommunityApplication(formData: FormData): {
  data: JoinParsedData | null;
  fieldErrors: JoinFieldErrors;
} {
  const fieldErrors: JoinFieldErrors = {};

  const fullName = getString(formData, "full_name");
  const email = getString(formData, "email").toLowerCase();
  const phoneNumber = getString(formData, "phone_number");
  const sex = getString(formData, "sex");
  const ageRange = getString(formData, "age_range");
  const location = getString(formData, "country_state");
  const skills = getStringArray(formData, "skills");
  const skillsOtherEnabled =
    formData.get("skills_other_enabled") === "other" ||
    skills.includes("other");
  const skillsOther = getString(formData, "skills_other");
  const skillsToLearn = getString(formData, "skills_to_learn");
  const participation = getStringArray(formData, "participation");
  const participationOtherEnabled =
    formData.get("participation_other_enabled") === "other" ||
    participation.includes("other");
  const participationOther = getString(formData, "participation_other");
  const whyJoin = getString(formData, "why_join");
  const password = getString(formData, "password");
  const passwordConfirm = getString(formData, "password_confirm");
  const consent = formData.get("consent") === "true";

  if (!fullName) fieldErrors.full_name = "Full name is required.";
  if (!email || !isEmail(email)) {
    fieldErrors.email = "A valid email is required.";
  }
  if (!phoneNumber) fieldErrors.phone_number = "Phone number is required.";
  if (!sex || !["Male", "Female"].includes(sex)) {
    fieldErrors.sex = "Select gender.";
  }
  if (
    !ageRange ||
    !COMMUNITY_AGE_RANGES.includes(
      ageRange as (typeof COMMUNITY_AGE_RANGES)[number],
    )
  ) {
    fieldErrors.age_range = "Select an age range.";
  }
  if (!location) fieldErrors.country_state = "Country / state is required.";

  const normalizedSkills = skills.filter((s) => s !== "other");
  if (normalizedSkills.length === 0 && !skillsOtherEnabled) {
    fieldErrors.skills = "Select at least one skill.";
  }
  if (skillsOtherEnabled && !skillsOther) {
    fieldErrors.skills_other = "Please specify your other skill.";
  }
  if (!skillsToLearn) {
    fieldErrors.skills_to_learn = "Tell us what you want to learn.";
  }

  const normalizedParticipation = participation.filter((p) => p !== "other");
  if (normalizedParticipation.length === 0 && !participationOtherEnabled) {
    fieldErrors.participation = "Select at least one option.";
  }
  if (participationOtherEnabled && !participationOther) {
    fieldErrors.participation_other = "Please specify.";
  }

  if (!whyJoin) {
    fieldErrors.why_join = "Tell us what you hope to gain.";
  }

  if (!password || password.length < 8) {
    fieldErrors.password = "Password must be at least 8 characters.";
  }
  if (password !== passwordConfirm) {
    fieldErrors.password_confirm = "Passwords do not match.";
  }

  if (!consent) {
    fieldErrors.consent = "You must agree before submitting.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { data: null, fieldErrors };
  }

  return {
    data: {
      applicationType: "community",
      fullName,
      email,
      phoneNumber,
      location,
      consent: true,
      ageRange,
      sex,
      skills: normalizedSkills,
      skillsOther: skillsOtherEnabled ? skillsOther : undefined,
      skillsToLearn,
      participationInterests: normalizedParticipation,
      participationOther: participationOtherEnabled
        ? participationOther
        : undefined,
      whyJoin,
      password,
      payload: {
        source: "community_hub",
        participationInterests: normalizedParticipation,
        participationOther: participationOtherEnabled
          ? participationOther
          : undefined,
      },
    },
    fieldErrors: {},
  };
}
