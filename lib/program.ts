import type { JoinParsedData } from "@/lib/validations/join";

export function getInitialProgramStep(data: JoinParsedData) {
  return data.applicationType === "mentor"
    ? "application_review"
    : "onboarding_modules";
}

export function getInitialProgramStatus(data: JoinParsedData) {
  return data.applicationType === "mentor"
    ? "application_received"
    : "active";
}
