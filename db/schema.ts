import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => createId());

const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true }).notNull().defaultNow();

export const users = pgTable(
  "user",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    email: text("email").notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    name: text("name").notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    image: text("image"),
  },
  (table) => [uniqueIndex("user_email_idx").on(table.email)]
);


export const sessions = pgTable(
  "session",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
  },
  (table) => [
    uniqueIndex("session_token_idx").on(table.token),
    index("session_user_id_idx").on(table.userId),
  ]
);

export const accounts = pgTable(
  "account",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    providerId: text("provider_id").notNull(),
    accountId: text("account_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
  },
  (table) => [
    uniqueIndex("account_provider_account_idx").on(
      table.providerId,
      table.accountId
    ),
    index("account_user_id_idx").on(table.userId),
  ]
);

export const verifications = pgTable(
  "verification",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    identifier: text("identifier").notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const trainingApplicationSettings = pgTable(
  "training_application_settings",
  {
    key: text("key").primaryKey(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    applicationsOpenAt: timestamp("applications_open_at", { withTimezone: true }),
    applicationsCloseAt: timestamp("applications_close_at", { withTimezone: true }),
    forceClosed: boolean("force_closed").notNull().default(false),
    closedTitle: text("closed_title").notNull().default("Applications Closed."),
    closedMessageHtml: text("closed_message_html").notNull().default(""),
  },
  (table) => [index("training_application_settings_key_idx").on(table.key)]
);

export const joinApplications = pgTable(
  "join_application",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    applicationType: text("application_type").notNull(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phoneNumber: text("phone_number").notNull(),
    location: text("location").notNull(),
    ageRange: text("age_range"),
    sex: text("sex"),
    skills: jsonb("skills").$type<string[]>(),
    skillsOther: text("skills_other"),
    skillsToLearn: text("skills_to_learn"),
    availability: jsonb("availability").$type<string[]>(),
    whyJoin: text("why_join"),
    faithBornAgain: text("faith_born_again"),
    faithHolySpirit: text("faith_holy_spirit"),
    testimony: text("testimony"),
    status: text("status").notNull().default("pending"),
    consent: boolean("consent").notNull().default(false),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
  },
  (table) => [
    index("join_application_type_idx").on(table.applicationType),
    index("join_application_email_idx").on(table.email),
    index("join_application_status_idx").on(table.status),
  ]
);

export const joinApplicationListItems = pgTable(
  "join_application_list_item",
  {
    joinApplicationId: text("join_application_id")
      .primaryKey()
      .references(() => joinApplications.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    applicationType: text("application_type").notNull(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phoneNumber: text("phone_number").notNull(),
    location: text("location").notNull(),
    status: text("status").notNull(),
    consent: boolean("consent").notNull().default(false),
    programMemberId: text("program_member_id").references(
      () => programMembers.id,
      { onDelete: "set null" },
    ),
    memberRole: text("member_role"),
    memberStatus: text("member_status"),
    memberCurrentStep: text("member_current_step"),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    searchText: text("search_text").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
  },
  (table) => [
    index("join_application_list_created_idx").on(table.createdAt),
    index("join_application_list_status_idx").on(table.status),
    index("join_application_list_type_idx").on(table.applicationType),
    index("join_application_list_member_idx").on(table.programMemberId),
    index("join_application_list_user_idx").on(table.userId),
  ]
);

export const programMembers = pgTable(
  "program_member",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    joinApplicationId: text("join_application_id")
      .notNull()
      .references(() => joinApplications.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    role: text("role").notNull(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    status: text("status").notNull().default("application_received"),
    currentStep: text("current_step").notNull().default("welcome_email"),
    mentorAgreementSignedAt: timestamp("mentor_agreement_signed_at", {
      withTimezone: true,
    }),
    orientationCompletedAt: timestamp("orientation_completed_at", {
      withTimezone: true,
    }),
    certificateIssuedAt: timestamp("certificate_issued_at", {
      withTimezone: true,
    }),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    loginCredentialsSentAt: timestamp("login_credentials_sent_at", {
      withTimezone: true,
    }),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
  },
  (table) => [
    uniqueIndex("program_member_join_application_idx").on(
      table.joinApplicationId
    ),
    index("program_member_user_id_idx").on(table.userId),
    index("program_member_role_idx").on(table.role),
    index("program_member_status_idx").on(table.status),
    index("program_member_email_idx").on(table.email),
  ]
);

export const programs = pgTable(
  "program",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    summary: text("summary"),
    status: text("status").notNull().default("draft"),
    startsAfterDays: integer("starts_after_days").notNull().default(7),
    isActive: boolean("is_active").notNull().default(false),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
  },
  (table) => [
    uniqueIndex("program_slug_idx").on(table.slug),
    index("program_status_idx").on(table.status),
    index("program_active_idx").on(table.isActive),
  ]
);

/*
export const workbookPrograms = pgTable(
  "workbook_program",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    summary: text("summary"),
    status: text("status").notNull().default("draft"),
    isActive: boolean("is_active").notNull().default(false),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
  },
  (table) => [
    uniqueIndex("workbook_program_slug_idx").on(table.slug),
    index("workbook_program_status_idx").on(table.status),
    index("workbook_program_active_idx").on(table.isActive),
  ]
);

export const workbookModules = pgTable(
  "workbook_module",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    workbookProgramId: text("workbook_program_id")
      .notNull()
      .references(() => workbookPrograms.id, { onDelete: "cascade" }),
    moduleKey: text("module_key").notNull(),
    moduleNumber: integer("module_number").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    summary: text("summary"),
    contentHtml: text("content_html").notNull().default(""),
    sortOrder: integer("sort_order").notNull(),
    status: text("status").notNull().default("draft"),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
  },
  (table) => [
    uniqueIndex("workbook_module_program_key_idx").on(
      table.workbookProgramId,
      table.moduleKey,
    ),
    uniqueIndex("workbook_module_program_number_idx").on(
      table.workbookProgramId,
      table.moduleNumber,
    ),
    index("workbook_module_program_idx").on(table.workbookProgramId),
    index("workbook_module_status_idx").on(table.status),
  ]
);

export const workbookQuestions = pgTable(
  "workbook_question",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    workbookModuleId: text("workbook_module_id")
      .notNull()
      .references(() => workbookModules.id, { onDelete: "cascade" }),
    questionNumber: integer("question_number").notNull(),
    prompt: text("prompt").notNull(),
    responseType: text("response_type").notNull().default("long_text"),
    isRequired: boolean("is_required").notNull().default(true),
  },
  (table) => [
    uniqueIndex("workbook_question_module_number_idx").on(
      table.workbookModuleId,
      table.questionNumber,
    ),
    index("workbook_question_module_idx").on(table.workbookModuleId),
  ]
);

export const workbookSubmissions = pgTable(
  "workbook_submission",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    workbookProgramId: text("workbook_program_id")
      .notNull()
      .references(() => workbookPrograms.id, { onDelete: "cascade" }),
    workbookModuleId: text("workbook_module_id")
      .notNull()
      .references(() => workbookModules.id, { onDelete: "cascade" }),
    programMemberId: text("program_member_id")
      .notNull()
      .references(() => programMembers.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("submitted"),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
  },
  (table) => [
    index("workbook_submission_program_idx").on(table.workbookProgramId),
    index("workbook_submission_module_idx").on(table.workbookModuleId),
    index("workbook_submission_member_idx").on(table.programMemberId),
  ]
);

export const workbookSubmissionAnswers = pgTable(
  "workbook_submission_answer",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    submissionId: text("submission_id")
      .notNull()
      .references(() => workbookSubmissions.id, { onDelete: "cascade" }),
    questionId: text("question_id")
      .notNull()
      .references(() => workbookQuestions.id, { onDelete: "cascade" }),
    answer: text("answer").notNull(),
  },
  (table) => [
    uniqueIndex("workbook_submission_answer_question_idx").on(
      table.submissionId,
      table.questionId,
    ),
    index("workbook_submission_answer_submission_idx").on(table.submissionId),
  ]
);
*/


export const programModules = pgTable(
  "program_module",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    programId: text("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    moduleKey: text("module_key").notNull(),
    moduleNumber: integer("module_number").notNull(),
    weekNumber: integer("week_number").notNull(),
    sendOffsetDays: integer("send_offset_days").notNull(),
    sendDayLabel: text("send_day_label").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    subject: text("subject").notNull(),
    previewText: text("preview_text"),
    openingCopy: text("opening_copy").notNull(),
    scriptureText: text("scripture_text").notNull(),
    scriptureReference: text("scripture_reference").notNull(),
    reflection: text("reflection").notNull(),
    focus: text("focus").notNull(),
    action: text("action").notNull(),
    sortOrder: integer("sort_order").notNull(),
    status: text("status").notNull().default("published"),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
  },
  (table) => [
    uniqueIndex("program_module_program_key_idx").on(
      table.programId,
      table.moduleKey
    ),
    uniqueIndex("program_module_program_number_idx").on(
      table.programId,
      table.moduleNumber
    ),
    index("program_module_program_idx").on(table.programId),
    index("program_module_status_idx").on(table.status),
  ]
);

export const programEnrollments = pgTable(
  "program_enrollment",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    programId: text("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    programMemberId: text("program_member_id")
      .notNull()
      .references(() => programMembers.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("active"),
    signedUpAt: timestamp("signed_up_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
  },
  (table) => [
    uniqueIndex("program_enrollment_member_program_idx").on(
      table.programMemberId,
      table.programId
    ),
    index("program_enrollment_member_idx").on(table.programMemberId),
    index("program_enrollment_program_idx").on(table.programId),
    index("program_enrollment_status_idx").on(table.status),
  ]
);

export const moduleDeliveries = pgTable(
  "module_delivery",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    enrollmentId: text("enrollment_id")
      .notNull()
      .references(() => programEnrollments.id, { onDelete: "cascade" }),
    moduleId: text("module_id")
      .notNull()
      .references(() => programModules.id, { onDelete: "cascade" }),
    programMemberId: text("program_member_id")
      .notNull()
      .references(() => programMembers.id, { onDelete: "cascade" }),
    recipientEmail: text("recipient_email").notNull(),
    accessToken: text("access_token").notNull(),
    status: text("status").notNull().default("scheduled"),
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }).notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    openedAt: timestamp("opened_at", { withTimezone: true }),
    clickedAt: timestamp("clicked_at", { withTimezone: true }),
    assignmentStartedAt: timestamp("assignment_started_at", {
      withTimezone: true,
    }),
    assignmentSubmittedAt: timestamp("assignment_submitted_at", {
      withTimezone: true,
    }),
    failedAt: timestamp("failed_at", { withTimezone: true }),
    error: text("error"),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
  },
  (table) => [
    uniqueIndex("module_delivery_enrollment_module_idx").on(
      table.enrollmentId,
      table.moduleId
    ),
    uniqueIndex("module_delivery_access_token_idx").on(table.accessToken),
    index("module_delivery_status_idx").on(table.status),
    index("module_delivery_scheduled_for_idx").on(table.scheduledFor),
    index("module_delivery_member_idx").on(table.programMemberId),
  ]
);

export const moduleQuestions = pgTable(
  "module_question",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    moduleId: text("module_id")
      .notNull()
      .references(() => programModules.id, { onDelete: "cascade" }),
    questionNumber: integer("question_number").notNull(),
    prompt: text("prompt").notNull(),
    responseType: text("response_type").notNull().default("long_text"),
    isRequired: boolean("is_required").notNull().default(true),
  },
  (table) => [
    uniqueIndex("module_question_module_number_idx").on(
      table.moduleId,
      table.questionNumber
    ),
    index("module_question_module_idx").on(table.moduleId),
  ]
);

export const moduleSubmissions = pgTable(
  "module_submission",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    enrollmentId: text("enrollment_id")
      .notNull()
      .references(() => programEnrollments.id, { onDelete: "cascade" }),
    moduleId: text("module_id")
      .notNull()
      .references(() => programModules.id, { onDelete: "cascade" }),
    deliveryId: text("delivery_id")
      .notNull()
      .references(() => moduleDeliveries.id, { onDelete: "cascade" }),
    programMemberId: text("program_member_id")
      .notNull()
      .references(() => programMembers.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("submitted"),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
  },
  (table) => [
    index("module_submission_enrollment_idx").on(table.enrollmentId),
    index("module_submission_module_idx").on(table.moduleId),
    index("module_submission_delivery_idx").on(table.deliveryId),
    index("module_submission_member_idx").on(table.programMemberId),
  ]
);

export const moduleSubmissionAnswers = pgTable(
  "module_submission_answer",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    submissionId: text("submission_id")
      .notNull()
      .references(() => moduleSubmissions.id, { onDelete: "cascade" }),
    questionId: text("question_id")
      .notNull()
      .references(() => moduleQuestions.id, { onDelete: "cascade" }),
    answer: text("answer").notNull(),
  },
  (table) => [
    uniqueIndex("module_submission_answer_question_idx").on(
      table.submissionId,
      table.questionId
    ),
    index("module_submission_answer_submission_idx").on(table.submissionId),
  ]
);

export const engagementEvents = pgTable(
  "engagement_event",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    programMemberId: text("program_member_id").references(
      () => programMembers.id,
      { onDelete: "set null" }
    ),
    enrollmentId: text("enrollment_id").references(
      () => programEnrollments.id,
      { onDelete: "set null" }
    ),
    moduleId: text("module_id").references(() => programModules.id, {
      onDelete: "set null",
    }),
    deliveryId: text("delivery_id").references(() => moduleDeliveries.id, {
      onDelete: "set null",
    }),
    emailEventId: text("email_event_id"),
    eventType: text("event_type").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  },
  (table) => [
    index("engagement_event_member_idx").on(table.programMemberId),
    index("engagement_event_enrollment_idx").on(table.enrollmentId),
    index("engagement_event_module_idx").on(table.moduleId),
    index("engagement_event_delivery_idx").on(table.deliveryId),
    index("engagement_event_type_idx").on(table.eventType),
  ]
);

