import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { parseSetCookieHeader } from "better-auth/cookies";
import { createAuthMiddleware } from "better-auth/api";
import { magicLink } from "better-auth/plugins";
import { APIError } from "@better-auth/core/error";
import { sql } from "drizzle-orm";
import type { BetterAuthPlugin } from "better-auth";
import { db } from "@/db";
import {
  accounts,
  emailEvents,
  programMembers,
  sessions,
  users,
  verifications,
} from "@/db/schema";
import {
  magicLoginEmail,
  passwordResetEmail,
  sendEmail,
  emailVerificationEmail,
  setPasswordEmail,
} from "@/lib/email";
import { getAdminEmails } from "@/lib/validations/join";

const VERIFIED_ACCESS_STATUSES = new Set([
  "verified_member",
  "verified_mentor",
]);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function loginBlockedError(
  kind: "community" | "program" | "mentor" | "youth" = "program",
) {
  // console.error({ kind });
  if (kind === "community") {
    return APIError.from("FORBIDDEN", {
      code: "EMAIL_NOT_VERIFIED",
      message:
        "Please verify your email before logging in. Check your inbox for the verification link.",
    });
  }
  return APIError.from("FORBIDDEN", {
    code: "ACCOUNT_NOT_VERIFIED",
    message:
      "Your account is not yet verified for login. Please wait for admin approval.",
  });
}

// function loginBlockedError() {
//   return APIError.from("FORBIDDEN", {
//     code: "ACCOUNT_NOT_VERIFIED",
//     message:
//       "Your account is not yet verified for login. Please wait for admin approval.",
//   });
// }

// async function isAllowedToSignIn(email: string) {
//   const normalizedEmail = normalizeEmail(email);

//   if (getAdminEmails().includes(normalizedEmail)) {
//     return { allowed: true, isAdmin: true, hasProgramMembership: false };
//   }

//   const [user] = await db
//     .select({
//       emailVerified: users.emailVerified,
//     })
//     .from(users)
//     .where(sql`lower(${users.email}) = ${normalizedEmail}`)
//     .limit(1);

//   const [member] = await db
//     .select({
//       status: programMembers.status,
//     })
//     .from(programMembers)
//     .where(sql`lower(${programMembers.email}) = ${normalizedEmail}`)
//     .limit(1);

//   const hasProgramMembership = Boolean(member);
//   const allowed =
//     Boolean(user?.emailVerified) &&
//     Boolean(member?.status) &&
//     VERIFIED_ACCESS_STATUSES.has(member.status);

