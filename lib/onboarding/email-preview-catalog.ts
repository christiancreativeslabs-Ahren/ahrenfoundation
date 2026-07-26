import { AHREN_ONBOARDING_PROGRAM } from "@/lib/onboarding/content";

export type EmailPreviewTemplate = {
  templateKey: string;
  title: string;
  description: string;
};

export type EmailPreviewCategory = {
  categoryKey: "onboarding";
  title: string;
  description: string;
  templates: EmailPreviewTemplate[];
};

export function getEmailPreviewCatalog(): EmailPreviewCategory[] {
  return [
    {
      categoryKey: "onboarding",
      title: "Onboarding",
      description:
        "Welcome emails, module emails, and completion messaging for the Ahren Christian Creativity Masterclass.",
      templates: [
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
      ],
    },
  ];
}

export function getOnboardingPreviewTemplates() {
  return getEmailPreviewCatalog()
    .find((category) => category.categoryKey === "onboarding")
    ?.templates ?? [];
}
