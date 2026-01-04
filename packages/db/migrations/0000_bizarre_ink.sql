CREATE SCHEMA "stockapp";
--> statement-breakpoint
CREATE TYPE "stockapp"."source" AS ENUM('pap', 'espi');--> statement-breakpoint
CREATE TABLE "stockapp"."company" (
	"company_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"ticker" varchar NOT NULL,
	"last_update" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "company_ticker_unique" UNIQUE("ticker")
);
--> statement-breakpoint
CREATE TABLE "stockapp"."company_name_variation" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_id" integer NOT NULL,
	"variation" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stockapp"."public_information" (
	"public_information_id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"content" text NOT NULL,
	"source" "stockapp"."source" NOT NULL,
	"type" varchar,
	"company_id" integer NOT NULL,
	"timestamp" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stockapp"."company_name_variation" ADD CONSTRAINT "company_name_variation_company_id_company_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "stockapp"."company"("company_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stockapp"."public_information" ADD CONSTRAINT "public_information_company_id_company_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "stockapp"."company"("company_id") ON DELETE cascade ON UPDATE no action;