export const mentorAssignments = pgTable(
  "mentor_assignment",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    youthMemberId: text("youth_member_id")
      .notNull()
      .references(() => programMembers.id, { onDelete: "cascade" }),
    mentorMemberId: text("mentor_member_id")
      .notNull()
      .references(() => programMembers.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("active"),
    assignedAt: timestamp("assigned_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    notes: text("notes"),
  },
  (table) => [
    index("mentor_assignment_youth_idx").on(table.youthMemberId),
    index("mentor_assignment_mentor_idx").on(table.mentorMemberId),
    index("mentor_assignment_status_idx").on(table.status),
  ]
);

export const mentorshipSessions = pgTable(
  "mentorship_session",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    assignmentId: text("assignment_id")
      .notNull()
      .references(() => mentorAssignments.id, { onDelete: "cascade" }),
    sessionNumber: integer("session_number").notNull(),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    meetingUrl: text("meeting_url"),
    notes: text("notes"),
    status: text("status").notNull().default("scheduled"),
  },
  (table) => [
    uniqueIndex("mentorship_session_assignment_number_idx").on(
      table.assignmentId,
      table.sessionNumber
    ),
    index("mentorship_session_status_idx").on(table.status),
  ]
);

export const certificates = pgTable(
  "certificate",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    programMemberId: text("program_member_id")
      .notNull()
      .references(() => programMembers.id, { onDelete: "cascade" }),
    certificateNumber: text("certificate_number").notNull(),
    issuedAt: timestamp("issued_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    pdfUrl: text("pdf_url"),
    status: text("status").notNull().default("issued"),
  },
  (table) => [
    uniqueIndex("certificate_number_idx").on(table.certificateNumber),
    index("certificate_member_idx").on(table.programMemberId),
  ]
);