//   return {
//     allowed,
//     isAdmin: false,
//     hasProgramMembership,
//   };
// }

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
      role: programMembers.role,
    })
    .from(programMembers)
    .where(sql`lower(${programMembers.email}) = ${normalizedEmail}`)
    .limit(1);

  const hasProgramMembership = Boolean(member);

  // Community Hub: registered community members can log in immediately
  if (member?.role === "community" || member?.role === "youth") {
    return {
      allowed: Boolean(user?.emailVerified),
      isAdmin: false,
      hasProgramMembership: true,
      role: member.role,
    };
  }

  // Existing rule: youth/mentor (and others) need verified access
  const allowed =
    Boolean(user?.emailVerified) &&
    Boolean(member?.status) &&
    VERIFIED_ACCESS_STATUSES.has(member.status);

  return {
    allowed,
    isAdmin: false,
    hasProgramMembership,
    role: member.role,
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

  const payload = magicLoginEmail(
    member.fullName,
    member.email,
    url,
    member.role,
  );

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
      error:
        error instanceof Error ? error.message : "Magic login email failed.",
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
            const email =
              typeof ctx.body?.email === "string" ? ctx.body.email : "";
            if (!email) return;

            const access = await isAllowedToSignIn(email);
            // console.log({ access });
            if (!access.allowed) {
              throw loginBlockedError(
                (access.role as "community" | "program" | "mentor" | "youth") ??
                  "program",
              );
            }
          }),
        },
        {
          matcher(context: { path?: string }) {
            return context.path === "/sign-in/magic-link";
          },
          handler: createAuthMiddleware(async (ctx) => {
            const email =
              typeof ctx.body?.email === "string" ? ctx.body.email : "";
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

        // inside createVerifiedAccessPlugin → hooks.after array, ADD:
        {
          matcher(context: { path?: string }) {
            // Adjust if your logs show a different path
            return (
              context.path === "/reset-password" ||
              context.path === "/email-password/reset-password" ||
              context.path === "/forget-password/reset"
            );
          },
          handler: createAuthMiddleware(async (ctx) => {
            // Only mark verified when reset succeeded (no error thrown upstream)
            const email =
              typeof ctx.body?.email === "string"
                ? ctx.body.email
                : typeof ctx.context?.session?.user?.email === "string"
                  ? ctx.context.session.user.email
                  : null;

            // Some versions only send `newPassword` + `token` — resolve user from token if needed
            let resolvedEmail = email;

            if (!resolvedEmail && typeof ctx.body?.token === "string") {
              // Optional: look up verification row if you store email on the token
              // Skip if not available; use option B on the page instead
            }

            if (!resolvedEmail) return;

            const normalized = normalizeEmail(resolvedEmail);

            await db
              .update(users)
              .set({
                emailVerified: true,
                updatedAt: new Date(),
              })
              .where(sql`lower(${users.email}) = ${normalized}`);

            // Optional: youth step after they finish setting password
            await db
              .update(programMembers)
              .set({
                currentStep: "awaiting_approval",
                updatedAt: new Date(),
              })
              .where(
                sql`lower(${programMembers.email}) = ${normalized} AND ${programMembers.role} = 'youth'`,
              );
          }),
        },
      ],
      after: [
        {
          matcher(context: { path?: string }) {
            return context.path === "/callback/:id";
          },
          handler: createAuthMiddleware(async (ctx) => {
            const setCookieHeader =
              ctx.context.responseHeaders?.get("set-cookie");
            if (!setCookieHeader) return;

            const cookieName = ctx.context.authCookies.sessionToken.name;
            const parsedSetCookieHeader = parseSetCookieHeader(setCookieHeader);
            const sessionTokenCookie = parsedSetCookieHeader.get(cookieName);
            const sessionToken = sessionTokenCookie?.value?.split(".")[0];
            if (!sessionToken) return;

            const sessionRecord =
              await ctx.context.internalAdapter.findSession(sessionToken);
            const email = sessionRecord?.user.email;
            if (!email) return;

            const access = await isAllowedToSignIn(email);
            if (access.allowed) return;

            await ctx.context.internalAdapter.deleteSession(sessionToken);

            if (!access.hasProgramMembership && sessionRecord?.user.id) {
              await ctx.context.internalAdapter.deleteUser(
                sessionRecord.user.id,
              );
            }

            throw loginBlockedError();
          }),
        },
      ],
    },
  };
}

// Short-lived store (safe for concurrent requests)
const pendingMagicLinks = new Map<string, string>();

export function takeCapturedMagicLink(captureId: string): string | null {
  const url = pendingMagicLinks.get(captureId) ?? null;
  pendingMagicLinks.delete(captureId);
  return url;
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
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60 * 24,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail(
        setPasswordEmail(user.name || "Friend", user.email, url),
        // passwordResetEmail(user.email, url)
      );
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail(
        emailVerificationEmail(user.name || "Friend", user.email, url),
      );
    },
    // Fired when the user successfully verifies their email
    afterEmailVerification: async (user) => {
      const email = user.email?.trim().toLowerCase();
      if (!email) return;

      await db
        .update(programMembers)
        .set({
          currentStep: "awaiting_approval", // or "Awaiting Approval"
          updatedAt: new Date(),
        })
        .where(
          sql`lower(${programMembers.email}) = ${email} AND ${programMembers.role} IN ('community', 'youth')`,
        );
    },
  },
  plugins: [
    createVerifiedAccessPlugin(),
    magicLink({
      disableSignUp: true,
      expiresIn: 60 * 15,

      sendMagicLink: async ({ email, url, metadata }) => {
        // When captureId is present → only capture the URL, send nothing
        if (metadata?.captureId) {
          pendingMagicLinks.set(String(metadata.captureId), url);
          return;
        }

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
