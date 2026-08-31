import { auth } from "@/lib/auth/auth";
import { db } from "../drizzle.transaction";
import { eq, desc } from "drizzle-orm";
import { joinApplications, programMembers, users } from "@/db/schema";

type MentorSeedEntry = {
  fullName: string;
  email?: string;
  phoneNumber?: string;
  availability?: string;
  notes?: string;
};

const MENTOR_SEED_PASSWORD =
  process.env.MENTOR_SEED_PASSWORD?.trim() || "AhrenMentor123!";

const MENTORS: MentorSeedEntry[] = [
  {
    fullName: "Samuel Shola",
    email: "sholy.sam007@gmail.com",
    phoneNumber: "07034937176",
    availability: "Available",
  },
  {
    fullName: "Ibidun Adeleke",
    email: "ibidun.adeleke@gmail.com",
    phoneNumber: "08057669446",
    availability: "Available",
  },
  {
    fullName: "Prince Ogabi",
    email: "ogabiprince@gmail.com",
    phoneNumber: "07034633401",
    availability: "Available",
  },
  {
    fullName: "Osagie Itamah",
    email: "Itamahosagie@gmail.com",
    phoneNumber: "07039801203",
    availability: "Available",
  },
  {
    fullName: "Ogbebor Kenneth",
    email: "ogbebor10@gmail.com",
    phoneNumber: "08033911067",
    availability: "Available",
  },
  {
    fullName: "Dozie Aliboh",
    email: "dozielights@gmail.com",
    phoneNumber: "08037474227",
    availability: "Available",
  },
  {
    fullName: "Inimfon Charles Joseph",
    email: "inimfoncharles@gmail.com",
    phoneNumber: "08036145143",
    availability: "N/A",
  },
  {
    fullName: "Chelsea Ifeyinwa Obianwu",
    email: "chelseaify@gmail.com",
    phoneNumber: "08036376088",
    availability: "",
  },
  {
    fullName: "Olamide Joseph",
    email: "oladimejiolamide40@gmail.com",
    phoneNumber: "08061275158",
    availability: "N/A",
  },
  {
    fullName: "Tolulope Fadare",
    email: "tolufadare23@gmail.com",
    phoneNumber: "08139324572",
    availability: "Available",
  },
  {
    fullName: "Taiwo Oladipupo",
    email: "taiwozenith@gmail.com",
    phoneNumber: "",
    availability: "Available",
  },
  {
    fullName: "Stephanie Oyelade",
    email: "soyelade@gmail.com",
    phoneNumber: "",
    availability: "Available",
  },
  {
    fullName: "Segun Zacchaeus Akinwale",
    email: "akinwaleza@gmail.com",
    phoneNumber: "2349012048912",
    availability: "Available",
  },
  {
    fullName: "Ifeoluwa Odugbesan",
    email: "odugbesanife@gmail.com",
    phoneNumber: "",
    availability: "Available",
  },
  {
    fullName: "Olumide Abogunloko",
    email: "olumideabogunloko@gmail.com",
    phoneNumber: "",
    availability: "Available",
  },
  {
    fullName: "Joshua Akinyoade",
    email: "joshua.akinyoade@gmail.com",
    phoneNumber: "",
    availability: "",
  },
  {
    fullName: "John Akinola",
    email: "akinolajohnayomide@gmail.com",
    phoneNumber: "",
    availability: "Available",
  },
  {
    fullName: "Emmanuel Emeka Joseph",
    email: "Opcode3@gmail.com",
    phoneNumber: "",
    availability: "Available",
  },
  {
    fullName: "Dien Bassey",
    email: "dienbassey@gmail.com",
    phoneNumber: "",
    availability: "",
  },
  {
    fullName: "Emmanuel Shiawoya",
    email: "emmanuelshiawoya@gmail.com",
    phoneNumber: "",
    availability: "",
  },
  {
    fullName: "Caleb Adamu",
    email: "creoimagery@gmail.com",
    phoneNumber: "",
    availability: "Not sure",
  },
  {
    fullName: "Emmauel Akin-Williams",
    email: "hakinwilliams@gmail.com",
    phoneNumber: "",
    availability: "Available",
  },
  {
    fullName: "Tolulope Akin-Williams",
    email: "lizzywilliams4sure@gmail.com",
    phoneNumber: "",
    availability: "",
  },
  {
    fullName: "Oluwafolakemi Ajala",
    email: "oluwafolakemiajala@gmail.com",
    phoneNumber: "08069234875",
    availability: "Available",
  },
  {
    fullName: "Michael Oshamika",
    email: "michaeloshamika@gmail.com",
    phoneNumber: "8130703165",
    availability: "N/A",
  },
  {
    fullName: "Edidiong James",
    email: "edidiongjames23@gmail.com",
    phoneNumber: "",
    availability: "Available",
  },
  {
    fullName: "Miracle Mike-Ndubueze",
    email: "",
    phoneNumber: "",
    availability: "Available",
    notes: "Branding Facilitator",
  },
  {
    fullName: "Demilalde Toriola",
    email: "",
    phoneNumber: "",
    availability: "",
  },
  {
    fullName: "Grace Iroh",
    email: "irohgrace228@gmail.com",
    phoneNumber: "08188857434",
    availability: "Available",
  },
  {
    fullName: "Tobi Ayelaagbe",
    email: "ayelaagbeo@gmail.com",
    phoneNumber: "08168828307",
    availability: "Available",
  },
  {
    fullName: "Eweloghena Oreunomhe",
    email: "eweloghena@gmail.com",
    phoneNumber: "08163113054",
    availability: "Available",
  },
];

