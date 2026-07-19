"use server";

import { redirect } from "next/navigation";
import { submitModuleAnswers } from "@/lib/onboarding/service";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function submitModuleAssignment(formData: FormData) {
  const deliveryId = value(formData, "delivery_id");
  const accessToken = value(formData, "access_token");
  const questionIds = formData.getAll("question_id").map(String);

  if (!deliveryId || !accessToken || !questionIds.length) {
    redirect(`/lessons/${deliveryId || "missing"}?token=${accessToken}&error=missing`);
  }

  const answers = questionIds.map((questionId) => ({
    questionId,
    answer: value(formData, `answer_${questionId}`),
  }));

  const hasMissingAnswer = answers.some((answer) => !answer.answer);

  if (hasMissingAnswer) {
    redirect(`/lessons/${deliveryId}?token=${accessToken}&error=incomplete`);
  }

  await submitModuleAnswers({
    deliveryId,
    accessToken,
    answers,
  });

  redirect(`/lessons/${deliveryId}?token=${accessToken}&submitted=1`);
}
