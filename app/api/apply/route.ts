import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/apply
 *
 * Receives Creative Youth application submissions from /apply.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BACKEND TEAM — TODO
 * ─────────────────────────────────────────────────────────────────────────────
 * This endpoint currently validates + logs the payload and returns success.
 * Wire it to your datastore so submissions can be exported as Excel/CSV or JSON:
 *
 *   • Supabase  — await supabase.from('applications').insert(record)
 *   • Postgres  — via Prisma / Drizzle
 *   • Airtable / Google Sheets API
 *
 * The payload shape is documented in `ApplicationPayload` below. Every field
 * maps 1:1 to a form input `name` attribute on the /apply form.
 *
 * Multi-select fields (`skills`, `saturday_activities`) arrive as either a
 * single string (one box ticked) or an array (several ticked) — normalise with
 * `toArray()` before persisting.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface ApplicationPayload {
  // Personal Information
  full_name: string;
  email: string;
  phone: string;
  age_range: string;
  country_state: string;

  // Skills & Interests
  skills: string | string[];
  skills_other?: string;
  skills_other_text?: string;
  skills_to_learn: string;
  past_projects?: string;

  // Eligibility & Commitment
  commit_6_weeks: string;
  saturday_activities: string | string[];
  understand_participation: string;

  // Motivation & Vision
  why_join: string;
  problem_to_solve: string;
  what_youd_build: string;
  dream_project: string;

  // Faith Background
  born_again: string;
  holy_spirit_baptism: string;
  holy_spirit_dependence: string;
  testimony: string;
  church?: string;

  // Agreement & Declaration
  agree_steward: string;
  consent_contact: string;
  signature: string;
}

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

const REQUIRED_FIELDS: (keyof ApplicationPayload)[] = [
  "full_name",
  "email",
  "phone",
  "age_range",
  "country_state",
  "skills_to_learn",
  "commit_6_weeks",
  "understand_participation",
  "why_join",
  "problem_to_solve",
  "what_youd_build",
  "dream_project",
  "born_again",
  "holy_spirit_baptism",
  "holy_spirit_dependence",
  "testimony",
  "signature",
];

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ApplicationPayload;

    const missing = REQUIRED_FIELDS.filter((field) => {
      const v = body[field];
      return v === undefined || v === null || String(v).trim() === "";
    });

    if (missing.length > 0) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields", missing },
        { status: 400 }
      );
    }

    const record = {
      ...body,
      skills: toArray(body.skills),
      saturday_activities: toArray(body.saturday_activities),
      submitted_at: new Date().toISOString(),
    };

    // TODO(backend): persist `record`
    console.log("[/api/apply] New application:", JSON.stringify(record, null, 2));

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[/api/apply] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