export const emailEvents = pgTable(
  "email_event",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    programMemberId: text("program_member_id").references(
      () => programMembers.id,
      { onDelete: "set null" }
    ),
    enrollmentId: text("enrollment_id").references(
      () => programEnrollments.id,
      { onDelete: "set null" }
    ),
    moduleId: text("module_id").references(() => programModules.id, {
      onDelete: "set null",
    }),
    bulkEmailCampaignId: text("bulk_email_campaign_id"),
    deliveryId: text("delivery_id").references(() => moduleDeliveries.id, {
      onDelete: "set null",
    }),
    recipientEmail: text("recipient_email").notNull(),
    templateKey: text("template_key").notNull(),
    status: text("status").notNull().default("queued"),
    providerId: text("provider_id"),
    error: text("error"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
  },
  (table) => [
    index("email_event_member_idx").on(table.programMemberId),
    index("email_event_enrollment_idx").on(table.enrollmentId),
    index("email_event_module_idx").on(table.moduleId),
    index("email_event_bulk_campaign_idx").on(table.bulkEmailCampaignId),
    index("email_event_delivery_idx").on(table.deliveryId),
    index("email_event_recipient_idx").on(table.recipientEmail),
    index("email_event_template_idx").on(table.templateKey),
    index("email_event_status_idx").on(table.status),
  ]
);

