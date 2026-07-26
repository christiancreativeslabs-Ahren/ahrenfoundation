import { absoluteUrl, assetUrl, colors, escapeHtml } from "@/lib/onboarding/email-markup";

function splitHeroLabel(label: string) {
  const match = label.match(/Week\s+(\d+)\s*-\s*Module\s+(\d+)/i);
  if (!match) return null;
  return { week: match[1], module: match[2] };
}

export function emailShell(input: {
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
  const heroParts = splitHeroLabel(input.heroEyebrow);

  return `<!doctype html>
<html>
  <head>
    <title>${escapeHtml(input.title)}</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:0;background-color:#f8f7f3;font-family:Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${escapeHtml(input.previewText)}
    </div>
    <table role="presentation" width="100%" style="width:100%;border-collapse:collapse;background-color:#f8f7f3;">
      <tbody>
        <tr>
          <td style="padding:20px 12px 28px;">
            <table role="presentation" style="width:100%;max-width:720px;margin:0 auto;border-collapse:separate;border-spacing:0;background-color:${colors.panel};border:1px solid ${colors.border};border-radius:32px;overflow:hidden;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
              <tbody>
                <tr>
                  <td colspan="2" style="padding:0;">
                    <table role="presentation" style="width:100%;border-collapse:collapse;">
                      <tbody>
                        <tr>
                          <td style="height:6px;background-color:${colors.sky};padding:0;font-size:0;line-height:0;">&nbsp;</td>
                          <td style="height:6px;background-color:${colors.mint};padding:0;font-size:0;line-height:0;">&nbsp;</td>
                          <td style="height:6px;background-color:${colors.gold};padding:0;font-size:0;line-height:0;">&nbsp;</td>
                          <td style="height:6px;background-color:${colors.violet};padding:0;font-size:0;line-height:0;">&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td colspan="2" style="padding:18px 32px 0;">
                    <table role="presentation" style="width:100%;border-collapse:collapse;">
                      <tbody>
                        <tr>
                          <td style="vertical-align:middle;width:48px;padding-right:16px;">
                            <img
                              src="${escapeHtml(assetUrl(input.baseUrl, "/assets/logo-horizontal.png"))}"
                              width="170"
                              alt="Ahren Foundation"
                              style="display:block;height:auto;max-width:170px;"
                            />
                          </td>
                          <td style="vertical-align:middle;width:auto;padding-right:18px;">&nbsp;</td>
                          <td style="vertical-align:middle;width:34%;text-align:right;">
                            <p style="margin:0;color:${colors.black};font-size:12px;font-weight:800;letter-spacing:1.8px;text-transform:uppercase;">
                              ${escapeHtml(input.heroEyebrow)}
                            </p>
                            <p style="margin:6px 0 0;color:${colors.muted};font-size:11px;line-height:18px;">
                              ${heroParts ? `Week ${heroParts.week} · Module ${heroParts.module}` : "Open, reflect, respond"}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td colspan="2" style="padding:18px 32px 0;">
                    <table role="presentation" style="width:100%;border-collapse:separate;border-spacing:0;background:linear-gradient(135deg, ${colors.softSky}, ${colors.panel} 42%, ${colors.softMint});border:1px solid ${colors.border};border-radius:28px;overflow:hidden;">
                      <tbody>
                        <tr>
                          <td style="vertical-align:top;padding:22px 24px 24px;width:66%;">
                            <p style="margin:0 0 12px;color:${colors.muted};font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;">
                              ${escapeHtml(input.heroEyebrow)}
                            </p>
                            <h1 style="margin:0 0 14px;color:${colors.black};font-size:38px;font-weight:800;line-height:42px;letter-spacing:-1.6px;max-width:12ch;font-family:Georgia, 'Times New Roman', serif;">
                              ${escapeHtml(input.heroTitle)}
                            </h1>
                            ${
                              input.heroSubtitle
                                ? `<p style="margin:0;color:${colors.ink};font-size:16px;font-weight:400;line-height:29px;max-width:34em;">${escapeHtml(input.heroSubtitle)}</p>`
                                : ""
                            }
                          </td>
                          <td style="vertical-align:top;padding:22px 24px 24px;width:34%;">
                            <table role="presentation" style="width:100%;border-collapse:separate;border-spacing:0;background-color:${colors.panel};border:1px solid ${colors.border};border-radius:20px;overflow:hidden;">
                              <tbody>
                                <tr>
                                  <td style="padding:16px 16px 14px;border-bottom:1px solid ${colors.softLine};">
                                    <p style="margin:0 0 8px;color:${colors.muted};font-size:10px;font-weight:800;letter-spacing:1.8px;text-transform:uppercase;">
                                      Lesson map
                                    </p>
                                    <p style="margin:0;color:${colors.black};font-size:15px;font-weight:700;line-height:22px;">
                                      Build, think, pray, submit.
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding:14px 16px 16px;">
                                    <table role="presentation" style="width:100%;border-collapse:collapse;">
                                      <tbody>
                                        <tr>
                                          <td style="padding:0 0 10px;vertical-align:top;width:22px;color:${colors.sky};font-size:14px;font-weight:700;">01</td>
                                          <td style="padding:0 0 10px;color:${colors.text};font-size:13px;line-height:20px;">Read the lesson and scripture with focus.</td>
                                        </tr>
                                        <tr>
                                          <td style="padding:0 0 10px;vertical-align:top;width:22px;color:${colors.mint};font-size:14px;font-weight:700;">02</td>
                                          <td style="padding:0 0 10px;color:${colors.text};font-size:13px;line-height:20px;">Work through the assignment prompts honestly.</td>
                                        </tr>
                                        <tr>
                                          <td style="padding:0;vertical-align:top;width:22px;color:${colors.violet};font-size:14px;font-weight:700;">03</td>
                                          <td style="padding:0;color:${colors.text};font-size:13px;line-height:20px;">Submit your answers and keep moving forward.</td>
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
                  </td>
                </tr>

                <tr>
                  <td colspan="2" style="padding:18px 32px 0;">
                    <table role="presentation" style="width:100%;border-collapse:collapse;">
                      <tbody>
                        <tr>
                          <td style="padding:0 0 6px;">
                            <table role="presentation" style="border-collapse:separate;border-spacing:0 0;">
                              <tbody>
                                <tr>
                                  <td><span style="display:inline-block;background-color:${colors.softSky};border:1px solid ${colors.border};border-radius:999px;color:${colors.black};font-size:10px;font-weight:800;letter-spacing:1.2px;padding:6px 10px;text-transform:uppercase;">Faith</span></td>
                                  <td style="width:8px;"></td>
                                  <td><span style="display:inline-block;background-color:${colors.softMint};border:1px solid ${colors.border};border-radius:999px;color:${colors.black};font-size:10px;font-weight:800;letter-spacing:1.2px;padding:6px 10px;text-transform:uppercase;">Creativity</span></td>
                                  <td style="width:8px;"></td>
                                  <td><span style="display:inline-block;background-color:${colors.softRose};border:1px solid ${colors.border};border-radius:999px;color:${colors.black};font-size:10px;font-weight:800;letter-spacing:1.2px;padding:6px 10px;text-transform:uppercase;">Purpose</span></td>
                                  ${
                                    heroParts
                                      ? `
                                        <td style="width:8px;"></td>
                                        <td><span style="display:inline-block;background-color:${colors.softViolet};border:1px solid ${colors.border};border-radius:999px;color:${colors.black};font-size:10px;font-weight:800;letter-spacing:1.2px;padding:6px 10px;text-transform:uppercase;">Week ${escapeHtml(heroParts.week)}</span></td>
                                      `
                                      : ""
                                  }
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td colspan="2" style="padding:22px 32px 40px;">
                    ${input.bodyHtml}
                  </td>
                </tr>

                <tr>
                  <td colspan="2" style="padding:0 32px 28px;">
                    <table role="presentation" style="width:100%;border-collapse:collapse;border-top:1px solid ${colors.softLine};">
                      <tbody>
                        <tr>
                          <td style="padding-top:18px;vertical-align:top;width:60%;">
                            <p style="margin:0 0 8px;color:${colors.black};font-size:12px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;">
                              Keep going
                            </p>
                            <p style="margin:0;color:${colors.faint};font-size:11px;line-height:18px;max-width:30em;">
                              Every lesson is a step toward stronger character, sharper craft, and clearer calling.
                            </p>
                          </td>
                          <td style="padding-top:18px;vertical-align:top;text-align:right;width:40%;">
                            <p style="margin:0 0 8px;color:${colors.muted};font-size:10px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;">
                              Ahren Foundation
                            </p>
                            <p style="margin:0;color:${colors.faint};font-size:10px;line-height:16px;letter-spacing:0.5px;">
                              Building a global network of believers in tech who create value, serve their generation, and advance the Kingdom of God.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2" style="padding-top:18px;">
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
