CREATE TABLE "company" (
	"company_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"ticker" varchar NOT NULL,
	"last_update" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "company_ticker_unique" UNIQUE("ticker")
);