export const bulkEmailCampaigns = pgTable(
  "bulk_email_campaign",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    createdByUserId: text("created_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    subject: text("subject").notNull(),
    bodyHtml: text("body_html").notNull(),
    status: text("status").notNull().default("draft"),
    audienceType: text("audience_type").notNull().default("custom"),
    audienceLabel: text("audience_label"),
    recipientQuery: jsonb("recipient_query").$type<Record<string, unknown>>(),
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    senderLabel: text("sender_label"),
    replyTo: text("reply_to"),
    recipientCount: integer("recipient_count").notNull().default(0),
    sentCount: integer("sent_count").notNull().default(0),
    failedCount: integer("failed_count").notNull().default(0),
    skippedCount: integer("skipped_count").notNull().default(0),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
  },
  (table) => [
    index("bulk_email_campaign_status_idx").on(table.status),
    index("bulk_email_campaign_audience_idx").on(table.audienceType),
    index("bulk_email_campaign_scheduled_for_idx").on(table.scheduledFor),
    index("bulk_email_campaign_created_by_idx").on(table.createdByUserId),
  ]
);

export const bulkEmailCampaignAttachments = pgTable(
  "bulk_email_campaign_attachment",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    campaignId: text("campaign_id")
      .notNull()
      .references(() => bulkEmailCampaigns.id, { onDelete: "cascade" }),
    filename: text("filename").notNull(),
    contentType: text("content_type"),
    contentBase64: text("content_base64").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
  },
  (table) => [
    index("bulk_email_campaign_attachment_campaign_idx").on(table.campaignId),
  ]
);

