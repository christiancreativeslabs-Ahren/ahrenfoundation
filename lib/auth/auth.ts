import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { parseSetCookieHeader } from "better-auth/cookies";
import { createAuthMiddleware } from "better-auth/api";
import { magicLink } from "better-auth/plugins";
import { APIError } from "@better-auth/core/error";
import { sql } from "drizzle-orm";
import type { BetterAuthPlugin } from "better-auth";
import { db } from "@/db";
import { accounts, emailEvents, programMembers, sessions, users, verifications } from "@/db/schema";
import { magicLoginEmail, passwordResetEmail, sendEmail } from "@/lib/email";
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

async function getVerifiedProgramMemberForEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const [member] = await db
    .select({
      id: programMembers.id,
      fullName: programMembers.fullName,
      email: programMembers.email,
      role: programMembers.role,
      status: programMembers.status,
    })
    .from(programMembers)
    .where(sql`lower(${programMembers.email}) = ${normalizedEmail}`)
    .limit(1);

  if (!member || !VERIFIED_ACCESS_STATUSES.has(member.status)) {
    return null;
  }

  return member;
}

async function sendMagicLoginEmail(email: string, url: string) {
  const member = await getVerifiedProgramMemberForEmail(email);
  if (!member) {
    throw loginBlockedError();
  }

  const payload = magicLoginEmail(member.fullName, member.email, url, member.role);

  try {
    const result = await sendEmail(payload);
    await db.insert(emailEvents).values({
      programMemberId: member.id,
      recipientEmail: member.email,
      templateKey: payload.templateKey,
      status: result.sent ? "sent" : "skipped",
      providerId: result.providerId,
      sentAt: result.sent ? new Date() : null,
      payload: { subject: payload.subject, source: "magic_login" },
    });
  } catch (error) {
    await db.insert(emailEvents).values({
      programMemberId: member.id,
      recipientEmail: member.email,
      templateKey: payload.templateKey,
      status: "failed",
      error: error instanceof Error ? error.message : "Magic login email failed.",
      payload: { subject: payload.subject, source: "magic_login" },
    });
    throw error;
  }
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
            return context.path === "/sign-in/magic-link";
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
  plugins: [
    createVerifiedAccessPlugin(),
    magicLink({
      disableSignUp: true,
      expiresIn: 60 * 15,
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLoginEmail(email, url);
      },
    }),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
});
