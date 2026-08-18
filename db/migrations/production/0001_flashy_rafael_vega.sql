CREATE TABLE "training_application_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applications_open_at" timestamp with time zone,
	"applications_close_at" timestamp with time zone,
	"force_closed" boolean DEFAULT false NOT NULL,
	"closed_title" text DEFAULT 'Applications Closed.' NOT NULL,
	"closed_message_html" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE INDEX "training_application_settings_key_idx" ON "training_application_settings" USING btree ("key");