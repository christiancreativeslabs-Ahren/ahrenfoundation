import {
  AHREN_WORKBOOK_PROGRAM,
  type WorkbookModuleDefinition,
} from "@/lib/workbook/content";
export { getWorkbookPreviewTemplates } from "@/lib/workbook/email-preview-catalog";

export function moduleDefinitionFromPayload(module: {
  moduleKey: string;
  moduleNumber: number;
  weekNumber: number;
  sendOffsetDays: number;
  sendDayLabel: string;
  title: string;
  subtitle: string | null;
  subject: string;
  previewText: string | null;
  openingCopy: string;
  scriptureText: string;
  scriptureReference: string;
  reflection: string;
  focus: string;
  action: string;
  payload: Record<string, unknown> | null;
}): WorkbookModuleDefinition {
  const payloadScriptures = module.payload?.scriptures;
  const scriptures = Array.isArray(payloadScriptures)
    ? payloadScriptures.filter(
        (item): item is { text: string; reference: string } =>
          Boolean(item) &&
          typeof item === "object" &&
          "text" in item &&
          "reference" in item &&
          typeof item.text === "string" &&
          typeof item.reference === "string",
      )
    : [
        {
          text: module.scriptureText,
          reference: module.scriptureReference,
        },
      ];

  return {
    moduleKey: module.moduleKey,
    moduleNumber: module.moduleNumber,
    weekNumber: module.weekNumber,
    sendOffsetDays: module.sendOffsetDays,
    sendDayLabel:
      module.sendDayLabel === "Friday" || module.sendDayLabel === "Monday"
        ? module.sendDayLabel
        : "Monday",
    title: module.title,
    subtitle: module.subtitle ?? undefined,
    subject: module.subject,
    previewText: module.previewText ?? module.subject,
    openingCopy: module.openingCopy
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    scriptures,
    reflection: module.reflection,
    focus: module.focus,
    action: module.action,
    questions: [],
  };
}
