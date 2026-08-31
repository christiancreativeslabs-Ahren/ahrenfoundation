import {
  AHREN_WORKBOOK_PROGRAM,
  COHORT_COMPLETION_EMAIL,
  MENTEE_WELCOME_EMAIL,
  MENTOR_WELCOME_EMAIL,
  PROGRAM_WELCOME_EMAIL,
} from "@/lib/workbook/content";
import {
  alignmentTable,
  emailButton,
  escapeHtml,
  greeting,
  infoBox,
  mailtoLink,
  paragraph,
  scriptureBlock,
  unorderedList,
  webLink,
  whatsappLink,
  wrapParagraphs,
} from "@/lib/workbook/email-markup";
import { emailShell } from "@/lib/workbook/email-shell";
import type {
  CompletionLetterEmailProps,
  ModuleEmailProps,
  RenderedWorkbookEmail,
  WelcomeEmailProps,
} from "@/lib/workbook/email-types";
import { getAppBaseUrl } from "@/lib/workbook/urls";

export function renderWorkbookWelcomeEmail(
  props: WelcomeEmailProps,
): RenderedWorkbookEmail {
  const copy =
    props.role === "mentor" ? MENTOR_WELCOME_EMAIL : MENTEE_WELCOME_EMAIL;
  const roleIntro =
    props.role === "mentor"
      ? "We are preparing your mentor journey and will follow up with the next mentoring steps shortly."
      : "Your first Workbook module will arrive one week after signup, and from there we will walk with you through the full 6-week journey.";
  const roleExpectation =
    props.role === "mentor" ? "What to expect next" : "Your Workbook path";

  const bodyHtml = `
    ${greeting(props.name)}
    ${wrapParagraphs(copy.paragraphs)}
    ${paragraph(roleIntro)}
    ${infoBox(roleExpectation, unorderedList(copy.nextSteps))}
    ${paragraph(`We are ${props.role === "mentor" ? "excited" : "cheering"} for you.`)}
    ${paragraph("With gratitude and prayer,", { strong: false })}
    <p style="margin:0 0 20px;color:#000000;font-size:15px;font-weight:600;line-height:26px;">The Ahren Foundation Team</p>
    ${emailButton(props.baseUrl, "Visit Ahren Foundation")}
  `;

  return {
    subject: copy.subject,
    html: emailShell({
      title: copy.subject,
      previewText: copy.previewText,
      baseUrl: props.baseUrl,
      heroEyebrow: "Welcome Letter",
      heroTitle:
        props.role === "mentor"
          ? "Welcome, Mentor"
          : "Welcome to Ahren Foundation",
      bodyHtml,
    }),
    templateKey: props.role === "mentor" ? "mentor_welcome" : "mentee_welcome",
  };
}

export function renderWorkbookModuleEmail(
  props: Omit<ModuleEmailProps, "baseUrl"> & { baseUrl?: string },
): RenderedWorkbookEmail {
  const baseUrl = props.baseUrl ?? getAppBaseUrl();

  const bodyHtml = `
    ${greeting(props.name)}
    ${wrapParagraphs(props.module.openingCopy)}
    ${infoBox("Key Scripture", scriptureBlock(props.module.scriptures))}
    ${infoBox("Reflection", paragraph(props.module.reflection).replace("margin:0 0 20px;", "margin:0;"))}
    ${infoBox("This Week's Focus", paragraph(props.module.focus).replace("margin:0 0 20px;", "margin:0;"))}
    ${infoBox("This Week's Action", paragraph(props.module.action).replace("margin:0 0 20px;", "margin:0;"))}
    ${emailButton(props.workbookModuleUrl, "Access This Module")}
    ${
      props.module.moduleNumber === 12
        ? infoBox(
            "Congratulations",
            `${paragraph(
              "You have now completed the Ahren Foundation Christian Creativity Masterclass Program.",
            )}${paragraph(
              "Your certificate of completion and verified member access details will be sent to you shortly. We are so proud of you for finishing this journey. Now go build something for eternity.",
            ).replace("margin:0 0 20px;", "margin:0;")}`,
          )
        : ""
    }
    ${paragraph(
      "The module page includes the full Workbook content and your assignment questions. If you have any trouble accessing it, reply to this email.",
      { small: true },
    )}
    ${paragraph("We are praying for you and excited to see what God will do through you.")}
    <p style="margin:0;color:#000000;font-size:15px;font-weight:600;line-height:26px;">The Ahren Foundation Team</p>
  `;

  return {
    subject: props.module.subject,
    html: emailShell({
      title: props.module.subject,
      previewText: props.module.previewText,
      baseUrl,
      heroEyebrow: `Week ${props.module.weekNumber} - Module ${props.module.moduleNumber}`,
      heroTitle: props.module.title,
      heroSubtitle: props.module.subtitle,
      bodyHtml,
      openPixelUrl: props.openPixelUrl,
    }),
    templateKey: props.module.moduleKey,
  };
}

