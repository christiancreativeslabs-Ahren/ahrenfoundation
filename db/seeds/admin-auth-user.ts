import { eq } from "drizzle-orm";
import { auth } from "../../lib/auth/auth";
import { db } from "../drizzle.transaction";
import { users } from "../schema";

const ADMIN_EMAIL = "christiancreativeslabs@gmail.com";
const ADMIN_NAME = "Christian Creatives Labs";
const ADMIN_FIRST_NAME = "Christian Creatives";
const ADMIN_LAST_NAME = "Labs";
const DEV_FALLBACK_PASSWORD = "AhrenAdmin123!";

function getSeedPassword() {
  const password = process.env.ADMIN_SEED_PASSWORD?.trim();
  if (password) return password;

  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SEED_PASSWORD is required when NODE_ENV=production.");
  }

  return DEV_FALLBACK_PASSWORD;
}

function adminEmailsIncludesSeedUser() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .includes(ADMIN_EMAIL);
}

async function ensureAdminAuthUser() {
  const now = new Date();
  const password = getSeedPassword();

  const existing = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.email, ADMIN_EMAIL))
    .limit(1);

  let user = existing[0];

  if (!user) {
    const signupResult = await auth.api.signUpEmail({
      body: {
        email: ADMIN_EMAIL,
        firstName: ADMIN_FIRST_NAME,
        lastName: ADMIN_LAST_NAME,
        name: ADMIN_NAME,
        password,
      },
    });

    if (!signupResult?.user?.id) {
      throw new Error(`Failed to create admin auth user ${ADMIN_EMAIL}.`);
    }

    user = {
      id: signupResult.user.id,
      email: signupResult.user.email,
    };

    console.log(`Admin auth user created with Better Auth: ${user.email}`);
  } else {
    console.log(`Admin auth user already exists: ${user.email}`);
    console.log(
      "Existing password was not changed because this seed follows the HOTR signUpEmail pattern.",
    );
  }

  await db
    .update(users)
    .set({
      emailVerified: true,
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      name: ADMIN_NAME,
      updatedAt: now,
    })
    .where(eq(users.id, user.id));

  if (!adminEmailsIncludesSeedUser()) {
    console.warn(
      `ADMIN_EMAILS does not include ${ADMIN_EMAIL}. Add it before logging into /admin.`,
    );
  }

  if (!process.env.ADMIN_SEED_PASSWORD) {
    console.warn(`Using development fallback password: ${DEV_FALLBACK_PASSWORD}`);
  }
}

ensureAdminAuthUser().catch((error) => {
  console.error("Fatal error while seeding admin auth user:", error);
  process.exit(1);
});
