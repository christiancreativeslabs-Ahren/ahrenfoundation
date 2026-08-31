import { updateMentorSession } from "@/actions/mentor";
import { Button } from "@/components/ui/button";
import { DateTimeInput, HiddenInput, TextInput, Textarea } from "@/components/ui/input-fields";

const initialActionState = { ok: false, message: "" };

function toDateTimeLocal(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

async function updateSessionAction(formData: FormData) {
  "use server";
  await updateMentorSession(initialActionState, formData);
}

export function MentorSessionForm({
  session,
}: {
  session: {
    id: string;
    status: string;
    scheduledAt: Date | string | null;
    meetingUrl: string | null;
    notes: string | null;
  };
}) {
  return (
    <form action={updateSessionAction} className="space-y-3">
      <HiddenInput name="session_id" value={session.id} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Status</span>
          <select
            name="status"
            defaultValue={session.status}
            className="h-10 w-full rounded-xl border border-cyan-400/15 bg-[#080d2e] px-3 text-sm text-white"
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Scheduled time</span>
          <DateTimeInput name="scheduled_at" defaultValue={toDateTimeLocal(session.scheduledAt)} />
        </label>
      </div>
      <label className="block space-y-1">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Meeting link</span>
        <TextInput name="meeting_url" defaultValue={session.meetingUrl ?? ""} placeholder="https://..." />
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Session notes</span>
        <Textarea name="notes" defaultValue={session.notes ?? ""} />
      </label>
      <Button type="submit" className="bg-gradient-to-r from-[#00c9ff] to-[#00ff9d] text-[#080d2e]">
        Save session
      </Button>
    </form>
  );
}