function normalize(
  value: string | undefined | null,
  fallback = "Not provided"
) {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function splitName(fullName: string) {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  const parts = trimmed.split(" ");
  const firstName = parts[0] ?? trimmed;
  const lastName =
    parts.length > 1 ? parts.slice(1).join(" ") : (parts[0] ?? trimmed);
  return { firstName, lastName };
}

async function ensureAuthUser(entry: MentorSeedEntry) {
  if (!entry.email?.trim()) {
    return null;
  }

  const email = normalizeEmail(entry.email);
  const [existingUser] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    await db
      .update(users)
      .set({
        name: entry.fullName.trim(),
        firstName: splitName(entry.fullName).firstName,
        lastName: splitName(entry.fullName).lastName,
        emailVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existingUser.id));

    return existingUser;
  }

  const { firstName, lastName } = splitName(entry.fullName);
  const signupResult = await auth.api.signUpEmail({
    body: {
      email,
      password: MENTOR_SEED_PASSWORD,
      name: entry.fullName.trim(),
      firstName,
      lastName,
    },
  });

  if (!signupResult?.user?.id) {
    throw new Error(`Failed to create Better Auth user for ${entry.fullName}.`);
  }

  await db
    .update(users)
    .set({
      name: entry.fullName.trim(),
      firstName,
      lastName,
      emailVerified: true,
      updatedAt: new Date(),
    })
    .where(eq(users.id, signupResult.user.id));

  return {
    id: signupResult.user.id,
    email: signupResult.user.email,
  };
}

async function upsertMentorRecord(entry: MentorSeedEntry, authUserId: string) {
  const email = normalizeEmail(entry.email ?? "");

  const [application] = await db
    .select()
    .from(joinApplications)
    .where(eq(joinApplications.email, email))
    .orderBy(desc(joinApplications.updatedAt))
    .limit(1);

  const now = new Date();
  const applicationValues = {
    applicationType: "mentor" as const,
    fullName: entry.fullName.trim(),
    email,
    phoneNumber: normalize(entry.phoneNumber),
    location: "Not provided",
    ageRange: null,
    sex: null,
    skills: null,
    skillsOther: null,
    skillsToLearn: null,
    availability: null,
    whyJoin: null,
    faithBornAgain: null,
    faithHolySpirit: null,
    testimony: null,
    status: "approved",
    consent: true,
    payload: {
      seededFrom: "mentor_seed",
      availability: normalize(entry.availability, ""),
      notes: normalize(entry.notes, ""),
    },
  };

  const joinApplication =
    application ??
    (
      await db.insert(joinApplications).values(applicationValues).returning()
    )[0];

  if (!joinApplication) {
    throw new Error(
      `Failed to upsert mentor application for ${entry.fullName}.`
    );
  }

  const [existingMember] = await db
    .select()
    .from(programMembers)
    .where(eq(programMembers.joinApplicationId, joinApplication.id))
    .limit(1);

  const memberValues = {
    joinApplicationId: joinApplication.id,
    userId: authUserId,
    role: "mentor" as const,
    fullName: entry.fullName.trim(),
    email,
    status: "verified_mentor",
    currentStep: "dashboard_access",
    verifiedAt: now,
    loginCredentialsSentAt: now,
    payload: {
      seededFrom: "mentor_seed",
      phoneNumber: normalize(entry.phoneNumber, ""),
      availability: normalize(entry.availability, ""),
      notes: normalize(entry.notes, ""),
    },
    updatedAt: now,
  };

  if (existingMember) {
    await db
      .update(programMembers)
      .set(memberValues)
      .where(eq(programMembers.id, existingMember.id));
    return {
      joinApplicationId: joinApplication.id,
      memberId: existingMember.id,
      created: false,
    };
  }

  const [createdMember] = await db
    .insert(programMembers)
    .values(memberValues)
    .returning();

  if (!createdMember) {
    throw new Error(`Failed to create mentor member for ${entry.fullName}.`);
  }

  return {
    joinApplicationId: joinApplication.id,
    memberId: createdMember.id,
    created: true,
  };
}

async function seedMentors() {
  console.log("🌱 Seeding mentor auth users and mentor records...");

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const entry of MENTORS) {
    const email = entry.email?.trim();
    if (!email) {
      skipped += 1;
      console.warn(
        `Skipping ${entry.fullName} because no email address was provided.`
      );
      continue;
    }

    const authUser = await ensureAuthUser(entry);
    if (!authUser?.id) {
      skipped += 1;
      console.warn(
        `Skipping ${entry.fullName} because auth user creation failed.`
      );
      continue;
    }

    const result = await upsertMentorRecord(entry, authUser.id);
    if (result.created) {
      created += 1;
    } else {
      updated += 1;
    }
  }

  console.log(
    `Mentor seed complete. Created: ${created}, updated: ${updated}, skipped: ${skipped}.`
  );
}

seedMentors().catch((error) => {
  console.error("Fatal error while seeding mentors:", error);
  process.exit(1);
});
