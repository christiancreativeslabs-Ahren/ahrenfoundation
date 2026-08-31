# Workbook Merge Implementation Review

## Purpose

This document reviews the current learning-system implementation and defines the corrected migration plan.

The client-facing product concept is **Workbook**.

The existing "email lesson" system is structurally the stronger and more complete implementation. It already supports dynamic programs, modules, enrollments, scheduled delivery, questions, submissions, email events, and engagement tracking. The later `workbook_*` tables and related code are a duplicate system that should be phased out.

The target is not to keep two parallel systems. The target is to merge around the original dynamic lesson system and consistently rename/reframe it as **Workbook**.

Email should become one delivery channel for the Workbook. The dashboard should become another access channel for the same Workbook modules.

## Current End-To-End Audit

Status: **core merge pass complete; Workbook library/route naming pass complete; only external-risk compatibility shims remain**.

The core duplicate workbook implementation has been merged into the stronger dynamic program/module system. The app currently typechecks, the main Workbook entrypoints no longer depend on the duplicate `workbook_*` schema exports, and the highest-risk user/admin/email template wording now frames the curriculum as Workbook.

### Covered So Far

- The duplicate `workbook_*` schema definitions have been commented out in `db/schema.ts`.
- The Hub Workbook dashboard reads from the merged `program` / `program_module` system.
- Workbook submissions write to `module_submission` and `module_submission_answer`.
- Mentor progress reads use merged Workbook submissions.
- `lib/workbook/index.ts` is now a complete Workbook-first service backed by the merged tables.
- Workbook JSON import is preserved and writes into `program`, `program_module`, and `module_question`.
- `db/seeds/workbook.seed.ts` now seeds the merged Workbook program through `ensureAhrenWorkbookProgram()`.
- The admin Workbook module editor is active again and edits `program_module` plus `module_question`.
- Admin navigation has been updated to use Workbook-facing menu labels.
- The token-access route now lives at `/workbook/[deliveryId]`; `/lessons/[deliveryId]` remains as a compatibility redirect for old email links.
- The dashboard Workbook pages use Workbook wording and render through `renderWorkbookModuleHtml()`.
- Email preview pages now use `/email-preview/workbook`; `/email-preview/onboarding/[template]` remains supported through the generic preview route for old template links.
- Email copy now describes Workbook modules rather than email lessons.
- The admin applicant detail workflow now uses Workbook delivery/submission wording for the learning-system portions.
- The resend email dialog has been renamed at the component/export level to `ResendWorkbookEmailDialog`.
- The resend email dialog file has moved to `components/admin/resend-workbook-email-dialog.tsx`.
- The original dynamic learning library has moved from `lib/onboarding/*` to `lib/workbook/*`.
- The public token submit action has moved from `actions/onboarding.ts` to `actions/workbook-delivery.ts`.
- Admin delivery operations now live at `/admin/workbook/deliveries`.
- The old non-schema commented `PROGRAM_WELCOME_EMAIL` and old commented email renderer implementation have been removed.
- Workbook JSON import now prunes stale extra questions for a module when a replacement import supplies fewer questions.
- Email-link Workbook submissions now store `payload.source: "email_delivery"`.
- Dashboard Workbook view events now include the matched delivery and enrollment when available.
- The duplicate `getWorkbookSubmissionReviewData()` helper has been removed from the generic Workbook service; admin submission review now uses the admin workflow helper as the single source for that screen.
- The admin delivery sync action now uses Workbook naming: `syncMemberWorkbookDeliveriesAction()`.
- Active app/action/lib/component code no longer references `workbookPrograms`, `workbookModules`, `workbookQuestions`, `workbookSubmissions`, or `workbookSubmissionAnswers`.
- `pnpm typecheck` passes.
- `pnpm build` passes.

### Not Yet Fully Covered

The following areas should still be reviewed before final cleanup and destructive database work.

#### 1. Workbook Seed Is Now Bridged

File:

- `db/seeds/workbook.seed.ts`

Current state:

- The seed command is preserved.
- The active seed path calls `ensureAhrenWorkbookProgram()`.
- The target helper currently delegates to the original dynamic program seed implementation.

Destination tables:

- `program`
- `program_module`
- `module_question`

Remaining future cleanup:

- Rename the underlying original helper away from `ensureAhrenOnboardingProgram()` once the broader onboarding-to-Workbook naming pass is done.

#### 2. Admin Workbook Import Is Preserved

File:

- `app/(authed)/(admin)/admin/workbook/import/page.tsx`

