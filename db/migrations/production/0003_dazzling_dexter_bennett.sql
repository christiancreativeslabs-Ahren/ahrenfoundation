-- CREATE TABLE "blog_post" (
-- 	"id" text PRIMARY KEY NOT NULL,
-- 	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
-- 	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
-- 	"created_by_user_id" text,
-- 	"title" text NOT NULL,
-- 	"slug" text NOT NULL,
-- 	"excerpt" text,
-- 	"content_html" text DEFAULT '' NOT NULL,
-- 	"cover_image_url" text,
-- 	"cover_image_caption" text,
-- 	"status" text DEFAULT 'draft' NOT NULL,
-- 	"published_at" timestamp with time zone,
-- 	"author_name" text
-- );
--> statement-breakpoint
CREATE TABLE "showcase_category" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "showcase_item" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_user_id" text,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"summary" text,
	"body_html" text DEFAULT '' NOT NULL,
	"category_id" text NOT NULL,
	"subcategory_id" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"cover_image_url" text,
	"cover_image_caption" text,
	"creator_name" text,
	"creator_member_id" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "showcase_media" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"item_id" text NOT NULL,
	"media_kind" text NOT NULL,
	"url" text NOT NULL,
	"caption" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"meta" jsonb
);
--> statement-breakpoint
CREATE TABLE "showcase_subcategory" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"category_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
DROP TABLE "workbook_module" CASCADE;--> statement-breakpoint
DROP TABLE "workbook_program" CASCADE;--> statement-breakpoint
DROP TABLE "workbook_question" CASCADE;--> statement-breakpoint
DROP TABLE "workbook_submission_answer" CASCADE;--> statement-breakpoint
DROP TABLE "workbook_submission" CASCADE;--> statement-breakpoint
ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showcase_item" ADD CONSTRAINT "showcase_item_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showcase_item" ADD CONSTRAINT "showcase_item_category_id_showcase_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."showcase_category"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showcase_item" ADD CONSTRAINT "showcase_item_subcategory_id_showcase_subcategory_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."showcase_subcategory"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showcase_item" ADD CONSTRAINT "showcase_item_creator_member_id_program_member_id_fk" FOREIGN KEY ("creator_member_id") REFERENCES "public"."program_member"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showcase_media" ADD CONSTRAINT "showcase_media_item_id_showcase_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."showcase_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "showcase_subcategory" ADD CONSTRAINT "showcase_subcategory_category_id_showcase_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."showcase_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "blog_post_slug_idx" ON "blog_post" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blog_post_status_idx" ON "blog_post" USING btree ("status");--> statement-breakpoint
CREATE INDEX "blog_post_published_at_idx" ON "blog_post" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "blog_post_created_by_user_idx" ON "blog_post" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "showcase_category_slug_idx" ON "showcase_category" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "showcase_category_active_idx" ON "showcase_category" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "showcase_item_slug_idx" ON "showcase_item" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "showcase_item_status_idx" ON "showcase_item" USING btree ("status");--> statement-breakpoint
CREATE INDEX "showcase_item_category_idx" ON "showcase_item" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "showcase_item_subcategory_idx" ON "showcase_item" USING btree ("subcategory_id");--> statement-breakpoint
CREATE INDEX "showcase_item_published_at_idx" ON "showcase_item" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "showcase_media_item_idx" ON "showcase_media" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "showcase_media_kind_idx" ON "showcase_media" USING btree ("media_kind");--> statement-breakpoint
CREATE UNIQUE INDEX "showcase_subcategory_category_slug_idx" ON "showcase_subcategory" USING btree ("category_id","slug");--> statement-breakpoint
CREATE INDEX "showcase_subcategory_category_idx" ON "showcase_subcategory" USING btree ("category_id");