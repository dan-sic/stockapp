ALTER TABLE "public_information" ALTER COLUMN "title" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "public_information" ADD COLUMN "content" text NOT NULL;