Current state:

- The import page still exists.
- The form calls `importWorkbookFromJson()`.
- The action parses Workbook JSON and writes to the merged Workbook tables.
- The import copy and example now describe the richer Workbook module shape.

Destination tables:

- `program`
- `program_module`
- `module_question`

#### 3. Admin Workbook Edit Is Active

File:

- `app/(authed)/(admin)/admin/workbook/[moduleId]/edit/page.tsx`

Current state:

- The editor is active again.
- The editor updates the merged Workbook module model.
- The editor writes to `program_module` and `module_question`.

Editable fields:

- week number
- send offset days
- send day label
- title
- subtitle
- subject
- preview text
- opening copy
- scripture text/reference
- reflection
- focus
- action
- status
- questions

#### 4. Internal Naming Status

Current issue:

- The visible Workbook pages, admin menu, dashboard, token-access page, and email templates have been updated.
- The original dynamic learning implementation has been moved under `lib/workbook/*`.
- Core service/content/email helper exports now use Workbook names.
- Remaining `onboarding` wording is limited to applicant/mentor onboarding concepts and the email-preview category alias.

Required fix:

- Product/admin/mentee-facing wording should remain Workbook-first.
- Email-specific wording should remain only where the thing is literally email delivery, email tracking, or email preview.
- Internal code can migrate gradually, but the final direction should be Workbook-first.

Examples to review:

- `/lessons/[deliveryId]` remains as a compatibility redirect for previously issued email links.
- `/email-preview/onboarding/[template]` remains supported through the generic preview route for old preview links.
- `lesson_viewed` is no longer written by the current Workbook token page; new view events use `workbook_viewed`.

#### 5. Admin Menu Status

File:

- `components/admin/admin-shell.tsx`

Current state:

- The main admin menu has been updated to Workbook-facing labels.
- Duplicate learning-system menu entries have been removed from the active menu.
- Old internal admin duplicate routes such as `/admin/workbook-submissions`, `/admin/module-submissions`, and `/admin/onboarding` remain only as minimal compatibility redirects after their Workbook replacements were verified.

Current target language:

- `Workbook`
- `Workbook deliveries`
- `Workbook submissions`
- `Workbook engagement`
- `Workbook email events`

Avoid duplicate menu items that make it look like there are two curricula.

#### 6. Old Duplicate Schema References Remain Only In Schema/Migrations

Current issue:

- `workbookPrograms`, `workbookModules`, `workbookQuestions`, `workbookSubmissions`, and `workbookSubmissionAnswers` should not appear in active app/action/lib/component code.
- The old duplicate database table definitions remain commented in `db/schema.ts`.
- Historical migrations may still mention the old tables because those files describe prior database state.

This is acceptable during the non-destructive database phase.

Required later:

- Once data safety is confirmed, plan a separate destructive migration for old duplicate database tables if needed.
- Do not delete old database structures until existing data has been inspected and migrated or intentionally archived.

### Current Verification State

- `pnpm typecheck`: passes.
- `pnpm build`: passes.
- Active app/action/lib/component code no longer imports or references the duplicate `workbookPrograms`, `workbookModules`, `workbookQuestions`, `workbookSubmissions`, or `workbookSubmissionAnswers` schema exports.
- Targeted scans for high-risk product phrases such as `email lesson`, `lesson content`, `lesson email`, `Open lesson`, `Submit lesson`, `Lesson submissions`, `weekly lessons`, and `lesson progress` are clean outside this review document.
- Targeted scans for old active imports/symbols such as `@/lib/onboarding`, `@/actions/onboarding`, `resend-lesson-email-dialog`, `ensureAhrenOnboardingProgram`, `renderOnboarding*`, `getOnboardingPreviewTemplates`, `syncMemberDeliveries`, `submitModuleAnswers`, `lessonUrl`, and `buildLessonUrl` are clean outside this review document.
- Active token access is now `/workbook/[deliveryId]`, with `/lessons/[deliveryId]` as a redirect.
- Active email preview access is now `/email-preview/workbook`; old template URLs in the shape `/email-preview/onboarding` and `/email-preview/onboarding/[template]` remain minimal redirects.
- Active admin delivery operations are now `/admin/workbook/deliveries`.
- Active admin submission review is now `/admin/workbook/submissions`.
- Workbook email events remain at `/admin/email-events` and Workbook engagement remains at `/admin/engagement`; those shared admin operation routes use Workbook-facing labels instead of nested duplicate routes.
- Non-schema commented legacy blocks introduced by the Workbook merge have been removed.
- `pnpm lint`: blocked by an existing ESLint compatibility failure before lint rules can evaluate the changed files.

