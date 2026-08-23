CREATE TABLE "bulk_email_campaign_attachment" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"campaign_id" text NOT NULL,
	"filename" text NOT NULL,
	"content_type" text,
	"content_base64" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"payload" jsonb
);
--> statement-breakpoint
CREATE TABLE "bulk_email_campaign_recipient" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"campaign_id" text NOT NULL,
	"program_member_id" text,
	"join_application_id" text,
	"recipient_name" text NOT NULL,
	"recipient_email" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"sent_at" timestamp with time zone,
	"provider_id" text,
	"error" text,
	"payload" jsonb
);
--> statement-breakpoint
CREATE TABLE "bulk_email_campaign" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_user_id" text,
	"title" text NOT NULL,
	"subject" text NOT NULL,
	"body_html" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"audience_type" text DEFAULT 'custom' NOT NULL,
	"audience_label" text,
	"recipient_query" jsonb,
	"scheduled_for" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"sender_label" text,
	"reply_to" text,
	"recipient_count" integer DEFAULT 0 NOT NULL,
	"sent_count" integer DEFAULT 0 NOT NULL,
	"failed_count" integer DEFAULT 0 NOT NULL,
	"skipped_count" integer DEFAULT 0 NOT NULL,
	"payload" jsonb
);
--> statement-breakpoint
CREATE TABLE "workbook_module" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"workbook_program_id" text NOT NULL,
	"module_key" text NOT NULL,
	"module_number" integer NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"summary" text,
	"content_html" text DEFAULT '' NOT NULL,
	"sort_order" integer NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"payload" jsonb
);
--> statement-breakpoint
CREATE TABLE "workbook_program" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"summary" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"payload" jsonb
);
--> statement-breakpoint
CREATE TABLE "workbook_question" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"workbook_module_id" text NOT NULL,
	"question_number" integer NOT NULL,
	"prompt" text NOT NULL,
	"response_type" text DEFAULT 'long_text' NOT NULL,
	"is_required" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workbook_submission_answer" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"submission_id" text NOT NULL,
	"question_id" text NOT NULL,
	"answer" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workbook_submission" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"workbook_program_id" text NOT NULL,
	"workbook_module_id" text NOT NULL,
	"program_member_id" text NOT NULL,
	"status" text DEFAULT 'submitted' NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"payload" jsonb
);
--> statement-breakpoint
ALTER TABLE "email_event" ADD COLUMN "bulk_email_campaign_id" text;--> statement-breakpoint
ALTER TABLE "bulk_email_campaign_attachment" ADD CONSTRAINT "bulk_email_campaign_attachment_campaign_id_bulk_email_campaign_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."bulk_email_campaign"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bulk_email_campaign_recipient" ADD CONSTRAINT "bulk_email_campaign_recipient_campaign_id_bulk_email_campaign_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."bulk_email_campaign"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bulk_email_campaign_recipient" ADD CONSTRAINT "bulk_email_campaign_recipient_program_member_id_program_member_id_fk" FOREIGN KEY ("program_member_id") REFERENCES "public"."program_member"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bulk_email_campaign_recipient" ADD CONSTRAINT "bulk_email_campaign_recipient_join_application_id_join_application_id_fk" FOREIGN KEY ("join_application_id") REFERENCES "public"."join_application"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bulk_email_campaign" ADD CONSTRAINT "bulk_email_campaign_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workbook_module" ADD CONSTRAINT "workbook_module_workbook_program_id_workbook_program_id_fk" FOREIGN KEY ("workbook_program_id") REFERENCES "public"."workbook_program"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workbook_question" ADD CONSTRAINT "workbook_question_workbook_module_id_workbook_module_id_fk" FOREIGN KEY ("workbook_module_id") REFERENCES "public"."workbook_module"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workbook_submission_answer" ADD CONSTRAINT "workbook_submission_answer_submission_id_workbook_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."workbook_submission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workbook_submission_answer" ADD CONSTRAINT "workbook_submission_answer_question_id_workbook_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."workbook_question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workbook_submission" ADD CONSTRAINT "workbook_submission_workbook_program_id_workbook_program_id_fk" FOREIGN KEY ("workbook_program_id") REFERENCES "public"."workbook_program"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workbook_submission" ADD CONSTRAINT "workbook_submission_workbook_module_id_workbook_module_id_fk" FOREIGN KEY ("workbook_module_id") REFERENCES "public"."workbook_module"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workbook_submission" ADD CONSTRAINT "workbook_submission_program_member_id_program_member_id_fk" FOREIGN KEY ("program_member_id") REFERENCES "public"."program_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bulk_email_campaign_attachment_campaign_idx" ON "bulk_email_campaign_attachment" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "bulk_email_campaign_recipient_campaign_idx" ON "bulk_email_campaign_recipient" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "bulk_email_campaign_recipient_email_idx" ON "bulk_email_campaign_recipient" USING btree ("recipient_email");--> statement-breakpoint
CREATE INDEX "bulk_email_campaign_recipient_status_idx" ON "bulk_email_campaign_recipient" USING btree ("status");--> statement-breakpoint
CREATE INDEX "bulk_email_campaign_recipient_member_idx" ON "bulk_email_campaign_recipient" USING btree ("program_member_id");--> statement-breakpoint
CREATE INDEX "bulk_email_campaign_status_idx" ON "bulk_email_campaign" USING btree ("status");--> statement-breakpoint
CREATE INDEX "bulk_email_campaign_audience_idx" ON "bulk_email_campaign" USING btree ("audience_type");--> statement-breakpoint
CREATE INDEX "bulk_email_campaign_scheduled_for_idx" ON "bulk_email_campaign" USING btree ("scheduled_for");--> statement-breakpoint
CREATE INDEX "bulk_email_campaign_created_by_idx" ON "bulk_email_campaign" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "workbook_module_program_key_idx" ON "workbook_module" USING btree ("workbook_program_id","module_key");--> statement-breakpoint
CREATE UNIQUE INDEX "workbook_module_program_number_idx" ON "workbook_module" USING btree ("workbook_program_id","module_number");--> statement-breakpoint
CREATE INDEX "workbook_module_program_idx" ON "workbook_module" USING btree ("workbook_program_id");--> statement-breakpoint
CREATE INDEX "workbook_module_status_idx" ON "workbook_module" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "workbook_program_slug_idx" ON "workbook_program" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "workbook_program_status_idx" ON "workbook_program" USING btree ("status");--> statement-breakpoint
CREATE INDEX "workbook_program_active_idx" ON "workbook_program" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "workbook_question_module_number_idx" ON "workbook_question" USING btree ("workbook_module_id","question_number");--> statement-breakpoint
CREATE INDEX "workbook_question_module_idx" ON "workbook_question" USING btree ("workbook_module_id");--> statement-breakpoint
CREATE UNIQUE INDEX "workbook_submission_answer_question_idx" ON "workbook_submission_answer" USING btree ("submission_id","question_id");--> statement-breakpoint
CREATE INDEX "workbook_submission_answer_submission_idx" ON "workbook_submission_answer" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "workbook_submission_program_idx" ON "workbook_submission" USING btree ("workbook_program_id");--> statement-breakpoint
CREATE INDEX "workbook_submission_module_idx" ON "workbook_submission" USING btree ("workbook_module_id");--> statement-breakpoint
CREATE INDEX "workbook_submission_member_idx" ON "workbook_submission" USING btree ("program_member_id");--> statement-breakpoint
CREATE INDEX "email_event_bulk_campaign_idx" ON "email_event" USING btree ("bulk_email_campaign_id");