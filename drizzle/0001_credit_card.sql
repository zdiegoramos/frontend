CREATE TYPE "public"."card_brand" AS ENUM('visa', 'mastercard', 'amex', 'discover', 'unknown');--> statement-breakpoint
CREATE TABLE "credit_card" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "credit_card_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"nano_id" varchar(11) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"cardholder_name" varchar(100) NOT NULL,
	"last_four_digits" varchar(4) NOT NULL,
	"expiry_month" integer NOT NULL,
	"expiry_year" integer NOT NULL,
	"brand" "card_brand" DEFAULT 'unknown' NOT NULL,
	CONSTRAINT "credit_card_nano_id_unique" UNIQUE("nano_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "credit_card_nano_id_idx" ON "credit_card" USING btree ("nano_id");