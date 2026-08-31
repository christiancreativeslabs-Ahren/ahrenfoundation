import type { WorkbookModuleDefinition } from "@/lib/workbook/content";

export type WelcomeEmailProps = {
  name: string;
  role: "mentee" | "mentor";
  baseUrl: string;
};

export type ModuleEmailProps = {
  name: string;
  module: WorkbookModuleDefinition;
  workbookModuleUrl: string;
  openPixelUrl?: string;
  baseUrl: string;
};

export type CompletionLetterEmailProps = {
  name: string;
  baseUrl: string;
};

export type RenderedWorkbookEmail = {
  subject: string;
  html: string;
  templateKey: string;
};
