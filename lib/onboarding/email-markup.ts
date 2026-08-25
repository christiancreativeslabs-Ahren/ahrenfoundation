import { getAppBaseUrl } from "@/lib/onboarding/urls";

export const colors = {
  bg: "#ffffff",
  panel: "#ffffff",
  black: "#000000",
  ink: "#171717",
  text: "#404040",
  muted: "#737373",
  faint: "#a3a3a3",
  border: "#e8e5df",
  soft: "#faf9f7",
  softLine: "#f1ede7",
  accent: "#111111",
  sky: "#38bdf8",
  mint: "#34d399",
  rose: "#fb7185",
  violet: "#8b5cf6",
  gold: "#f59e0b",
  softSky: "#f0f9ff",
  softMint: "#ecfdf5",
  softRose: "#fff1f2",
  softViolet: "#f5f3ff",
  softGold: "#fffbeb",
} as const;

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function assetUrl(baseUrl: string, path: string) {
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function absoluteUrl(url: string) {
  if (/^https?:\/\//.test(url)) return url;
  return assetUrl(getAppBaseUrl(), url);
}

export function paragraph(
  text: string,
  options: { small?: boolean; strong?: boolean } = {},
) {
  const color = options.small ? colors.muted : colors.text;
  const fontSize = options.small ? 13 : 15;
  const lineHeight = options.small ? 20 : 27;
  const fontWeight = options.strong ? 600 : 400;

  return `<p style="margin:0 0 20px;color:${color};font-size:${fontSize}px;font-weight:${fontWeight};line-height:${lineHeight}px;">${escapeHtml(text)}</p>`;
}

export function greeting(name: string) {
  return `<p style="margin:0 0 28px;color:${colors.black};font-size:15px;font-weight:400;line-height:26px;">Dear ${escapeHtml(name)},</p>`;
}

export function wrapParagraphs(paragraphs: string[]) {
  return paragraphs.map((item) => paragraph(item)).join("");
}

export function unorderedList(items: string[]) {
  return `<ul style="margin:0;padding-left:20px;">${items
    .map(
      (item) =>
        `<li style="margin:0 0 14px;color:${colors.text};font-size:15px;line-height:27px;">${escapeHtml(item)}</li>`,
    )
    .join("")}</ul>`;
}

// in email-markup.ts (or inline in the renderer)
export function mailtoLink(email: string, label?: string) {
  const text = label ?? email;
  return `<a href="mailto:${escapeHtml(email)}" style="color:#0ea5e9;text-decoration:underline;">${escapeHtml(text)}</a>`;
}

export function whatsappLink(
  phoneDisplay: string,
  phoneE164 = "2347047555064",
) {
  // phoneE164 without + or spaces
  return `<a href="https://wa.me/${phoneE164}" style="color:#0ea5e9;text-decoration:underline;" target="_blank" rel="noopener noreferrer">${escapeHtml(phoneDisplay)}</a>`;
}

export function webLink(url: string, label?: string) {
  const href = url.startsWith("http") ? url : `https://${url}`;
  const text = label ?? url;
  return `<a href="${escapeHtml(href)}" style="color:#0ea5e9;text-decoration:underline;" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`;
}

export function infoBox(label: string, body: string) {
  const badgeColor =
    label.toLowerCase().includes("scripture") ||
    label.toLowerCase().includes("verse")
      ? colors.sky
      : label.toLowerCase().includes("remember")
        ? colors.rose
        : label.toLowerCase().includes("focus")
          ? colors.violet
          : colors.mint;

  const tint =
    badgeColor === colors.sky
      ? colors.softSky
      : badgeColor === colors.rose
        ? colors.softRose
        : badgeColor === colors.violet
          ? colors.softViolet
          : colors.softMint;

  return `
    <table role="presentation" width="100%" style="width:100%;margin:28px 0;border-collapse:collapse;background-color:${tint};border:1px solid ${colors.border};border-radius:22px;overflow:hidden;">
      <tbody>
        <tr>
          <td style="padding:20px 24px 24px;border-left:4px solid ${badgeColor};">
            <p style="margin:0 0 14px;display:inline-block;background-color:${colors.panel};border:1px solid ${colors.border};border-radius:999px;color:${colors.black};font-size:10px;font-weight:700;letter-spacing:1.6px;padding:6px 12px;text-transform:uppercase;">
              ${escapeHtml(label)}
            </p>
            ${body}
          </td>
        </tr>
      </tbody>
    </table>
  `;
}

export function emailButton(href: string, label: string) {
  return `
    <table role="presentation" style="margin:34px 0 48px;border-collapse:separate;border-spacing:0;">
      <tbody>
        <tr>
          <td style="background-color:${colors.accent};border-radius:999px;box-shadow:0 8px 20px rgba(0,0,0,0.08);">
            <a href="${escapeHtml(href)}" style="display:inline-block;padding:15px 28px;color:#ffffff;font-size:13px;font-weight:700;line-height:20px;letter-spacing:0.8px;text-transform:uppercase;text-decoration:none;">
              ${escapeHtml(label)}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  `;
}

export function scriptureBlock(
  scriptures: Array<{ text: string; reference: string }>,
) {
  return scriptures
    .map(
      (scripture) => `
        <div style="margin:0 0 18px;">
          <p style="margin:0 0 8px;color:${colors.ink};font-size:17px;font-weight:400;line-height:31px;font-style:italic;">
            "${escapeHtml(scripture.text)}"
          </p>
          <p style="margin:0;color:${colors.muted};font-size:12px;font-weight:600;line-height:20px;letter-spacing:0.9px;text-transform:uppercase;">
            ${escapeHtml(scripture.reference)}
          </p>
        </div>`,
    )
    .join("");
}

export function alignmentTable(rows: Array<[string, string]>) {
  return `
    <table role="presentation" style="width:100%;border-collapse:collapse;">
      <tbody>
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="padding:10px 12px 10px 0;color:${colors.muted};font-size:11px;font-weight:600;line-height:18px;letter-spacing:0.7px;text-transform:uppercase;vertical-align:top;width:34%;">
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
