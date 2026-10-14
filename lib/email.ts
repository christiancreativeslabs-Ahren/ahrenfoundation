import type { JoinParsedData } from "@/lib/validations/join";
import { renderWorkbookWelcomeEmail } from "@/lib/workbook/email-renderer";
import { getAppBaseUrl } from "@/lib/workbook/urls";

type EmailProviderName = "resend" | "nodemailer" | "zeptomail";

type EmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  templateKey: string;
  replyTo?: string;
  programMemberId?: string;
  enrollmentId?: string;
  moduleId?: string;
  deliveryId?: string;
  attachments?: {
    filename: string;
    content: string;
    contentType?: string;
  }[];
};

type EmailSendOptions = {
  provider?: EmailProviderName;
  fallbackProvider?: EmailProviderName;
  retryOnFailure?: boolean;
  queueOnFailure?: boolean;
};

type EmailSendResult = {
  sent: boolean;
  skipped: boolean;
  templateKey: string;
  provider?: EmailProviderName;
  providerId?: string;
  error?: string;
  attempt?: number;
};

type ProviderConfig = {
  defaultProvider: EmailProviderName;
  fallbackProvider?: EmailProviderName;
  retryAttempts: number;
  retryDelayMs: number;
  enableQueue: boolean;
};

type SmtpConfig = {
  service?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  auth?: {
    user: string;
    pass: string;
  };
  defaultFrom?: string;
};

type ResendConfig = {
  apiKey?: string;
  defaultFrom?: string;
};

