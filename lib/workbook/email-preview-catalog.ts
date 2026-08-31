import { AHREN_WORKBOOK_PROGRAM } from "@/lib/workbook/content";

export type EmailPreviewTemplate = {
  templateKey: string;
  title: string;
  description: string;
};

export type EmailPreviewCategory = {
  categoryKey: "workbook";
  title: string;
  description: string;
  templates: EmailPreviewTemplate[];
};

export function getEmailPreviewCatalog(): EmailPreviewCategory[] {
  return [
    {
      categoryKey: "workbook",
      title: "Workbook",
      description:
        "Welcome emails, Workbook module emails, and completion messaging for the Ahren Christian Creativity Masterclass.",
      templates: [
        {
          templateKey: "mentee-welcome",
          title: "Mentee Welcome",
          description: "Welcome email for accepted creative youth.",
        },
        {
          templateKey: "mentor-welcome",
          title: "Mentor Welcome",
          description: "Welcome email for mentors entering the Workbook mentoring flow.",
        },
        {
          templateKey: "program-welcome",
          title: "Program Welcome",
          description:
            "Detailed welcome email with program overview, schedule, and WhatsApp join instructions.",
        },
        {
          templateKey: "completion-letter",
          title: "Completion Letter",
          description: "Closing letter to the creative cohort.",
        },
        ...AHREN_WORKBOOK_PROGRAM.modules.map((module) => ({
          templateKey: module.moduleKey,
          title: `Module ${module.moduleNumber}: ${module.title}`,
          description: module.subtitle ?? module.previewText,
        })),
      ],
    },
  ];
}

export function getWorkbookPreviewTemplates() {
  return (
    getEmailPreviewCatalog().find(
      (category) => category.categoryKey === "workbook",
    )?.templates ?? []
  );
}
