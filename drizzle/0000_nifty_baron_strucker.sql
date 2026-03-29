CREATE TYPE "public"."post_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."widget_category" AS ENUM('basic', 'advanced', 'premium');--> statement-breakpoint
CREATE TABLE "post" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "post_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"nano_id" varchar(11) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"title" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"creator_id" bigint NOT NULL,
	CONSTRAINT "post_nano_id_unique" UNIQUE("nano_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"nano_id" varchar(11) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"username" varchar(30) NOT NULL,
	"email" varchar(254) NOT NULL,
	CONSTRAINT "user_nano_id_unique" UNIQUE("nano_id"),
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "widget" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "widget_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"nano_id" varchar(11) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"name" varchar(100) NOT NULL,
	"category" "widget_category" DEFAULT 'basic' NOT NULL,
	"amount" integer NOT NULL,
	CONSTRAINT "widget_nano_id_unique" UNIQUE("nano_id")
);
--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "post_creator_id_idx" ON "post" USING btree ("creator_id");--> statement-breakpoint
CREATE UNIQUE INDEX "post_nano_id_idx" ON "post" USING btree ("nano_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_nano_id_idx" ON "user" USING btree ("nano_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_username_idx" ON "user" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "widget_nano_id_idx" ON "widget" USING btree ("nano_id");--> statement-breakpoint
CREATE INDEX "widget_category_idx" ON "widget" USING btree ("category");