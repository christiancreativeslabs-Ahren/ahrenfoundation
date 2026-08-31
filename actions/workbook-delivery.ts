"use server";

import { redirect } from "next/navigation";
import { submitWorkbookDeliveryAnswers } from "@/lib/workbook/service";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function submitWorkbookAssignment(formData: FormData) {
  const deliveryId = value(formData, "delivery_id");
  const accessToken = value(formData, "access_token");
  const questionIds = formData.getAll("question_id").map(String);

  if (!deliveryId || !accessToken || !questionIds.length) {
    redirect(`/workbook/${deliveryId || "missing"}?token=${accessToken}&error=missing`);
  }

  const answers = questionIds.map((questionId) => ({
    questionId,
    answer: value(formData, `answer_${questionId}`),
  }));

  const hasMissingAnswer = answers.some((answer) => !answer.answer);

  if (hasMissingAnswer) {
    redirect(`/workbook/${deliveryId}?token=${accessToken}&error=incomplete`);
  }

  await submitWorkbookDeliveryAnswers({
    deliveryId,
    accessToken,
    answers,
  });

  redirect(`/workbook/${deliveryId}?token=${accessToken}&submitted=1`);
}
