import {
  AHREN_ONBOARDING_PROGRAM,
  COHORT_COMPLETION_EMAIL,
  MENTEE_WELCOME_EMAIL,
  MENTOR_WELCOME_EMAIL,
  type OnboardingModuleDefinition,
} from "@/lib/onboarding/content";
import { getAppBaseUrl } from "@/lib/onboarding/urls";

type WelcomeEmailProps = {
  name: string;
  role: "mentee" | "mentor";
  baseUrl: string;
};

type ModuleEmailProps = {
  name: string;
  module: OnboardingModuleDefinition;
  lessonUrl: string;
  openPixelUrl?: string;
  baseUrl: string;
};

type CompletionLetterEmailProps = {
  name: string;
  baseUrl: string;
};

type RenderedOnboardingEmail = {
  subject: string;
  html: string;
  templateKey: string;
};

const colors = {
  bg: "#f5f5f5",
  panel: "#ffffff",
  black: "#000000",
  ink: "#171717",
  text: "#404040",
  muted: "#737373",
  faint: "#a3a3a3",
  border: "#e5e5e5",
  soft: "#fafafa",
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function assetUrl(baseUrl: string, path: string) {
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function absoluteUrl(url: string) {
  if (/^https?:\/\//.test(url)) return url;
  return assetUrl(getAppBaseUrl(), url);
}

function paragraph(text: string, options: { small?: boolean; strong?: boolean } = {}) {
  const color = options.small ? colors.muted : colors.text;
  const fontSize = options.small ? 13 : 15;
  const lineHeight = options.small ? 20 : 26;
  const fontWeight = options.strong ? 600 : 400;

  return `<p style="margin:0 0 20px;color:${color};font-size:${fontSize}px;font-weight:${fontWeight};line-height:${lineHeight}px;">${escapeHtml(text)}</p>`;
}

function greeting(name: string) {
  return `<p style="margin:0 0 32px;color:${colors.black};font-size:15px;font-weight:400;line-height:24px;">Dear ${escapeHtml(name)},</p>`;
}

function wrapParagraphs(paragraphs: string[]) {
  return paragraphs.map((item) => paragraph(item)).join("");
}

function unorderedList(items: string[]) {
  return `<ul style="margin:0;padding-left:20px;">${items
    .map(
      (item) =>
        `<li style="margin:0 0 12px;color:${colors.text};font-size:15px;line-height:26px;">${escapeHtml(item)}</li>`,
    )
    .join("")}</ul>`;
}

function infoBox(label: string, body: string) {
  return `
    <table role="presentation" width="100%" style="width:100%;margin:32px 0;border-collapse:collapse;background-color:${colors.soft};border:1px solid ${colors.border};border-left:3px solid ${colors.black};">
      <tbody>
        <tr>
          <td style="padding:24px 32px;">
            <p style="margin:0 0 12px;color:${colors.black};font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
              ${escapeHtml(label)}
            </p>
            ${body}
          </td>
        </tr>
      </tbody>
    </table>
  `;
}

function emailButton(href: string, label: string) {
  return `
    <table role="presentation" style="margin:40px 0 56px;border-collapse:collapse;">
      <tbody>
        <tr>
          <td style="background-color:${colors.black};">
            <a href="${escapeHtml(href)}" style="display:inline-block;padding:16px 32px;color:#ffffff;font-size:14px;font-weight:500;line-height:20px;letter-spacing:0.5px;text-transform:uppercase;text-decoration:none;">
              ${escapeHtml(label)}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  `;
}

function scriptureBlock(scriptures: Array<{ text: string; reference: string }>) {
  return scriptures
    .map(
      (scripture) => `
        <div style="margin:0 0 18px;">
          <p style="margin:0 0 8px;color:${colors.ink};font-size:17px;font-weight:400;line-height:32px;font-style:italic;">
            "${escapeHtml(scripture.text)}"
          </p>
          <p style="margin:0;color:${colors.muted};font-size:13px;font-weight:500;line-height:20px;letter-spacing:1px;text-transform:uppercase;">
            ${escapeHtml(scripture.reference)}
          </p>
        </div>`,
    )
    .join("");
}

function alignmentTable(rows: Array<[string, string]>) {
  return `
    <table role="presentation" style="width:100%;border-collapse:collapse;">
      <tbody>
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="padding:10px 12px 10px 0;color:${colors.muted};font-size:11px;font-weight:500;line-height:18px;letter-spacing:0.8px;text-transform:uppercase;vertical-align:top;width:34%;">
                  ${escapeHtml(label)}
                </td>
                <td style="padding:10px 0;color:${colors.black};font-size:14px;font-weight:400;line-height:22px;vertical-align:top;">
                  ${escapeHtml(value)}
                </td>
              </tr>`,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function emailShell(input: {
  title: string;
  previewText: string;
  baseUrl: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle?: string;
  bodyHtml: string;
  openPixelUrl?: string;
}) {
  const openPixel = input.openPixelUrl
    ? `<img src="${escapeHtml(absoluteUrl(input.openPixelUrl))}" width="1" height="1" alt="" style="display:none;width:1px;height:1px;" />`
    : "";

  return `<!doctype html>
<html>
  <head>
    <title>${escapeHtml(input.title)}</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:0;background-color:${colors.bg};font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${escapeHtml(input.previewText)}
    </div>
    <table role="presentation" width="100%" style="width:100%;border-collapse:collapse;background-color:${colors.bg};">
      <tbody>
        <tr>
          <td style="padding:0;">
            <table role="presentation" style="width:100%;max-width:600px;margin:0 auto;background-color:${colors.panel};border-collapse:collapse;border-left:8px solid ${colors.black};">
              <tbody>
                <tr>
                  <td style="padding:24px 40px 24px 32px;">
                    <table role="presentation" style="width:100%;border-collapse:collapse;">
                      <tbody>
                        <tr>
                          <td style="vertical-align:middle;width:48px;padding-right:16px;">
                            <img src="${escapeHtml(assetUrl(input.baseUrl, "/assets/logo-horizontal.png"))}" width="172" alt="Ahren Foundation" style="display:block;height:auto;max-width:172px;" />
                          </td>
                          <td style="vertical-align:middle;">
                            <p style="margin:0;color:${colors.black};font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;">
                              Ahren Foundation
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 40px 20px 32px;">
                    <p style="margin:0 0 12px;color:${colors.muted};font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                      ${escapeHtml(input.heroEyebrow)}
                    </p>
                    <h1 style="margin:0 0 16px;color:${colors.black};font-size:35px;font-weight:700;line-height:38px;letter-spacing:-1.5px;max-width:80%;">
                      ${escapeHtml(input.heroTitle)}
                    </h1>
                    ${
                      input.heroSubtitle
                        ? `<p style="margin:0;color:${colors.ink};font-size:17px;font-weight:400;line-height:28px;">${escapeHtml(input.heroSubtitle)}</p>`
                        : ""
                    }
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 40px 40px 32px;">
                    ${input.bodyHtml}
                  </td>
                </tr>
                <tr>
                  <td style="padding:48px 40px 48px 32px;background-color:${colors.panel};">
                    <table role="presentation" style="width:100%;border-collapse:collapse;">
                      <tbody>
                        <tr>
                          <td style="padding-bottom:24px;border-bottom:1px solid ${colors.border};">
                            <p style="margin:0;color:${colors.muted};font-size:10px;line-height:16px;letter-spacing:0.5px;text-transform:uppercase;">
                              © ${new Date().getFullYear()} Ahren Foundation. All Rights Reserved.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top:16px;">
                            <p style="margin:0;color:${colors.faint};font-size:10px;line-height:16px;letter-spacing:0.5px;">
                              Building a global network of believers in tech who create value, serve their generation, and advance the Kingdom of God.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top:24px;">
                            <p style="margin:0;color:${colors.faint};font-size:9px;line-height:16px;letter-spacing:1px;text-transform:uppercase;">
                              Confidential Communication
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    ${openPixel}
  </body>
</html>`;
}

export function renderOnboardingWelcomeEmail(props: WelcomeEmailProps) {
  const copy =
    props.role === "mentor" ? MENTOR_WELCOME_EMAIL : MENTEE_WELCOME_EMAIL;

  const bodyHtml = `
    ${greeting(props.name)}
    ${wrapParagraphs(copy.paragraphs)}
    ${infoBox("What to expect next", unorderedList(copy.nextSteps))}
    ${paragraph(`We are ${props.role === "mentor" ? "excited" : "cheering"} for you.`)}
    ${paragraph("With gratitude and prayer,", { strong: false })}
    <p style="margin:0 0 20px;color:${colors.black};font-size:15px;font-weight:600;line-height:26px;">The Ahren Foundation Team</p>
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
        props.role === "mentor" ? "Welcome, Mentor" : "Welcome to Ahren Foundation",
      bodyHtml,
    }),
    templateKey: props.role === "mentor" ? "mentor_welcome" : "mentee_welcome",
  };
}

export function renderOnboardingModuleEmail(
  props: Omit<ModuleEmailProps, "baseUrl"> & { baseUrl?: string },
): RenderedOnboardingEmail {
  const baseUrl = props.baseUrl ?? getAppBaseUrl();

  const bodyHtml = `
    ${greeting(props.name)}
    ${wrapParagraphs(props.module.openingCopy)}
    ${infoBox("Key Scripture", scriptureBlock(props.module.scriptures))}
    ${infoBox("Reflection", paragraph(props.module.reflection).replace('margin:0 0 20px;', "margin:0;"))}
    ${infoBox("This Week's Focus", paragraph(props.module.focus).replace('margin:0 0 20px;', "margin:0;"))}
    ${infoBox("This Week's Action", paragraph(props.module.action).replace('margin:0 0 20px;', "margin:0;"))}
    ${emailButton(props.lessonUrl, "Access This Module")}
    ${
      props.module.moduleNumber === 12
        ? infoBox(
            "Congratulations",
            `${paragraph(
              "You have now completed the Ahren Foundation Christian Creativity Masterclass Program.",
            )}${paragraph(
              "Your certificate of completion and verified member access details will be sent to you shortly. We are so proud of you for finishing this journey. Now go build something for eternity.",
            ).replace('margin:0 0 20px;', "margin:0;")}`,
          )
        : ""
    }
    ${paragraph(
      "The module page includes the full lesson and your assignment questions. If you have any trouble accessing it, reply to this email.",
      { small: true },
    )}
    ${paragraph("We are praying for you and excited to see what God will do through you.")}
    <p style="margin:0;color:${colors.black};font-size:15px;font-weight:600;line-height:26px;">The Ahren Foundation Team</p>
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

export function renderCohortCompletionEmail(props: CompletionLetterEmailProps) {
  const bodyHtml = `
    ${greeting(props.name)}
    ${wrapParagraphs(COHORT_COMPLETION_EMAIL.paragraphs.slice(1))}
    ${infoBox(
      "Our Memory Verse for You",
      `
        <p style="margin:0 0 8px;color:${colors.ink};font-size:17px;font-weight:400;line-height:32px;font-style:italic;">
          "${escapeHtml(COHORT_COMPLETION_EMAIL.memoryVerse)}"
        </p>
        <p style="margin:0;color:${colors.muted};font-size:13px;font-weight:500;line-height:20px;letter-spacing:1px;text-transform:uppercase;">
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
    <p style="margin:0 0 20px;color:${colors.black};font-size:15px;font-weight:600;line-height:26px;">The Ahren Foundation Team</p>
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

export function renderOnboardingPreviewTemplate(templateKey: string) {
  const baseUrl = getAppBaseUrl();

  if (templateKey === "mentee-welcome") {
    return renderOnboardingWelcomeEmail({
      name: "Ada Creative",
      role: "mentee",
      baseUrl,
    });
  }

  if (templateKey === "mentor-welcome") {
    return renderOnboardingWelcomeEmail({
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

  const module = AHREN_ONBOARDING_PROGRAM.modules.find(
    (item) => item.moduleKey === templateKey,
  );

  if (!module) return null;

  return renderOnboardingModuleEmail({
    name: "Ada Creative",
    module,
    lessonUrl: `${baseUrl}/lessons/sample-delivery?token=sample-token`,
    openPixelUrl: `${baseUrl}/api/email/open/sample-delivery/sample-token`,
    baseUrl,
  });
}
