export { getWorkbookPreviewTemplates, moduleDefinitionFromPayload } from "@/lib/workbook/email-shared";
export type {
  CompletionLetterEmailProps,
  ModuleEmailProps,
  RenderedWorkbookEmail,
  WelcomeEmailProps,
} from "@/lib/workbook/email-types";
export {
  renderCohortCompletionEmail,
  renderWorkbookModuleEmail,
  renderWorkbookPreviewTemplate,
  renderWorkbookWelcomeEmail,
} from "@/lib/workbook/email-renderer";
