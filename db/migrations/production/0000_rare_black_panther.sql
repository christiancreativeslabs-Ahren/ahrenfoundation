CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"provider_id" text NOT NULL,
	"account_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text
);
--> statement-breakpoint
CREATE TABLE "certificate" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"program_member_id" text NOT NULL,
	"certificate_number" text NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"pdf_url" text,
	"status" text DEFAULT 'issued' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_event" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"audience" text DEFAULT 'all' NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"starts_at" timestamp with time zone NOT NULL,
	"location" text,
	"meeting_url" text,
	"status" text DEFAULT 'published' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_post" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" text,
	"program_member_id" text,
	"channel" text DEFAULT 'verified_members' NOT NULL,
	"body" text NOT NULL,
	"status" text DEFAULT 'published' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dashboard_resource" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"audience" text NOT NULL,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"url" text,
	"is_published" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_event" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"program_member_id" text,
	"enrollment_id" text,
	"module_id" text,
	"delivery_id" text,
	"recipient_email" text NOT NULL,
	"template_key" text NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"provider_id" text,
	"error" text,
	"sent_at" timestamp with time zone,
	"payload" jsonb
);
--> statement-breakpoint
CREATE TABLE "engagement_event" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"program_member_id" text,
	"enrollment_id" text,
	"module_id" text,
	"delivery_id" text,
	"email_event_id" text,
	"event_type" text NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "join_application_list_item" (
	"join_application_id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"application_type" text NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text NOT NULL,
	"location" text NOT NULL,
	"status" text NOT NULL,
	"consent" boolean DEFAULT false NOT NULL,
	"program_member_id" text,
	"member_role" text,
	"member_status" text,
	"member_current_step" text,
	"user_id" text,
	"search_text" text NOT NULL,
	"payload" jsonb
);
--> statement-breakpoint
CREATE TABLE "join_application" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"application_type" text NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text NOT NULL,
	"location" text NOT NULL,
	"age_range" text,
	"sex" text,
	"skills" jsonb,
	"skills_other" text,
	"skills_to_learn" text,
	"availability" jsonb,
	"why_join" text,
	"faith_born_again" text,
	"faith_holy_spirit" text,
	"testimony" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"consent" boolean DEFAULT false NOT NULL,
	"payload" jsonb
);
--> statement-breakpoint
CREATE TABLE "mentor_assignment" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"youth_member_id" text NOT NULL,
	"mentor_member_id" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "mentorship_session" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"assignment_id" text NOT NULL,
	"session_number" integer NOT NULL,
	"scheduled_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"meeting_url" text,
	"notes" text,
	"status" text DEFAULT 'scheduled' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "module_delivery" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"enrollment_id" text NOT NULL,
	"module_id" text NOT NULL,
	"program_member_id" text NOT NULL,
	"recipient_email" text NOT NULL,
	"access_token" text NOT NULL,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"scheduled_for" timestamp with time zone NOT NULL,
	"sent_at" timestamp with time zone,
	"opened_at" timestamp with time zone,
	"clicked_at" timestamp with time zone,
	"assignment_started_at" timestamp with time zone,
	"assignment_submitted_at" timestamp with time zone,
	"failed_at" timestamp with time zone,
	"error" text,
	"payload" jsonb
);
--> statement-breakpoint
CREATE TABLE "module_question" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"module_id" text NOT NULL,
	"question_number" integer NOT NULL,
	"prompt" text NOT NULL,
	"response_type" text DEFAULT 'long_text' NOT NULL,
	"is_required" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "module_submission_answer" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"submission_id" text NOT NULL,
	"question_id" text NOT NULL,
	"answer" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "module_submission" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"enrollment_id" text NOT NULL,
	"module_id" text NOT NULL,
	"delivery_id" text NOT NULL,
	"program_member_id" text NOT NULL,
	"status" text DEFAULT 'submitted' NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"payload" jsonb
);
--> statement-breakpoint
CREATE TABLE "opportunity" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"audience" text DEFAULT 'all' NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"url" text,
	"status" text DEFAULT 'published' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_enrollment" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"program_id" text NOT NULL,
	"program_member_id" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"signed_up_at" timestamp with time zone DEFAULT now() NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone,
	"payload" jsonb
);
--> statement-breakpoint
CREATE TABLE "program_member" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"join_application_id" text NOT NULL,
	"user_id" text,
	"role" text NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"status" text DEFAULT 'application_received' NOT NULL,
	"current_step" text DEFAULT 'welcome_email' NOT NULL,
	"mentor_agreement_signed_at" timestamp with time zone,
	"orientation_completed_at" timestamp with time zone,
	"certificate_issued_at" timestamp with time zone,
	"verified_at" timestamp with time zone,
	"login_credentials_sent_at" timestamp with time zone,
	"payload" jsonb
);
--> statement-breakpoint
CREATE TABLE "program_module" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"program_id" text NOT NULL,
	"module_key" text NOT NULL,
	"module_number" integer NOT NULL,
	"week_number" integer NOT NULL,
	"send_offset_days" integer NOT NULL,
	"send_day_label" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"subject" text NOT NULL,
	"preview_text" text,
	"opening_copy" text NOT NULL,
	"scripture_text" text NOT NULL,
	"scripture_reference" text NOT NULL,
	"reflection" text NOT NULL,
	"focus" text NOT NULL,
	"action" text NOT NULL,
	"sort_order" integer NOT NULL,
	"status" text DEFAULT 'published' NOT NULL,
	"payload" jsonb
);
--> statement-breakpoint
CREATE TABLE "program" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"summary" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"starts_after_days" integer DEFAULT 7 NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"payload" jsonb
);
--> statement-breakpoint
CREATE TABLE "project_showcase" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" text,
	"program_member_id" text,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"project_url" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"payload" jsonb
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"name" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"identifier" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_program_member_id_program_member_id_fk" FOREIGN KEY ("program_member_id") REFERENCES "public"."program_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_post" ADD CONSTRAINT "community_post_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_post" ADD CONSTRAINT "community_post_program_member_id_program_member_id_fk" FOREIGN KEY ("program_member_id") REFERENCES "public"."program_member"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_event" ADD CONSTRAINT "email_event_program_member_id_program_member_id_fk" FOREIGN KEY ("program_member_id") REFERENCES "public"."program_member"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_event" ADD CONSTRAINT "email_event_enrollment_id_program_enrollment_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."program_enrollment"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_event" ADD CONSTRAINT "email_event_module_id_program_module_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."program_module"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_event" ADD CONSTRAINT "email_event_delivery_id_module_delivery_id_fk" FOREIGN KEY ("delivery_id") REFERENCES "public"."module_delivery"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "engagement_event" ADD CONSTRAINT "engagement_event_program_member_id_program_member_id_fk" FOREIGN KEY ("program_member_id") REFERENCES "public"."program_member"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "engagement_event" ADD CONSTRAINT "engagement_event_enrollment_id_program_enrollment_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."program_enrollment"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "engagement_event" ADD CONSTRAINT "engagement_event_module_id_program_module_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."program_module"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "engagement_event" ADD CONSTRAINT "engagement_event_delivery_id_module_delivery_id_fk" FOREIGN KEY ("delivery_id") REFERENCES "public"."module_delivery"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "join_application_list_item" ADD CONSTRAINT "join_application_list_item_join_application_id_join_application_id_fk" FOREIGN KEY ("join_application_id") REFERENCES "public"."join_application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "join_application_list_item" ADD CONSTRAINT "join_application_list_item_program_member_id_program_member_id_fk" FOREIGN KEY ("program_member_id") REFERENCES "public"."program_member"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "join_application_list_item" ADD CONSTRAINT "join_application_list_item_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentor_assignment" ADD CONSTRAINT "mentor_assignment_youth_member_id_program_member_id_fk" FOREIGN KEY ("youth_member_id") REFERENCES "public"."program_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentor_assignment" ADD CONSTRAINT "mentor_assignment_mentor_member_id_program_member_id_fk" FOREIGN KEY ("mentor_member_id") REFERENCES "public"."program_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship_session" ADD CONSTRAINT "mentorship_session_assignment_id_mentor_assignment_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."mentor_assignment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_delivery" ADD CONSTRAINT "module_delivery_enrollment_id_program_enrollment_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."program_enrollment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_delivery" ADD CONSTRAINT "module_delivery_module_id_program_module_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."program_module"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_delivery" ADD CONSTRAINT "module_delivery_program_member_id_program_member_id_fk" FOREIGN KEY ("program_member_id") REFERENCES "public"."program_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_question" ADD CONSTRAINT "module_question_module_id_program_module_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."program_module"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_submission_answer" ADD CONSTRAINT "module_submission_answer_submission_id_module_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."module_submission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_submission_answer" ADD CONSTRAINT "module_submission_answer_question_id_module_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."module_question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_submission" ADD CONSTRAINT "module_submission_enrollment_id_program_enrollment_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."program_enrollment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_submission" ADD CONSTRAINT "module_submission_module_id_program_module_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."program_module"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_submission" ADD CONSTRAINT "module_submission_delivery_id_module_delivery_id_fk" FOREIGN KEY ("delivery_id") REFERENCES "public"."module_delivery"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_submission" ADD CONSTRAINT "module_submission_program_member_id_program_member_id_fk" FOREIGN KEY ("program_member_id") REFERENCES "public"."program_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_enrollment" ADD CONSTRAINT "program_enrollment_program_id_program_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."program"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_enrollment" ADD CONSTRAINT "program_enrollment_program_member_id_program_member_id_fk" FOREIGN KEY ("program_member_id") REFERENCES "public"."program_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_member" ADD CONSTRAINT "program_member_join_application_id_join_application_id_fk" FOREIGN KEY ("join_application_id") REFERENCES "public"."join_application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_member" ADD CONSTRAINT "program_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_module" ADD CONSTRAINT "program_module_program_id_program_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."program"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_showcase" ADD CONSTRAINT "project_showcase_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_showcase" ADD CONSTRAINT "project_showcase_program_member_id_program_member_id_fk" FOREIGN KEY ("program_member_id") REFERENCES "public"."program_member"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "account_provider_account_idx" ON "account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "certificate_number_idx" ON "certificate" USING btree ("certificate_number");--> statement-breakpoint
CREATE INDEX "certificate_member_idx" ON "certificate" USING btree ("program_member_id");--> statement-breakpoint
CREATE INDEX "community_event_audience_idx" ON "community_event" USING btree ("audience");--> statement-breakpoint
CREATE INDEX "community_event_starts_at_idx" ON "community_event" USING btree ("starts_at");--> statement-breakpoint
CREATE INDEX "community_event_status_idx" ON "community_event" USING btree ("status");--> statement-breakpoint
CREATE INDEX "community_post_user_idx" ON "community_post" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "community_post_member_idx" ON "community_post" USING btree ("program_member_id");--> statement-breakpoint
CREATE INDEX "community_post_channel_idx" ON "community_post" USING btree ("channel");--> statement-breakpoint
CREATE INDEX "community_post_status_idx" ON "community_post" USING btree ("status");--> statement-breakpoint
CREATE INDEX "dashboard_resource_audience_idx" ON "dashboard_resource" USING btree ("audience");--> statement-breakpoint
CREATE INDEX "dashboard_resource_category_idx" ON "dashboard_resource" USING btree ("category");--> statement-breakpoint
CREATE INDEX "dashboard_resource_published_idx" ON "dashboard_resource" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "email_event_member_idx" ON "email_event" USING btree ("program_member_id");--> statement-breakpoint
CREATE INDEX "email_event_enrollment_idx" ON "email_event" USING btree ("enrollment_id");--> statement-breakpoint
CREATE INDEX "email_event_module_idx" ON "email_event" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "email_event_delivery_idx" ON "email_event" USING btree ("delivery_id");--> statement-breakpoint
CREATE INDEX "email_event_recipient_idx" ON "email_event" USING btree ("recipient_email");--> statement-breakpoint
CREATE INDEX "email_event_template_idx" ON "email_event" USING btree ("template_key");--> statement-breakpoint
CREATE INDEX "email_event_status_idx" ON "email_event" USING btree ("status");--> statement-breakpoint
CREATE INDEX "engagement_event_member_idx" ON "engagement_event" USING btree ("program_member_id");--> statement-breakpoint
CREATE INDEX "engagement_event_enrollment_idx" ON "engagement_event" USING btree ("enrollment_id");--> statement-breakpoint
CREATE INDEX "engagement_event_module_idx" ON "engagement_event" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "engagement_event_delivery_idx" ON "engagement_event" USING btree ("delivery_id");--> statement-breakpoint
CREATE INDEX "engagement_event_type_idx" ON "engagement_event" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "join_application_list_created_idx" ON "join_application_list_item" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "join_application_list_status_idx" ON "join_application_list_item" USING btree ("status");--> statement-breakpoint
CREATE INDEX "join_application_list_type_idx" ON "join_application_list_item" USING btree ("application_type");--> statement-breakpoint
CREATE INDEX "join_application_list_member_idx" ON "join_application_list_item" USING btree ("program_member_id");--> statement-breakpoint
CREATE INDEX "join_application_list_user_idx" ON "join_application_list_item" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "join_application_type_idx" ON "join_application" USING btree ("application_type");--> statement-breakpoint
CREATE INDEX "join_application_email_idx" ON "join_application" USING btree ("email");--> statement-breakpoint
CREATE INDEX "join_application_status_idx" ON "join_application" USING btree ("status");--> statement-breakpoint
CREATE INDEX "mentor_assignment_youth_idx" ON "mentor_assignment" USING btree ("youth_member_id");--> statement-breakpoint
CREATE INDEX "mentor_assignment_mentor_idx" ON "mentor_assignment" USING btree ("mentor_member_id");--> statement-breakpoint
CREATE INDEX "mentor_assignment_status_idx" ON "mentor_assignment" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "mentorship_session_assignment_number_idx" ON "mentorship_session" USING btree ("assignment_id","session_number");--> statement-breakpoint
CREATE INDEX "mentorship_session_status_idx" ON "mentorship_session" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "module_delivery_enrollment_module_idx" ON "module_delivery" USING btree ("enrollment_id","module_id");--> statement-breakpoint
CREATE UNIQUE INDEX "module_delivery_access_token_idx" ON "module_delivery" USING btree ("access_token");--> statement-breakpoint
CREATE INDEX "module_delivery_status_idx" ON "module_delivery" USING btree ("status");--> statement-breakpoint
CREATE INDEX "module_delivery_scheduled_for_idx" ON "module_delivery" USING btree ("scheduled_for");--> statement-breakpoint
CREATE INDEX "module_delivery_member_idx" ON "module_delivery" USING btree ("program_member_id");--> statement-breakpoint
CREATE UNIQUE INDEX "module_question_module_number_idx" ON "module_question" USING btree ("module_id","question_number");--> statement-breakpoint
CREATE INDEX "module_question_module_idx" ON "module_question" USING btree ("module_id");--> statement-breakpoint
CREATE UNIQUE INDEX "module_submission_answer_question_idx" ON "module_submission_answer" USING btree ("submission_id","question_id");--> statement-breakpoint
CREATE INDEX "module_submission_answer_submission_idx" ON "module_submission_answer" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "module_submission_enrollment_idx" ON "module_submission" USING btree ("enrollment_id");--> statement-breakpoint
CREATE INDEX "module_submission_module_idx" ON "module_submission" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "module_submission_delivery_idx" ON "module_submission" USING btree ("delivery_id");--> statement-breakpoint
CREATE INDEX "module_submission_member_idx" ON "module_submission" USING btree ("program_member_id");--> statement-breakpoint
CREATE INDEX "opportunity_audience_idx" ON "opportunity" USING btree ("audience");--> statement-breakpoint
CREATE INDEX "opportunity_type_idx" ON "opportunity" USING btree ("type");--> statement-breakpoint
CREATE INDEX "opportunity_status_idx" ON "opportunity" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "program_enrollment_member_program_idx" ON "program_enrollment" USING btree ("program_member_id","program_id");--> statement-breakpoint
CREATE INDEX "program_enrollment_member_idx" ON "program_enrollment" USING btree ("program_member_id");--> statement-breakpoint
CREATE INDEX "program_enrollment_program_idx" ON "program_enrollment" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "program_enrollment_status_idx" ON "program_enrollment" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "program_member_join_application_idx" ON "program_member" USING btree ("join_application_id");--> statement-breakpoint
CREATE INDEX "program_member_user_id_idx" ON "program_member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "program_member_role_idx" ON "program_member" USING btree ("role");--> statement-breakpoint
CREATE INDEX "program_member_status_idx" ON "program_member" USING btree ("status");--> statement-breakpoint
CREATE INDEX "program_member_email_idx" ON "program_member" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "program_module_program_key_idx" ON "program_module" USING btree ("program_id","module_key");--> statement-breakpoint
CREATE UNIQUE INDEX "program_module_program_number_idx" ON "program_module" USING btree ("program_id","module_number");--> statement-breakpoint
CREATE INDEX "program_module_program_idx" ON "program_module" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "program_module_status_idx" ON "program_module" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "program_slug_idx" ON "program" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "program_status_idx" ON "program" USING btree ("status");--> statement-breakpoint
CREATE INDEX "program_active_idx" ON "program" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "project_showcase_user_idx" ON "project_showcase" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "project_showcase_member_idx" ON "project_showcase" USING btree ("program_member_id");--> statement-breakpoint
CREATE INDEX "project_showcase_status_idx" ON "project_showcase" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "session_token_idx" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");