export function renderCohortCompletionEmail(
  props: CompletionLetterEmailProps,
): RenderedWorkbookEmail {
  const bodyHtml = `
    ${greeting(props.name)}
    ${wrapParagraphs(COHORT_COMPLETION_EMAIL.paragraphs.slice(1))}
    ${infoBox(
      "Our Memory Verse for You",
      `
        <p style="margin:0 0 8px;color:#171717;font-size:17px;font-weight:400;line-height:32px;font-style:italic;">
          "${escapeHtml(COHORT_COMPLETION_EMAIL.memoryVerse)}"
        </p>
        <p style="margin:0;color:#737373;font-size:13px;font-weight:500;line-height:20px;letter-spacing:1px;text-transform:uppercase;">
          ${escapeHtml(COHORT_COMPLETION_EMAIL.memoryVerseReference)}
        </p>
      `,
    )}
    ${infoBox("Remember", unorderedList(COHORT_COMPLETION_EMAIL.reminders))}
    ${infoBox(
      "Alignment Checkpoints",
      alignmentTable(
        COHORT_COMPLETION_EMAIL.checkpoints.map(([label, value]) => [
          label,
          value,
        ]),
      ),
    )}
    ${paragraph(COHORT_COMPLETION_EMAIL.closing)}
    ${paragraph("With love, prayer, and high expectations,")}
    <p style="margin:0 0 20px;color:#000000;font-size:15px;font-weight:600;line-height:26px;">The Ahren Foundation Team</p>
    ${emailButton(props.baseUrl, "Visit Ahren Foundation")}
  `;

  return {
    subject: COHORT_COMPLETION_EMAIL.subject,
    html: emailShell({
      title: COHORT_COMPLETION_EMAIL.subject,
      previewText: COHORT_COMPLETION_EMAIL.previewText,
      baseUrl: props.baseUrl,
      heroEyebrow: "Closing Letter",
      heroTitle: "A Letter to Our Creative Cohort",
      heroSubtitle: "Build something for His glory",
      bodyHtml,
    }),
    templateKey: "completion-letter",
  };
}

export function renderWorkbookPreviewTemplate(templateKey: string) {
  const baseUrl = getAppBaseUrl();

  if (templateKey === "mentee-welcome") {
    return renderWorkbookWelcomeEmail({
      name: "Ada Creative",
      role: "mentee",
      baseUrl,
    });
  }

  if (templateKey === "mentor-welcome") {
    return renderWorkbookWelcomeEmail({
      name: "Pastor Michael",
      role: "mentor",
      baseUrl,
    });
  }

  if (templateKey === "completion-letter") {
    return renderCohortCompletionEmail({
      name: "Ada Creative",
      baseUrl,
    });
  }

  if (templateKey === "program-welcome") {
    return renderProgramWelcomeEmail({
      name: "Creative",
      baseUrl,
    });
  }

  const module = AHREN_WORKBOOK_PROGRAM.modules.find(
    (item) => item.moduleKey === templateKey,
  );

  if (!module) return null;

  return renderWorkbookModuleEmail({
    name: "Ada Creative",
    module,
    workbookModuleUrl: `${baseUrl}/workbook/sample-delivery?token=sample-token`,
    openPixelUrl: `${baseUrl}/api/email/open/sample-delivery/sample-token`,
    baseUrl,
  });
}

export function renderProgramWelcomeEmail(props: {
  name: string;
  baseUrl: string;
}): RenderedWorkbookEmail {
  const copy = PROGRAM_WELCOME_EMAIL;

  // Build contact paragraph with real links
  const contactHtml = `
    <p style="margin:0 0 20px;color:#404040;font-size:13px;font-weight:400;line-height:20px;">
      If you have any questions, please don't hesitate to email us
      ${mailtoLink("hello@ahrenfoundation.org")}
      or reach out to us on WhatsApp:
      ${whatsappLink("+234 704 755 5064")}.
    </p>
  `;

  const whatsappBoxBody = `
    <p style="margin:0;color:#404040;font-size:15px;line-height:27px;">
      To start receiving updates and community discussions, please join our official WhatsApp group via SMS or WhatsApp Message from our Program Admin or send a chat to
      ${whatsappLink("+234 704 755 5064")}.
    </p>
  `;

  const bodyHtml = `
    ${greeting(props.name)}
    ${wrapParagraphs(copy.paragraphs)}

    ${infoBox("What to Expect", unorderedList(copy.whatToExpect))}

    ${infoBox(
      "Live Training Sessions",
      `
        <p style="margin:0 0 14px;color:#404040;font-size:14px;line-height:22px;">
          Saturdays, 10:00 AM – 12:00 PM
        </p>
        ${alignmentTable(
          copy.liveSessions.map(([label, value]): [string, string] => [
            label,
            value,
          ]),
        )}
      `,
    )}

    ${infoBox(
      "Mentor Meetings",
      `
        <p style="margin:0 0 14px;color:#404040;font-size:14px;line-height:22px;">
          Saturdays, 11:00 AM – 12:00 NOON
        </p>
        ${alignmentTable(
          copy.mentorMeetings.map(([label, value]): [string, string] => [
            label,
            value,
          ]),
        )}
      `,
    )}

    ${infoBox("Join the Community", whatsappBoxBody)}

    ${paragraph(copy.attachmentNote)}
    ${paragraph(copy.closing)}
    ${contactHtml}

    ${paragraph("With joy and expectation,")}
    <p style="margin:0 0 8px;color:#000000;font-size:15px;font-weight:600;line-height:26px;">
      The Ahren Foundation Team
    </p>
    <p style="margin:0 0 20px;color:#404040;font-size:14px;line-height:22px;">
      ${webLink("www.ahrenfoundation.org")}
    </p>

    ${emailButton(props.baseUrl, "Visit Ahren Foundation")}
  `;

  return {
    subject: copy.subject,
    html: emailShell({
      title: copy.subject,
      previewText: copy.previewText,
      baseUrl: props.baseUrl,
      heroEyebrow: "Welcome Letter",
      heroTitle: "Program Schedule",
      heroSubtitle: "6-Week Tech & Creativity Masterclass",
      showWorkbookMap: false,
      bodyHtml,
    }),
    templateKey: "program-welcome",
  };
}
