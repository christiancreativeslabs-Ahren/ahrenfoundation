# Ahren Foundation Implementation Notes

## Current Priority

Implement the Ahren Foundation email lesson and engagement system using the provided references:

- `__refs/AHREN FOUNDATION - COMPLETE EMAIL COPY & ASSIGNMENTS FOR ALL 12 MODULES.md`
- `__refs/(email)`
- `__refs/(email-lib)`

The old Next.js warning that previously lived in this file was incorrect and should be ignored.

If context is compacted while this work is ongoing, reread this file and resume the implementation from the dynamic onboarding/email system described here.

## Program Model

Do not hard-code the lesson system as a fixed 6-week or 12-module implementation in business logic.

Build the program flow dynamically so Ahren can change the number of weeks, modules, send days, and future lesson programs without rewriting code.

For the current Ahren Christian Creativity Masterclass:

- The program runs for 6 weeks.
- It has 12 modules.
- Modules are sent on a Monday/Friday rhythm.
- The first module should be scheduled one week after a mentee signs up.
- Mentor and mentee welcome emails should use the copy from the reference document.

Use flexible concepts such as:

- programs
- program modules
- enrollments
- module deliveries
- module questions
- module submissions
- engagement events

## Email Requirements

Create an Ahren-branded base email layout inspired by the email library references, but adapted to Ahren Foundation branding and copy.

Create templates for:

- mentee welcome email
- mentor welcome email
- module 1 through module 12 emails
- final/completion messaging where appropriate

Email templates should use the new Ahren layout.

Email sending should be handled through the app's email service layer and recorded in the database.

## Scheduling And Cron

Cron should send due module deliveries, not hard-coded week numbers.

Expected flow:

1. A mentee signs up.
2. The app creates or locates the user/program member.
3. The app creates a program enrollment.
4. The app schedules module deliveries from the active program module configuration.
5. The first delivery is scheduled one week after signup.
6. Cron queries due scheduled deliveries and sends them.
7. Sent, skipped, and failed sends are recorded.

## Database Requirements

Add or extend schema for:

- dynamic programs and modules
- per-member enrollments
- scheduled module deliveries
- assignment questions
- assignment submissions and answers
- email events
- engagement/activity events

Track important activity such as:

- email sent
- email opened
- email clicked
- lesson viewed
- assignment started
- assignment submitted

## Lesson Pages

Create application routes where email clicks take mentees to the full lesson.

These pages should:

- display the full module content
- display the 5 assignment questions for that module
- allow the mentee to submit answers
- save all answers to the database
- record lesson views and submissions as engagement events

Email links should route through tracking endpoints before redirecting to the lesson page.

## Admin Follow-Up Tasks

Keep email templates hardcoded in code. Do not add template editing or CMS-style email authoring for admins.

The next admin/backend task is to expand the admin operational workflow around applicants who have not yet become active mentees.

Current working term in planning notes:

- pre-mentee

Preferred product wording if labels are being improved in the UI:

- applicant
- prospective mentee

Use one consistent label in the UI once implemented. `Prospective mentee` is preferred if a more polished term is needed.

This should be treated as an admin-only operational workflow, not a public-facing page.

### Admin Route Requirements

Add or confirm an admin detail route for each pre-mentee or applicant.

Suggested route shape:

- `/admin/join-applications/[applicationId]`

If the existing route structure already uses a program-member id for this workflow, keep it only if the page can still represent applicants before mentee activation clearly and correctly.

### Applicant Detail Page Requirements

The detail page should show the full review context for one applicant, including:

- application status
- application type
- full name
- email address
- phone number
- location
- consent state
- created date
- updated date
- linked user record if one exists
- linked program member record if one exists
- current onboarding step or current internal processing step

For youth applicants, show:

- age range
- current skills and interests
- other skill text where supplied
- skills they want to learn or improve
- why they want to join
- project experience
- preferred participation formats
- born-again response
- Holy Spirit response
- dependence on the Holy Spirit response
- testimony
- church

For mentor applicants, show:

- profession or industry
- years of experience
- areas of expertise
- other expertise text where supplied
- why they want to mentor
- commitment level
- preferred mentorship format
- born-again response
- Holy Spirit response
- dependence on the Holy Spirit response
- testimony
- church or ministry affiliation

### Admin Workflow Actions

The applicant detail route should make it easy for admins to:

- approve the application
- reject the application
- leave internal review notes if notes are introduced
- assign or continue the next onboarding step
- view whether welcome emails have already been sent
- view whether the applicant has become a program member
- view whether a program enrollment has been created

If the applicant is approved and converted into an active mentee flow, the route should make it easy to navigate into the member-level onboarding or progress view.

### Relationship To Existing Admin Backend

Build on top of the existing admin backend instead of creating a parallel system.

Reuse existing pieces where appropriate:

- admin auth gate
- admin shell
- join applications listing
- program member detail page
- admin server actions

The goal is to bridge the gap between application review and active mentee management cleanly.

### Supporting Admin Screens To Add Or Improve

To fully support the new onboarding system, the admin backend should also cover:

- onboarding overview dashboard
- email event log
- engagement event log
- module submission review
- delivery status and retry workflow

Suggested route shapes:

- `/admin/onboarding`
- `/admin/email-events`
- `/admin/engagement`
- `/admin/module-submissions`

### Onboarding Dashboard Expectations

The onboarding dashboard should show:

- total applicants
- approved applicants
- rejected applicants
- active enrollments
- completed enrollments
- scheduled deliveries
- sent deliveries
- failed deliveries
- module completion rate
- recent submission activity

### Email Event Log Expectations

The email event screen should show:

- recipient
- template key
- send status
- provider id
- sent timestamp
- error message where present
- linked member, enrollment, module, or delivery where available

### Engagement Event Log Expectations

The engagement screen should show:

- email sent
- email opened
- email clicked
- lesson viewed
- assignment started
- assignment submitted

Include filters where practical for:

- member
- module
- event type
- date

### Module Submission Review Expectations

The module submission review screen should show:

- mentee name
- mentee email
- module number
- module title
- submission timestamp
- submitted answers
- submission count or latest submission state

### Delivery Operations Expectations

Admins should be able to manage onboarding deliveries operationally.

Add or improve actions for:

- resend a module email
- reschedule a module delivery
- retry a failed delivery
- mark a delivery back to scheduled where appropriate
- skip or cancel a delivery where appropriate
- regenerate missing deliveries for a member if needed

### Important Constraint

Do not convert email content into editable admin-managed templates. The content remains hardcoded in code as already implemented.

## Email Preview Routes

Create email preview pages following the style of `__refs/(email)/email-preview`.

Use preview routes in this shape:

- `/email-preview/onboarding/[template]`

Do not use `/email-preview/ahren/[template]`.

The preview system should show every Ahren email template, including:

- welcome emails
- all 12 module emails
- any completion/final emails

## Content Handling

Use the reference document as the source of truth for module copy and assignment questions.

Clean encoding artifacts from the imported copy, including broken dash, quote, currency, and emoji characters caused by mojibake.

Preserve the Christian/Kingdom language and scripture references from the source document unless the user explicitly asks for copy changes.

## Existing System Notes

The repository previously had an older 9-week lesson flow in files such as:

- `lib/program.ts`
- `lib/email.ts`
- `db/schema.ts`

That older flow has been migrated toward the dynamic Ahren module system. The active cron route is `/api/cron/module-deliveries`.
