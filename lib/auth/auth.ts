import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { parseSetCookieHeader } from "better-auth/cookies";
import { createAuthMiddleware } from "better-auth/api";
import { APIError } from "@better-auth/core/error";
import { sql } from "drizzle-orm";
import type { BetterAuthPlugin } from "better-auth";
import { db } from "@/db";
import { accounts, programMembers, sessions, users, verifications } from "@/db/schema";
import { passwordResetEmail, sendEmail } from "@/lib/email";
import { getAdminEmails } from "@/lib/validations/join";

const VERIFIED_ACCESS_STATUSES = new Set(["verified_member", "verified_mentor"]);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function loginBlockedError() {
  return APIError.from("FORBIDDEN", {
    code: "ACCOUNT_NOT_VERIFIED",
    message:
      "Your account is not yet verified for login. Please wait for admin approval.",
  });
}

async function isAllowedToSignIn(email: string) {
  const normalizedEmail = normalizeEmail(email);

  if (getAdminEmails().includes(normalizedEmail)) {
    return { allowed: true, isAdmin: true, hasProgramMembership: false };
  }

  const [user] = await db
    .select({
      emailVerified: users.emailVerified,
    })
    .from(users)
    .where(sql`lower(${users.email}) = ${normalizedEmail}`)
    .limit(1);

  const [member] = await db
    .select({
      status: programMembers.status,
    })
    .from(programMembers)
    .where(sql`lower(${programMembers.email}) = ${normalizedEmail}`)
    .limit(1);

  const hasProgramMembership = Boolean(member);
  const allowed =
    Boolean(user?.emailVerified) &&
    Boolean(member?.status) &&
    VERIFIED_ACCESS_STATUSES.has(member.status);

  return {
    allowed,
    isAdmin: false,
    hasProgramMembership,
  };
}

function createVerifiedAccessPlugin(): BetterAuthPlugin {
  return {
    id: "ahren-verified-access-gate",
    hooks: {
      before: [
        {
          matcher(context: { path?: string }) {
            return context.path === "/sign-in/email";
          },
          handler: createAuthMiddleware(async (ctx) => {
            const email = typeof ctx.body?.email === "string" ? ctx.body.email : "";
            if (!email) return;

            const access = await isAllowedToSignIn(email);
            if (!access.allowed) {
              throw loginBlockedError();
            }
          }),
        },
        {
          matcher(context: { path?: string }) {
            return context.path === "/sign-in/social";
          },
          handler: createAuthMiddleware(async (ctx) => {
            const email = ctx.body?.idToken?.user?.email;
            if (!email) return;

            const access = await isAllowedToSignIn(email);
            if (!access.allowed) {
              throw loginBlockedError();
            }
          }),
        },
      ],
      after: [
        {
          matcher(context: { path?: string }) {
            return context.path === "/callback/:id";
          },
          handler: createAuthMiddleware(async (ctx) => {
            const setCookieHeader = ctx.context.responseHeaders?.get("set-cookie");
            if (!setCookieHeader) return;

            const cookieName = ctx.context.authCookies.sessionToken.name;
            const parsedSetCookieHeader = parseSetCookieHeader(setCookieHeader);
            const sessionTokenCookie = parsedSetCookieHeader.get(cookieName);
            const sessionToken = sessionTokenCookie?.value?.split(".")[0];
            if (!sessionToken) return;

            const sessionRecord = await ctx.context.internalAdapter.findSession(
              sessionToken,
            );
            const email = sessionRecord?.user.email;
            if (!email) return;

            const access = await isAllowedToSignIn(email);
            if (access.allowed) return;

            await ctx.context.internalAdapter.deleteSession(sessionToken);

            if (!access.hasProgramMembership && sessionRecord?.user.id) {
              await ctx.context.internalAdapter.deleteUser(sessionRecord.user.id);
            }

            throw loginBlockedError();
          }),
        },
      ],
    },
  };
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET ?? process.env.AUTH_SECRET ?? "",
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: false,
      },
      lastName: {
        type: "string",
        required: false,
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      disableImplicitLinking: false,
      requireLocalEmailVerified: false,
      trustedProviders: ["google"],
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail(passwordResetEmail(user.email, url));
    },
  },
  plugins: [createVerifiedAccessPlugin()],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
});
