import {
  AHREN_ONBOARDING_PROGRAM,
  type OnboardingModuleDefinition,
} from "@/lib/onboarding/content";

export function getOnboardingPreviewTemplates() {
  return [
    {
      templateKey: "mentee-welcome",
      title: "Mentee Welcome",
      description: "Welcome email for accepted creative youth.",
    },
    {
      templateKey: "mentor-welcome",
      title: "Mentor Welcome",
      description: "Welcome email for mentors beginning onboarding.",
    },
    {
      templateKey: "completion-letter",
      title: "Completion Letter",
      description: "Closing letter to the creative cohort.",
    },
    ...AHREN_ONBOARDING_PROGRAM.modules.map((module) => ({
      templateKey: module.moduleKey,
      title: `Module ${module.moduleNumber}: ${module.title}`,
      description: module.subtitle ?? module.previewText,
    })),
  ];
}

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
}): OnboardingModuleDefinition {
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
