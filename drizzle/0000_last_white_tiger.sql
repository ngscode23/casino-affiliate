CREATE TYPE "public"."license" AS ENUM('MGA', 'Curaçao', 'UKGC', 'Other');--> statement-breakpoint
CREATE TYPE "public"."method" AS ENUM('Cards', 'SEPA', 'Crypto', 'Paypal', 'Skrill');--> statement-breakpoint
CREATE TABLE "offer_methods" (
	"offer_id" uuid NOT NULL,
	"method" "method" NOT NULL,
	CONSTRAINT "offer_methods_offer_id_method_pk" PRIMARY KEY("offer_id","method")
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"rating" numeric(2, 1),
	"payout_hours" integer,
	"license" "license" NOT NULL,
	"link" text,
	"enabled" boolean DEFAULT true NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "offers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "offer_methods" ADD CONSTRAINT "offer_methods_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;