Known lint blocker:

```txt
Error while loading rule 'react/display-name':
contextOrFilename.getFilename is not a function
```

This appears related to ESLint 10 and `eslint-plugin-react`.

### Current Verdict

The codebase is now Workbook-first at the active implementation level, while still intentionally retaining route compatibility shims and non-destructive database safety boundaries.

## Correct Mental Model

### Before

There are two overlapping concepts:

- Email lesson/onboarding system
- Workbook system

The email lesson system is more complete.

The workbook system was created as a duplicate and is structurally weaker.

### After

There should be one learning system:

- **Workbook**

Workbook has:

- dynamic programs
- program modules
- module questions
- member enrollments
- scheduled module deliveries
- submissions and answers
- email delivery
- dashboard access
- email events
- engagement events
- admin review and operations

Email is not the curriculum name. Email is only a delivery mechanism.

## Existing Strong System To Keep

The following existing tables should remain the core of the merged Workbook system:

- `program`
- `program_module`
- `program_enrollment`
- `module_delivery`
- `module_question`
- `module_submission`
- `module_submission_answer`
- `email_event`
- `engagement_event`

These tables already represent the right product structure.

The naming is not perfect because several names came from the old email lesson/onboarding framing, but the structure is correct.

## Duplicate System To Phase Out

The following duplicate workbook tables should be phased out non-destructively:

- `workbook_program`
- `workbook_module`
- `workbook_question`
- `workbook_submission`
- `workbook_submission_answer`

Current instruction: do not delete them immediately. Comment them out in place first, then migrate active code away from them.

Later, once the app is stable and production data has been reviewed/migrated, a destructive database migration can be planned separately.

## Non-Destructive Migration Rule

This migration must be done carefully.

### Updated Rule From User

Only the duplicate database schema table definitions should be commented in place.

For the rest of the codebase:

- Do not leave large commented legacy code blocks behind.
- Do not create unnecessary duplicate files or re-export backlogs.
- Do not blindly delete files or code before replacement behavior is 100% implemented elsewhere.
- Prefer finishing one file fully before moving to the next.
- Preserve existing capabilities such as seed, import, admin edit, dashboard access, submissions, mentor review, delivery operations, and event logs.
- Once a replacement is fully implemented, typechecked, and verified, then the old code in that same file can be replaced.
- File deletion is a final cleanup step only, after confirming the file's behavior is fully implemented elsewhere.

The practical rule is: **replace wrong code only after the correct Workbook implementation is ready; delete files last.**

When removing old workbook-specific code:

- Prefer replacing old code with complete Workbook-first behavior.
- Keep route files and entrypoints working where possible.
- Do not turn existing workflows into dead ends unless the user explicitly approves that.
- Do not delete old files yet.
- Do not drop database tables yet.
- Do not generate destructive migrations yet.

The purpose of this stage is convergence, not cleanup.

## Mistakes To Avoid

Do not disable existing workbook entrypoints by throwing errors or redirecting to error pages unless there is a working replacement path.

The following would be incorrect:

- making `db:seed:workbook` fail
- making workbook import fail with no replacement
- making admin workbook editing fail with no replacement
- removing the dashboard workbook pages
- preserving duplicate admin menus that imply two separate curricula

Instead, existing workbook entrypoints should be bridged into the merged Workbook system.

## Current Important Files

### Schema

File:

- `db/schema.ts`

The duplicate `workbook_*` table definitions should remain commented out in place during this migration.

The active Workbook data model should use:

- `programs`
- `programModules`
- `programEnrollments`
- `moduleDeliveries`
- `moduleQuestions`
- `moduleSubmissions`
- `moduleSubmissionAnswers`
- `emailEvents`
- `engagementEvents`

### Workbook Curriculum Source

File:

- `lib/workbook/content.ts`

This contains the Ahren Christian Creativity Masterclass Workbook module definitions.

Current active names:

- `AHREN_WORKBOOK_PROGRAM`
- `WorkbookModuleDefinition`
- `WorkbookProgramDefinition`

### Workbook Service Layer

File:

- `lib/workbook/service.ts`

This contains the core Workbook operations:

- ensure program exists
- create/update modules
- create questions
- enroll a member
- schedule deliveries
- sync deliveries
- send module delivery
- submit module answers
- record engagement events

