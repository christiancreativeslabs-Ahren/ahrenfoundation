import type { JoinParsedData } from "@/lib/validations/join";
import { renderOnboardingWelcomeEmail } from "@/lib/onboarding/email-renderer";
import { getAppBaseUrl } from "@/lib/onboarding/urls";

type EmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  templateKey: string;
  programMemberId?: string;
  enrollmentId?: string;
  moduleId?: string;
  deliveryId?: string;
  attachments?: {
    filename: string;
    content: string;
  }[];
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

export async function sendResendEmail(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return { sent: false, skipped: true, templateKey: payload.templateKey };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      attachments: payload.attachments,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Resend email request failed.");
  }

  const result = (await response.json().catch(() => null)) as {
    id?: string;
  } | null;
  return {
    sent: true,
    skipped: false,
    templateKey: payload.templateKey,
    providerId: result?.id,
  };
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
  const rendered = renderOnboardingWelcomeEmail({
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
  const rendered = renderOnboardingWelcomeEmail({
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

export function applicationRejectedEmail(
  name: string,
  email: string
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
      `
    ),
  };
}

export function certificateIssuedEmail(
  name: string,
  email: string,
  certificateNumber: string,
  certificateUrl?: string,
  pdfBase64?: string
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
      `
    ),
    attachments: pdfBase64
      ? [
          {
            filename: `${certificateNumber}.pdf`,
            content: pdfBase64,
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
        <p><strong>Website:</strong> ${escapeHtml(`${baseUrl}/login`)}</p>
        <p><strong>Username:</strong> ${escapeHtml(email)}</p>
        <p>Use Google sign-in or your email/password to access the dashboard. If you need a password, use the password reset flow from the login page.</p>
        <p>Inside your dashboard, you can connect with verified members, access resources, view incubation opportunities, register for events, showcase projects, and browse partnership opportunities.</p>
        <p>- Ahren Foundation Team</p>
      `
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
      `
    ),
  };
}

export function adminJoinNotificationEmail(
  data: JoinParsedData
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
      `
    ),
  };
}
