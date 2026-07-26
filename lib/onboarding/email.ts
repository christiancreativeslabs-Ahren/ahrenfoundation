export { getOnboardingPreviewTemplates, moduleDefinitionFromPayload } from "@/lib/onboarding/email-shared";
export type {
  CompletionLetterEmailProps,
  ModuleEmailProps,
  RenderedOnboardingEmail,
  WelcomeEmailProps,
} from "@/lib/onboarding/email-types";
export {
  renderCohortCompletionEmail,
  renderOnboardingModuleEmail,
  renderOnboardingPreviewTemplate,
  renderOnboardingWelcomeEmail,
} from "@/lib/onboarding/email-renderer";
