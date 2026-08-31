import { reviewMenteeWorkbookSubmission } from "@/actions/mentor";
import { Button } from "@/components/ui/button";
import { HiddenInput, Textarea } from "@/components/ui/input-fields";

const initialActionState = { ok: false, message: "" };

async function reviewSubmissionAction(formData: FormData) {
  "use server";
  await reviewMenteeWorkbookSubmission(initialActionState, formData);
}

export function MentorReviewForm({
  submissionId,
  defaultFeedback,
  defaultStatus,
}: {
  submissionId: string;
  defaultFeedback: string;
  defaultStatus: string;
}) {
  return (
    <form action={reviewSubmissionAction} className="space-y-4">
      <HiddenInput name="submission_id" value={submissionId} />
      <label className="block space-y-1">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Review status</span>
        <select
          name="review_status"
          defaultValue={defaultStatus}
          className="h-10 w-full rounded-xl border border-cyan-400/15 bg-[#080d2e] px-3 text-sm text-white"
        >
          <option value="needs_review">Needs review</option>
          <option value="reviewed">Reviewed</option>
          <option value="needs_follow_up">Needs follow-up</option>
        </select>
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Mentor feedback</span>
        <Textarea
          name="feedback"
          defaultValue={defaultFeedback}
          className="min-h-40"
          placeholder="Add feedback, encouragement, questions, or session follow-up notes."
        />
      </label>
      <Button type="submit" className="bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]">
        Save review
      </Button>
    </form>
  );
}