Core functions now use Workbook names such as:

- `ensureAhrenWorkbookProgram`
- `enrollMemberInWorkbookProgram`
- `syncMemberWorkbookDeliveries`
- `sendWorkbookModuleDelivery`
- `submitWorkbookDeliveryAnswers`
- `recordWorkbookEngagementEvent`

### Email Rendering

Files:

- `lib/workbook/email.ts`
- `lib/workbook/email-renderer.ts`
- `lib/workbook/email-shell.ts`
- `lib/workbook/email-shared.ts`
- `lib/workbook/email-preview-catalog.ts`
- `lib/workbook/urls.ts`

These can keep email-specific names only where the concern is truly email rendering or email tracking.

However, references to "email lesson" as the curriculum should become Workbook language.

Correct framing:

- Workbook module email
- Workbook delivery email
- Workbook email preview

Incorrect framing:

- email lesson as the core product name
- onboarding lesson as the core product name

### Dashboard Workbook Pages

Files:

- `app/(authed)/(users)/dashboard/workbook/page.tsx`
- `app/(authed)/(users)/dashboard/workbook/[moduleId]/page.tsx`

These routes are valid and should remain.

They should read from the merged Workbook system:

- `program`
- `program_module`
- `module_question`
- `module_submission`

They should not read from:

- `workbook_program`
- `workbook_module`
- `workbook_question`
- `workbook_submission`

### Token Workbook Pages

File:

- `app/workbook/[deliveryId]/page.tsx`

This route is structurally useful because email links use token access.

Compatibility file:

- `app/lessons/[deliveryId]/page.tsx`

The compatibility route redirects to `/workbook/[deliveryId]` while preserving `token`, `submitted`, and `error` query parameters.

### Cron

Files:

- `app/(api)/api/cron/module-deliveries/route.ts`
- `app/(api)/api/cron/weekly-lessons/route.ts`

The active cron should remain delivery-based, not hard-coded week-based.

The route name `module-deliveries` is acceptable because it describes the operation, but UI/logging/copy should call these Workbook deliveries.

The older `weekly-lessons` route should stay as a compatibility shim to the current delivery cron until a later route cleanup phase.

### Admin Backend

Important files:

- `components/admin/admin-shell.tsx`
- `app/(authed)/(admin)/admin/workbook/page.tsx`
- `app/(authed)/(admin)/admin/workbook/[moduleId]/page.tsx`
- `app/(authed)/(admin)/admin/workbook/[moduleId]/edit/page.tsx`
- `app/(authed)/(admin)/admin/workbook/submissions/page.tsx`
- `app/(authed)/(admin)/admin/workbook/deliveries/page.tsx`
- `app/(authed)/(admin)/admin/email-events/page.tsx`
- `app/(authed)/(admin)/admin/engagement/page.tsx`

The admin menu should not present duplicate learning systems.

Preferred menu language:

- `Workbook`
- `Workbook submissions`
- `Workbook deliveries`
- `Workbook engagement`
- `Workbook email events`

Avoid:

- `Email lessons`
- `Onboarding` when referring to the learning curriculum
- duplicate `Module submissions` and `Workbook submissions` entries showing the same concept

Admin operational pages can still mention email when they are specifically about email delivery/events.

## Seed Strategy

### Current State

The file:

- `db/seeds/workbook.seed.ts`

now calls `ensureAhrenWorkbookProgram()` and seeds the merged Workbook program.

### Correct Direction

Keep the seed command working, but bridge it to the merged Workbook system.

The package script:

- `pnpm db:seed:workbook`

should seed/sync the real Workbook program into:

- `program`
- `program_module`
- `module_question`

The public seed helper is now:

- `ensureAhrenWorkbookProgram()`

It currently delegates internally to the original dynamic implementation. That deeper helper should be renamed during the later internal naming pass.

Do not leave the old duplicate seed implementation commented in this file. The current rule is that commented legacy is allowed only for the duplicate database schema definitions.

## Import Strategy

The old admin import flow currently assumes JSON with:

- workbook program
- workbook modules
- workbook questions
- `contentHtml`

This should not write to duplicate workbook tables anymore.

The selected implementation is to preserve import behavior and bridge it into Program Modules.

`upsertWorkbookFromDefinition()` now writes into:

- `program`
- `program_module`
- `module_question`

The import parser must support the richer merged Workbook fields:

- `weekNumber`
- `sendOffsetDays`
- `sendDayLabel`
- `subject`
- `previewText`
- `openingCopy`
- `scriptures`
- `reflection`
- `focus`
- `action`
- `questions`