export const bulkEmailCampaignRecipients = pgTable(
  "bulk_email_campaign_recipient",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    campaignId: text("campaign_id")
      .notNull()
      .references(() => bulkEmailCampaigns.id, { onDelete: "cascade" }),
    programMemberId: text("program_member_id").references(
      () => programMembers.id,
      { onDelete: "set null" }
    ),
    joinApplicationId: text("join_application_id").references(
      () => joinApplications.id,
      { onDelete: "set null" }
    ),
    recipientName: text("recipient_name").notNull(),
    recipientEmail: text("recipient_email").notNull(),
    status: text("status").notNull().default("pending"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    providerId: text("provider_id"),
    error: text("error"),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
  },
  (table) => [
    index("bulk_email_campaign_recipient_campaign_idx").on(table.campaignId),
    index("bulk_email_campaign_recipient_email_idx").on(table.recipientEmail),
    index("bulk_email_campaign_recipient_status_idx").on(table.status),
    index("bulk_email_campaign_recipient_member_idx").on(table.programMemberId),
  ]
);

export const dashboardResources = pgTable(
  "dashboard_resource",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    audience: text("audience").notNull(),
    category: text("category").notNull(),
    title: text("title").notNull(),
    summary: text("summary"),
    url: text("url"),
    isPublished: boolean("is_published").notNull().default(false),
  },
  (table) => [
    index("dashboard_resource_audience_idx").on(table.audience),
    index("dashboard_resource_category_idx").on(table.category),
    index("dashboard_resource_published_idx").on(table.isPublished),
  ]
);

export const projectShowcases = pgTable(
  "project_showcase",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    programMemberId: text("program_member_id").references(
      () => programMembers.id,
      { onDelete: "set null" }
    ),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    projectUrl: text("project_url"),
    status: text("status").notNull().default("draft"),
    payload: jsonb("payload").$type<Record<string, unknown>>(),
  },
  (table) => [
    index("project_showcase_user_idx").on(table.userId),
    index("project_showcase_member_idx").on(table.programMemberId),
    index("project_showcase_status_idx").on(table.status),
  ]
);

export const communityPosts = pgTable(
  "community_post",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    programMemberId: text("program_member_id").references(
      () => programMembers.id,
      { onDelete: "set null" }
    ),
    channel: text("channel").notNull().default("verified_members"),
    body: text("body").notNull(),
    status: text("status").notNull().default("published"),
  },
  (table) => [
    index("community_post_user_idx").on(table.userId),
    index("community_post_member_idx").on(table.programMemberId),
    index("community_post_channel_idx").on(table.channel),
    index("community_post_status_idx").on(table.status),
  ]
);

export const communityEvents = pgTable(
  "community_event",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    audience: text("audience").notNull().default("all"),
    title: text("title").notNull(),
    summary: text("summary"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    location: text("location"),
    meetingUrl: text("meeting_url"),
    status: text("status").notNull().default("published"),
  },
  (table) => [
    index("community_event_audience_idx").on(table.audience),
    index("community_event_starts_at_idx").on(table.startsAt),
    index("community_event_status_idx").on(table.status),
  ]
);

export const opportunities = pgTable(
  "opportunity",
  {
    id: id(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    audience: text("audience").notNull().default("all"),
    type: text("type").notNull(),
    title: text("title").notNull(),
    summary: text("summary"),
    url: text("url"),
    status: text("status").notNull().default("published"),
  },
  (table) => [
    index("opportunity_audience_idx").on(table.audience),
    index("opportunity_type_idx").on(table.type),
    index("opportunity_status_idx").on(table.status),
  ]
);