function splitEmails(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeProvider(
  value: string | undefined,
): EmailProviderName | undefined {
  const normalized = value?.trim().toLowerCase();
  if (
    normalized === "resend" ||
    normalized === "nodemailer" ||
    normalized === "zeptomail"
  ) {
    return normalized;
  }
  return undefined;
}

function parseNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseBoolean(value: string | undefined, fallback = false) {
  if (value == null || value.trim() === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function getProviderConfig(): ProviderConfig {
  const defaultProvider =
    normalizeProvider(process.env.EMAIL_PROVIDER) ?? "nodemailer";
  const fallbackProvider =
    normalizeProvider(process.env.EMAIL_FALLBACK_PROVIDER) ??
    (defaultProvider === "nodemailer" && process.env.RESEND_API_KEY
      ? "resend"
      : undefined);

  return {
    defaultProvider,
    fallbackProvider,
    retryAttempts: parseNumber(process.env.EMAIL_RETRY_ATTEMPTS, 2),
    retryDelayMs: parseNumber(process.env.EMAIL_RETRY_DELAY_MS, 1000),
    enableQueue: parseBoolean(process.env.EMAIL_ENABLE_QUEUE, false),
  };
}

function getResendConfig(): ResendConfig {
  return {
    apiKey: process.env.RESEND_API_KEY,
    defaultFrom: process.env.RESEND_FROM_EMAIL,
  };
}

function getSmtpConfig(provider: "nodemailer" | "zeptomail"): SmtpConfig {
  if (provider === "nodemailer") {
    return {
      service: process.env.SMTP_SERVICE || undefined,
      host: process.env.SMTP_HOST || undefined,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
      secure: parseBoolean(process.env.SMTP_SECURE, false),
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          : undefined,
      defaultFrom:
        process.env.SMTP_FROM ||
        process.env.RESEND_FROM_EMAIL ||
        "Ahren Foundation <noreply@ahrenfoundation.org>",
    };
  }

  return {
    host: process.env.ZEPTOMAIL_HOST || undefined,
    port: process.env.ZEPTOMAIL_PORT
      ? Number(process.env.ZEPTOMAIL_PORT)
      : undefined,
    secure: parseBoolean(process.env.ZEPTOMAIL_SECURE, false),
    auth:
      process.env.ZEPTOMAIL_USER && process.env.ZEPTOMAIL_PASS
        ? {
            user: process.env.ZEPTOMAIL_USER,
            pass: process.env.ZEPTOMAIL_PASS,
          }
        : undefined,
    defaultFrom:
      process.env.ZEPTOMAIL_FROM ||
      process.env.SMTP_FROM ||
      process.env.RESEND_FROM_EMAIL ||
      "Ahren Foundation <noreply@ahrenfoundation.org>",
  };
}

function isProviderConfigured(provider: EmailProviderName) {
  if (provider === "resend") {
    const config = getResendConfig();
    return Boolean(config.apiKey && config.defaultFrom);
  }

  const config = getSmtpConfig(provider);
  return Boolean(
    config.defaultFrom &&
    config.auth &&
    ((provider === "nodemailer" &&
      (config.service || (config.host && config.port))) ||
      (provider === "zeptomail" && config.host && config.port)),
  );
}

async function getNodemailerTransport(provider: "nodemailer" | "zeptomail") {
  const { createTransport } = await import("nodemailer");
  const config = getSmtpConfig(provider);

  if (!config.auth || !config.defaultFrom) {
    throw new Error(`${provider} is not configured.`);
  }

  if (provider === "nodemailer" && config.service) {
    return createTransport({
      service: config.service,
      auth: config.auth,
    });
  }

  if (!config.host || !config.port) {
    throw new Error(`${provider} host and port are not configured.`);
  }

  return createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  });
}

async function sendWithResend(payload: EmailPayload): Promise<EmailSendResult> {
  const config = getResendConfig();
  if (!config.apiKey || !config.defaultFrom) {
    throw new Error("Resend is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.defaultFrom,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      reply_to: payload.replyTo,
      attachments: payload.attachments,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("[email][resend] send failed", {
      status: response.status,
      statusText: response.statusText,
      templateKey: payload.templateKey,
      to: payload.to,
      error: text,
    });
    throw new Error(text || "Resend email request failed.");
  }

  const result = (await response.json().catch(() => null)) as {
    id?: string;
  } | null;

  return {
    sent: true,
    skipped: false,
    templateKey: payload.templateKey,
    provider: "resend",
    providerId: result?.id,
  };
}

async function sendWithSmtp(
  payload: EmailPayload,
  provider: "nodemailer" | "zeptomail",
): Promise<EmailSendResult> {
  const config = getSmtpConfig(provider);
  if (!config.auth || !config.defaultFrom) {
    throw new Error(`${provider} is not configured.`);
  }

  const transport = await getNodemailerTransport(provider);
  const result = await transport.sendMail({
    from: config.defaultFrom,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    replyTo: payload.replyTo,
    attachments: payload.attachments?.map((attachment) => ({
      filename: attachment.filename,
      content: attachment.content,
      contentType: attachment.contentType || "application/octet-stream",
    })),
  });

  return {
    sent: true,
    skipped: false,
    templateKey: payload.templateKey,
    provider,
    providerId: result.messageId,
  };
}

async function sendWithProvider(
  payload: EmailPayload,
  provider: EmailProviderName,
): Promise<EmailSendResult> {
  switch (provider) {
    case "resend":
      return sendWithResend(payload);
    case "nodemailer":
      return sendWithSmtp(payload, "nodemailer");
    case "zeptomail":
      return sendWithSmtp(payload, "zeptomail");
    default:
      throw new Error(`Unknown email provider: ${provider}`);
  }
}

export async function sendEmail(
  payload: EmailPayload,
  options: EmailSendOptions = {},
): Promise<EmailSendResult> {
  const runtimeConfig = getProviderConfig();
  const provider = options.provider ?? runtimeConfig.defaultProvider;
  const maxAttempts =
    options.retryOnFailure === false ? 1 : runtimeConfig.retryAttempts;
  const fallbackProvider =
    options.fallbackProvider ?? runtimeConfig.fallbackProvider;

  if (!isProviderConfigured(provider)) {
    if (
      fallbackProvider &&
      fallbackProvider !== provider &&
      isProviderConfigured(fallbackProvider)
    ) {
      const fallbackResult = await sendWithProvider(payload, fallbackProvider);
      return { ...fallbackResult, attempt: 1 };
    }

    return {
      sent: false,
      skipped: true,
      templateKey: payload.templateKey,
      provider,
      error: `${provider} is not configured.`,
    };
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const result = await sendWithProvider(payload, provider);
      return { ...result, attempt };
    } catch (error) {
      lastError = error;
      console.error("[email][send] attempt failed", {
        attempt,
        provider,
        templateKey: payload.templateKey,
        to: payload.to,
        error: error instanceof Error ? error.message : error,
      });

      if (
        attempt === maxAttempts &&
        fallbackProvider &&
        fallbackProvider !== provider &&
        isProviderConfigured(fallbackProvider)
      ) {
        try {
          const fallbackResult = await sendWithProvider(
            payload,
            fallbackProvider,
          );
          return { ...fallbackResult, attempt: attempt + 1 };
        } catch (fallbackError) {
          throw fallbackError;
        }
      }

      if (attempt < maxAttempts) {
        await new Promise((resolve) =>
          setTimeout(resolve, runtimeConfig.retryDelayMs),
        );
        continue;
      }

      throw error;
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw new Error("Email send failed.");
}

export async function sendResendEmail(
  payload: EmailPayload,
  options: EmailSendOptions = {},
): Promise<EmailSendResult> {
  return sendEmail(payload, options);
}

function frameEmail(title: string, body: string) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.65;color:#0f172a">
      <h2 style="margin:0 0 16px">Ahren Foundation</h2>
      <h3 style="margin:0 0 18px">${escapeHtml(title)}</h3>
      ${body}
    </div>
  `;
}

export function youthWelcomeEmail(data: JoinParsedData): EmailPayload {
  const rendered = renderWorkbookWelcomeEmail({
    name: data.fullName,
    role: "mentee",
    baseUrl: getAppBaseUrl(),
  });

  return {
    to: data.email,
    subject: rendered.subject,
    templateKey: rendered.templateKey,
    html: rendered.html,
  };
}

export function mentorWelcomeEmail(data: JoinParsedData): EmailPayload {
  const rendered = renderWorkbookWelcomeEmail({
    name: data.fullName,
    role: "mentor",
    baseUrl: getAppBaseUrl(),
  });

  return {
    to: data.email,
    subject: rendered.subject,
    templateKey: rendered.templateKey,
    html: rendered.html,
  };
}

// export function communityWelcomeEmail(data: JoinParsedData): EmailPayload {
//   const baseUrl = getAppBaseUrl();
//   const loginUrl = `${baseUrl}/login`; // change if Hub login is e.g. /hub/login
//   const firstName = data.fullName.split(/\s+/)[0] || data.fullName;

//   return {
//     to: data.email,
//     subject: "Welcome to Ahren Foundation Community",
//     templateKey: "community_welcome",
//     html: frameEmail(
//       "Welcome to Ahren Foundation Community",
//       `
//         <p>Hi ${escapeHtml(firstName)},</p>
//         <p>Thank you for registering. We're so excited to have you onboard.</p>
//         <p>
//           A member of our team will reach out to you shortly with next steps,
//           including how to access our community app and upcoming events.
//         </p>
//         <p>
//           <strong>Want to join our WhatsApp group right away?</strong><br />
//           Reach out via WhatsApp on
//           <a href="https://wa.me/2347047555064">+234 704 755 5064</a>.
//           We'll add you to our community group so you can start connecting
//           with other Christian creatives immediately.
//         </p>
//         <p>
//           You can log in here:
//           <a href="${escapeHtml(loginUrl)}">${escapeHtml(loginUrl)}</a>
//         </p>
//         <p>
//           In the meantime, please feel free to contact us, follow us on social
//           media, and check out our website for more information.
//         </p>
//         <p>
//           We're praying for you and looking forward to walking with you on
//           this journey.
//         </p>
//         <p style="font-style:italic;color:#475569">
//           "For we are his workmanship, created in Christ Jesus unto good works."
//           — Ephesians 2:10.
//         </p>
//         <p>- Ahren Foundation Team<br />
//         <a href="https://www.ahrenfoundation.org">www.ahrenfoundation.org</a></p>
//       `,
//     ),
//   };
// }

export function applicationRejectedEmail(
  name: string,
  email: string,
): EmailPayload {
  return {
    to: email,
    subject: "Thank you for applying to Ahren Foundation",
    templateKey: "application_rejected",
    html: frameEmail(
      "Thank you for applying",
      `
        <p>Dear ${escapeHtml(name)},</p>
        <p>Thank you for your application and for your heart to serve. After review, we are unable to move this application forward at this time.</p>
        <p>We are grateful for your interest and pray God continues to guide your journey.</p>
        <p>- Ahren Foundation Team</p>
      `,
    ),
  };
}

export function certificateIssuedEmail(
  name: string,
  email: string,
  certificateNumber: string,
  certificateUrl?: string,
  pdfBase64?: string,
): EmailPayload {
  return {
    to: email,
    subject: "Congratulations! Your Ahren Foundation Certificate & Next Steps",
    templateKey: "certificate_issued",
    html: frameEmail(
      "Certificate of Completion",
      `
        <p>Dear ${escapeHtml(name)},</p>
        <p>Congratulations on completing the Ahren Christian Creativity Masterclass Program.</p>
        <p><strong>Certificate number:</strong> ${escapeHtml(certificateNumber)}</p>
        ${
          certificateUrl
            ? `<p><a href="${escapeHtml(certificateUrl)}">Download your certificate</a></p>`
            : ""
        }
        <p>Your verified member review can now be completed by the Ahren Foundation team.</p>
        <p>- Ahren Foundation Team</p>
      `,
    ),
    attachments: pdfBase64
      ? [
          {
            filename: `${certificateNumber}.pdf`,
            content: pdfBase64,
            contentType: "application/pdf",
          },
        ]
      : undefined,
  };
}

export function verifiedAccessEmail(name: string, email: string): EmailPayload {
  const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
  return {
    to: email,
    subject: "You are now a Verified Member of Ahren Foundation",
    templateKey: "verified_access",
    html: frameEmail(
      "Welcome to the inner circle Ahren Creative",
      `
        <p>Dear ${escapeHtml(name)},</p>
        <p>Congratulations. You are now a Verified Member of Ahren Foundation.</p>
        <p><strong>Website:</strong> ${escapeHtml(`${baseUrl}/hub/login`)}</p>
        <p><strong>Username:</strong> ${escapeHtml(email)}</p>
        <p>Use Google sign-in or your email/password to access the dashboard. If you need a password, use the password reset flow from the login page.</p>
        <p>Inside your dashboard, you can connect with verified members, access resources, view incubation opportunities, register for events, showcase projects, and browse partnership opportunities.</p>
        <p>- Ahren Foundation Team</p>
      `,
    ),
  };
}

export function magicLoginEmail(
  name: string,
  email: string,
  url: string,
  role: "mentor" | "youth" | string | null,
): EmailPayload {
  const destination =
    role === "mentor" ? "mentor dashboard" : "Workbook dashboard";

  return {
    to: email,
    subject: "Your Ahren Foundation login link",
    templateKey: "magic_login",
    html: frameEmail(
      "Your Ahren Foundation access is ready",
      `
        <p>Dear ${escapeHtml(name || "Ahren Creative")},</p>
        <p>Your Ahren Foundation account is ready. Use the secure link below to sign in and open your ${escapeHtml(destination)}.</p>
        <p><a href="${escapeHtml(url)}">Open your dashboard</a></p>
        <p><strong>Login email:</strong> ${escapeHtml(email)}</p>
        <p>This link is single-use and will expire soon. If it expires, ask the Ahren Foundation team to send a new login link.</p>
        <p>- Ahren Foundation Team</p>
      `,
    ),
  };
}

export function passwordResetEmail(email: string, url: string): EmailPayload {
  return {
    to: email,
    subject: "Reset your Ahren Foundation password",
    templateKey: "password_reset",
    html: frameEmail(
      "Reset your password",
      `
        <p>We received a request to reset your Ahren Foundation password.</p>
        <p><a href="${escapeHtml(url)}">Reset your password</a></p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    ),
  };
}

export function adminJoinNotificationEmail(
  data: JoinParsedData,
): EmailPayload | null {
  const recipients = splitEmails(process.env.RESEND_ADMIN_TO_EMAILS);
  if (!recipients.length) return null;

  return {
    to: recipients,
    subject:
      data.applicationType === "youth"
        ? `New youth application: ${data.fullName}`
        : `New mentor application: ${data.fullName}`,
    templateKey: "admin_join_notification",
    html: frameEmail(
      "New Join Application",
      `
        <p>A new ${escapeHtml(data.applicationType)} application has been submitted.</p>
        <pre style="padding:16px;background:#f8fafc;border-radius:12px;white-space:pre-wrap">Name: ${escapeHtml(data.fullName)}
Email: ${escapeHtml(data.email)}
Phone: ${escapeHtml(data.phoneNumber)}
Location: ${escapeHtml(data.location)}</pre>
      `,
    ),
  };
}

// export function emailVerificationEmail(
//   name: string,
//   email: string,
//   url: string,
// ): EmailPayload {
//   const firstName = name.split(/\s+/)[0] || name;

//   return {
//     to: email,
//     subject: "Verify your Ahren Foundation email",
//     templateKey: "email_verification",
//     html: frameEmail(
//       "Verify your email",
//       `
//         <p>Hi ${escapeHtml(firstName)},</p>
//         <p>
//           Thanks for joining the Ahren Foundation community. Please verify your
//           email address so you can log in to the Community Hub.
//         </p>
//         <p>
//           <a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 20px;background:#00c9ff;color:#080d2e;text-decoration:none;border-radius:999px;font-weight:700">
//             Verify email address
//           </a>
//         </p>
//         <p style="color:#64748b;font-size:13px">
//           If the button does not work, copy and paste this link into your browser:<br />
//           ${escapeHtml(url)}
//         </p>
//         <p>If you did not create this account, you can ignore this email.</p>
//         <p>- Ahren Foundation Team</p>
//       `,
//     ),
//   };
// }

export function communityWelcomeEmail(data: JoinParsedData): EmailPayload {
  const rendered = renderCommunityWelcomeEmail({
    name: data.fullName,
    baseUrl: getAppBaseUrl(),
  });

  return {
    to: data.email,
    subject: rendered.subject,
    templateKey: rendered.templateKey,
    html: rendered.html,
  };
}

export function emailVerificationEmail(
  name: string,
  email: string,
  url: string,
): EmailPayload {
  const rendered = renderEmailVerificationEmail({
    name,
    url,
    baseUrl: getAppBaseUrl(),
  });

  return {
    to: email,
    subject: rendered.subject,
    templateKey: rendered.templateKey,
    html: rendered.html,
  };
}

export function setPasswordEmail(
  name: string,
  email: string,
  url: string,
): EmailPayload {
  const rendered = renderSetPasswordEmail({
    name,
    url,
    baseUrl: getAppBaseUrl(),
  });

  return {
    to: email,
    subject: rendered.subject,
    templateKey: rendered.templateKey,
    html: rendered.html,
  };
}

import { emailShell } from "@/lib/workbook/email-shell";
import {
  emailButton,
  greeting,
  infoBox,
  paragraph,
  whatsappLink,
} from "@/lib/workbook/email-markup";

export function renderCommunityWelcomeEmail(props: {
  name: string;
  baseUrl?: string;
}): { subject: string; html: string; templateKey: string } {
  const baseUrl = props.baseUrl ?? getAppBaseUrl();
  const loginUrl = `${baseUrl}/hub/login`;
  const subject = "Welcome to Ahren Foundation Community";

  const bodyHtml = `
    ${greeting(props.name)}
    ${paragraph(
      "Thank you for registering. We're so excited to have you onboard.",
    )}
    ${paragraph(
      "A member of our team will reach out to you shortly with next steps, including how to access our community app and upcoming events.",
    )}
    ${infoBox(
      "Before you log in",
      paragraph(
        "Please verify your email using the separate verification message we sent. After that, you can sign in to the Community Hub.",
      ).replace("margin:0 0 20px;", "margin:0;"),
    )}
    ${infoBox(
      "Join WhatsApp",
      `
        <p style="margin:0;color:#404040;font-size:15px;line-height:27px;">
          Reach out on WhatsApp ${whatsappLink("+234 704 755 5064")} and we will
          add you to the community group so you can connect with other Christian
          creatives.
        </p>
      `,
    )}
    ${emailButton(loginUrl, "Go to Community login")}
    ${paragraph(
      "We're praying for you and looking forward to walking with you on this journey.",
    )}
    ${paragraph(
      '"For we are his workmanship, created in Christ Jesus unto good works." — Ephesians 2:10.',
      { small: true },
    )}
    <p style="margin:0 0 8px;color:#000000;font-size:15px;font-weight:600;line-height:26px;">
      The Ahren Foundation Team
    </p>
    ${emailButton(baseUrl, "Visit Ahren Foundation")}
  `;

  return {
    subject,
    templateKey: "community_welcome",
    html: emailShell({
      title: subject,
      previewText:
        "Welcome to the community — verify your email, then log in to the Hub.",
      baseUrl,
      heroEyebrow: "Community Hub",
      heroTitle: "Welcome to the community",
      heroSubtitle: "Purpose, community, and opportunity",
      showWorkbookMap: false,
      bodyHtml,
    }),
  };
}

export function renderEmailVerificationEmail(props: {
  name: string;
  url: string;
  baseUrl?: string;
}): { subject: string; html: string; templateKey: string } {
  const baseUrl = props.baseUrl ?? getAppBaseUrl();
  const subject = "Verify your Ahren Foundation email";

  const bodyHtml = `
    ${greeting(props.name)}
    ${paragraph(
      "Thanks for joining the Ahren Foundation community. Please verify your email address so you can log in to the Community Hub.",
    )}
    ${emailButton(props.url, "Verify email address")}
    ${paragraph(
      "If the button does not work, copy and paste this link into your browser:",
      { small: true },
    )}
    <p style="margin:0 0 20px;color:#404040;font-size:13px;line-height:22px;word-break:break-all;">
      ${escapeHtml(props.url)}
    </p>
    ${paragraph(
      "If you did not create this account, you can ignore this email.",
      { small: true },
    )}
    <p style="margin:0;color:#000000;font-size:15px;font-weight:600;line-height:26px;">
      The Ahren Foundation Team
    </p>
  `;

  return {
    subject,
    templateKey: "email_verification",
    html: emailShell({
      title: subject,
      previewText: "Confirm your email to access the Community Hub.",
      baseUrl,
      heroEyebrow: "Account security",
      heroTitle: "Verify your email",
      heroSubtitle: "One click to activate your Community Hub access",
      showWorkbookMap: false,
      bodyHtml,
    }),
  };
}

export function renderSetPasswordEmail(props: {
  name: string;
  url: string;
  baseUrl?: string;
}): { subject: string; html: string; templateKey: string } {
  const baseUrl = props.baseUrl ?? getAppBaseUrl();
  const subject = "Set your Ahren Foundation password";

  const bodyHtml = `
    ${greeting(props.name)}
    ${paragraph(
      "You’re registered with Ahren Foundation as a youth member. Use the button below to choose a password and access the Community Hub.",
    )}
    ${emailButton(props.url, "Set password")}
    ${paragraph(
      "This link expires in 24 hours. If it expires, request a new one from the activate account page.",
      { small: true },
    )}
    ${paragraph(
      "If the button does not work, copy and paste this link into your browser:",
      { small: true },
    )}
    <p style="margin:0 0 20px;color:#404040;font-size:13px;line-height:22px;word-break:break-all;">
      ${escapeHtml(props.url)}
    </p>
    ${paragraph("If you did not request this, you can ignore this email.", {
      small: true,
    })}
    <p style="margin:0 0 8px;color:#000000;font-size:15px;font-weight:600;line-height:26px;">
      The Ahren Foundation Team
    </p>
    ${emailButton(baseUrl, "Visit Ahren Foundation")}
  `;

  return {
    subject,
    templateKey: "set_password",
    html: emailShell({
      title: subject,
      previewText:
        "Choose a password to access the Ahren Foundation Community Hub. Link valid 24 hours.",
      baseUrl,
      heroEyebrow: "Account access",
      heroTitle: "Set your password",
      heroSubtitle: "Activate your youth membership login",
      showWorkbookMap: false,
      bodyHtml,
    }),
  };
}