Legacy fields such as `summary` and `contentHtml` are accepted during transition and stored in `payload`.

When an imported module has fewer questions than before, stale extra questions are pruned from `module_question` so the imported Workbook definition does not leave old prompts attached to the module.

## Admin Edit Strategy

The old workbook editor edits:

- module key
- module number
- title
- subtitle
- summary
- content HTML
- status
- questions

The merged Workbook editor should edit:

- module key
- module number
- week number
- send offset days
- send day label
- title
- subtitle
- subject
- preview text
- opening copy
- scripture text/reference or structured scriptures
- reflection
- focus
- action
- status
- questions

The editor should write to:

- `program_module`
- `module_question`

It should not write to `workbook_module` or `workbook_question`.

Editing should remain active now that the Workbook editor writes to the merged module and question tables.

## Submission Strategy

All Workbook answers should be stored in:

- `module_submission`
- `module_submission_answer`

Submission source can be tracked in `payload`, for example:

```ts
payload: {
  source: "dashboard_workbook"
}
```

Email-link submissions can use:

```ts
payload: {
  source: "email_delivery"
}
```

This keeps one answer store while preserving how the user accessed the module.

## Delivery Strategy

Workbook module delivery should remain in:

- `module_delivery`

This table should be interpreted as Workbook delivery.

It can represent:

- scheduled email send
- delivery state
- access token
- opened/clicked events
- assignment started/submitted state
- failure state

Dashboard access does not necessarily need to send an email, but if a submission requires `deliveryId`, then dashboard submission should locate or create the member's delivery row through the existing sync flow.

Important detail:

When locating a delivery for dashboard submission, query by both:

- `moduleId`
- `programMemberId`

Do not select by `moduleId` alone.

## Event Strategy

Keep email-specific event names only where they are literally email events:

- `email_sent`
- `email_opened`
- `email_clicked`
- `email_failed`
- `email_skipped`

Workbook learning events should use Workbook language:

- `workbook_viewed`
- `assignment_started`
- `assignment_submitted`
- `workbook_submitted`

Future cleanup can standardize event names more deeply, but avoid breaking existing analytics until the UI and queries are migrated.

## Naming Plan

### Product/UI Naming

Use Workbook consistently for the learning experience:

- Workbook
- Workbook module
- Workbook assignment
- Workbook submission
- Workbook delivery
- Workbook email

Use Email only for:

- email delivery
- email events
- email previews
- email templates

### Code Naming

Rename in phases.

Phase 1:

- Keep old filenames where needed.
- Add new wrapper functions with Workbook names.
- Replace old active implementations once the Workbook implementation is complete.
- Keep compatibility exports only where they prevent broken imports during a controlled migration.

Phase 2:

- Completed: active code moved from `lib/onboarding/*` to `lib/workbook/*`.
- Completed: imports across app/actions/admin code now point to `lib/workbook/*`.
- No `lib/onboarding/*` compatibility re-export files were kept.

Phase 3:

- Rename routes where product wording requires it.
- Keep redirects from old routes.

Phase 4:

- Remove remaining compatibility shims once callers and route users have moved.
- Create destructive database migration only after data safety is confirmed.

## Route Naming Plan

Keep these active:

- `/dashboard/workbook`
- `/dashboard/workbook/[moduleId]`
- `/workbook/[deliveryId]`
- `/email-preview/workbook/[template]`
- `/admin/workbook`
- `/admin/workbook/[moduleId]`
- `/admin/workbook/deliveries`
- `/admin/workbook/submissions`
- `/admin/email-events`
- `/admin/engagement`

Keep compatibility redirects for now:

- `/lessons/[deliveryId]`
- `/api/cron/weekly-lessons`
- `/email-preview/onboarding`
- `/email-preview/onboarding/[template]`
- `/admin/onboarding`
- `/admin/module-submissions`
- `/admin/workbook-submissions`

## Current Completion Checklist

Current status after the latest merge pass:

1. `db/seeds/workbook.seed.ts`
   - Complete.
   - Calls `ensureAhrenWorkbookProgram()`.

2. `actions/workbook.ts`
   - Complete.
   - Import, edit, and submission actions use the merged Workbook tables.

3. `app/(authed)/(admin)/admin/workbook/[moduleId]/edit/page.tsx`
   - Complete.
   - Active Workbook editor writes through `saveWorkbookModuleAction`.

