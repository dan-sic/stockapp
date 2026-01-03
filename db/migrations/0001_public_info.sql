CREATE TYPE "public"."source" AS ENUM('pap', 'espi');--> statement-breakpoint
CREATE TABLE "company_name_variation" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_id" integer NOT NULL,
	"variation" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_information" (
	"public_information_id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"source" "source" NOT NULL,
	"type" varchar,
	"company_id" integer NOT NULL,
	"timestamp" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "company_name_variation" ADD CONSTRAINT "company_name_variation_company_id_company_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("company_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public_information" ADD CONSTRAINT "public_information_company_id_company_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("company_id") ON DELETE cascade ON UPDATE no action;