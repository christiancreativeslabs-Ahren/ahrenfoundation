"use server";

import { sendResendEmail } from "@/lib/email";
import { renderOnboardingPreviewTemplate } from "@/lib/onboarding/email-renderer";

export type SendPreviewEmailState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function sendOnboardingPreviewEmail(
  _prevState: SendPreviewEmailState,
  formData: FormData,
): Promise<SendPreviewEmailState> {
  const recipientEmail = String(formData.get("recipient_email") ?? "").trim();
  const templateKey = String(formData.get("template_key") ?? "").trim();

  if (!recipientEmail) {
    return {
      status: "error",
      message: "Enter a recipient email address first.",
    };
  }

  const rendered = renderOnboardingPreviewTemplate(templateKey);
  if (!rendered) {
    return {
      status: "error",
      message: "That preview template could not be found.",
    };
  }

  try {
    await sendResendEmail(
      {
        to: recipientEmail,
        subject: rendered.subject,
        html: rendered.html,
        templateKey: rendered.templateKey,
      },
      { provider: "resend" },
    );

    return {
      status: "success",
      message: `Sent ${rendered.templateKey} to ${recipientEmail}.`,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Failed to send the preview email.",
    };
  }
}
