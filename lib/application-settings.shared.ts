export const TRAINING_APPLICATION_SETTINGS_KEY =
  "training_application_window";

export type TrainingApplicationSettings = {
  applicationsOpenAt: string | null;
  applicationsCloseAt: string | null;
  forceClosed: boolean;
  closedTitle: string;
  closedMessageHtml: string;
};

export type TrainingApplicationSettingsRecord = TrainingApplicationSettings & {
  createdAt: Date | null;
  updatedAt: Date | null;
};

export const DEFAULT_TRAINING_APPLICATION_SETTINGS: TrainingApplicationSettings =
  {
    applicationsOpenAt: null,
    applicationsCloseAt: null,
    forceClosed: false,
    closedTitle: "Applications Closed.",
    closedMessageHtml:
      "<p>Our 6-Week Tech &amp; Creativity Mentorship Program is now fully booked. Thank you to everyone who applied!</p><p>If you missed this cohort, don't worry - we will be opening more opportunities soon. Stay connected with us!</p>",
  };

const ALLOWED_TAGS = new Set([
  "a",
  "b",
  "blockquote",
  "br",
  "div",
  "em",
  "i",
  "li",
  "ol",
  "p",
  "span",
  "strong",
  "u",
  "ul",
]);

function dateOnlyInLagos(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function sanitizeTrainingApplicationHtml(input: string) {
  let html = String(input ?? "");

  html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<style[\s\S]*?<\/style>/gi, "");
  html = html.replace(/\son[a-z-]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  html = html.replace(/\sstyle\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  html = html.replace(/<\s*\/?\s*([a-z0-9-]+)([^>]*)>/gi, (match, rawTag) => {
    const tag = String(rawTag).toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      return "";
    }

    if (match.startsWith("</")) {
      return `</${tag}>`;
    }

    if (tag === "a") {
      const hrefMatch = match.match(/\shref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const href = (hrefMatch?.[2] ?? hrefMatch?.[3] ?? hrefMatch?.[4] ?? "").trim();
      const safeHref =
        /^https?:\/\//i.test(href) || href.startsWith("/") || href.startsWith("#")
          ? href
          : "#";

      return `<a href="${safeHref}" rel="noreferrer noopener" target="_blank">`;
    }

    return `<${tag}>`;
  });

  return html.trim();
}

export function normalizeTrainingApplicationSettings(
  settings?: Partial<TrainingApplicationSettings> | null,
): TrainingApplicationSettings {
  return {
    applicationsOpenAt:
      typeof settings?.applicationsOpenAt === "string"
        ? settings.applicationsOpenAt || null
        : DEFAULT_TRAINING_APPLICATION_SETTINGS.applicationsOpenAt,
    applicationsCloseAt:
      typeof settings?.applicationsCloseAt === "string"
        ? settings.applicationsCloseAt || null
        : DEFAULT_TRAINING_APPLICATION_SETTINGS.applicationsCloseAt,
    forceClosed: Boolean(settings?.forceClosed),
    closedTitle:
      typeof settings?.closedTitle === "string" && settings.closedTitle.trim()
        ? settings.closedTitle.trim()
        : DEFAULT_TRAINING_APPLICATION_SETTINGS.closedTitle,
    closedMessageHtml: sanitizeTrainingApplicationHtml(
      typeof settings?.closedMessageHtml === "string" &&
        settings.closedMessageHtml.trim()
        ? settings.closedMessageHtml
        : DEFAULT_TRAINING_APPLICATION_SETTINGS.closedMessageHtml,
    ),
  };
}

export function isTrainingApplicationOpen(
  settings: TrainingApplicationSettings,
  now = new Date(),
) {
  if (settings.forceClosed) return false;

  const today = dateOnlyInLagos(now);
  if (settings.applicationsOpenAt && today < settings.applicationsOpenAt) {
    return false;
  }

  if (settings.applicationsCloseAt && today > settings.applicationsCloseAt) {
    return false;
  }

  return true;
}

export function formatTrainingApplicationDateInput(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

export function coerceTrainingApplicationDateInput(
  value: FormDataEntryValue | null,
) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