4. `app/(authed)/(admin)/admin/workbook/import/page.tsx`
   - Complete.
   - Import form is backed by the merged Workbook import action.

5. Admin menu
   - Complete for the main menu.
   - Uses Workbook-facing labels and avoids duplicate submission entries.

6. `lib/workbook/index.ts`
   - Complete.
   - Active implementation uses merged Workbook tables only.

7. Token access page
   - Complete.
   - Active route is `/workbook/[deliveryId]`.
   - `/lessons/[deliveryId]` redirects to the Workbook route for old links.

8. Email preview pages
   - Complete.
   - Active route is `/email-preview/workbook/[template]`.
   - `/email-preview/onboarding/[template]` remains supported through the generic preview route for old links.

9. Dashboard Workbook pages
   - Complete for visible copy and active renderer naming.
   - Detail pages now call `renderWorkbookModuleHtml()`.

10. Admin applicant/member detail learning workflow
   - Complete for visible Workbook delivery/submission wording.
   - Resend dialog file/export is now `components/admin/resend-workbook-email-dialog.tsx` and `ResendWorkbookEmailDialog`.

11. Workbook library move
   - Complete.
   - The dynamic learning implementation now lives under `lib/workbook/*`.

12. Admin Workbook deliveries route
   - Complete.
   - Active route is `/admin/workbook/deliveries`.
   - Old `/admin/onboarding` route remains only as a minimal redirect after active links were updated.

Remaining broader work:

- Decide when it is safe to remove external-risk compatibility shims such as `/lessons/[deliveryId]` and `/api/cron/weekly-lessons`.
- Inspect existing database data in old duplicate `workbook_*` tables before any destructive cleanup.

## Recommended Implementation Sequence

### Step 1: Stabilize Current Partial Merge

- Confirm duplicate workbook schema definitions remain commented.
- Confirm `db/seeds/workbook.seed.ts` seeds shared Workbook modules.
- Run `pnpm db:seed:workbook` against the intended database environment before deploy.
- Run typecheck.

### Step 2: Make Admin Pages Honest And Useful

- Update admin nav labels to Workbook.
- Remove duplicate menu entries once the replacement route is working.
- Convert admin workbook module view to read from `program_module`.
- Convert admin workbook submissions to read from `module_submission`.
- Decide whether admin module editing is needed immediately.

### Step 3: Bridge Dashboard Workbook

- Dashboard workbook list reads from `program_module`.
- Dashboard workbook detail reads from `program_module` and `module_question`.
- Dashboard submissions write to `module_submission` and `module_submission_answer`.
- Dashboard views record engagement events.

### Step 4: Rename Internals Carefully

- Completed: the dynamic learning service/content/helper files now live under `lib/workbook/*`.
- Completed: active imports now point to `lib/workbook/*`.
- Keep route compatibility shims only where they prevent broken external URLs during a controlled migration.
- Avoid adapter layers that merely hide unfinished work.

### Step 5: Clean Product Copy

- Keep UI and email-template copy in Workbook language.
- Keep "email" only for email delivery-specific screens.
- Re-scan public pages, mentor pages, dashboard pages, admin pages, emails, and preview pages after future internal renames.

### Step 6: Data Migration Review

Before deleting anything, inspect whether production/staging has data in:

- `workbook_program`
- `workbook_module`
- `workbook_question`
- `workbook_submission`
- `workbook_submission_answer`

If data exists, write a one-time migration script to move it into:

- `program`
- `program_module`
- `module_question`
- `module_submission`
- `module_submission_answer`

Only after this is verified should destructive migrations be considered.

## Verification Checklist

After each phase:

- `pnpm typecheck`
- seed command works
- dashboard workbook opens
- dashboard module opens
- dashboard submission saves
- admin workbook list opens
- admin module view opens
- admin submissions list opens
- mentor dashboard still shows latest mentee progress
- cron still sends due module deliveries
- email click/open tracking still works

Known current lint issue:

The project currently has an ESLint compatibility failure:

```txt
Error while loading rule 'react/display-name':
contextOrFilename.getFilename is not a function
```

This appears related to ESLint 10 and `eslint-plugin-react`, and blocks lint from running before code rules are evaluated.

## Final Target

The final system should feel like this:

- Admins manage a Workbook.
- Mentees complete Workbook modules.
- Mentors review Workbook progress.
- Emails deliver Workbook modules.
- Cron schedules Workbook deliveries.
- The database stores one set of modules, questions, deliveries, submissions, and events.

No duplicate workbook curriculum system should remain active.

