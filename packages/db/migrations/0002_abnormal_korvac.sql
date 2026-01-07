CREATE TABLE "stockapp"."job_metadata" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_name" varchar NOT NULL,
	"last_run_at" timestamp NOT NULL,
	"last_success_at" timestamp,
	"last_scraped_timestamp" timestamp,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "job_metadata_job_name_unique" UNIQUE("job_name")
);
