import {
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
} from "drizzle-orm/pg-core";

// Define enum types BEFORE the tables
export const sourceEnum = pgEnum("source", ["pap", "espi"]);

export const company = pgTable("company", {
  id: serial("company_id").primaryKey(),
  name: varchar("name").notNull(),
  ticker: varchar("ticker").unique().notNull(),
  lastUpdate: timestamp("last_update").defaultNow().notNull(),
});

export type CompanyData = typeof company.$inferInsert;
export type Company = typeof company.$inferSelect;

export const companyNameVariation = pgTable("company_name_variation", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id")
    .notNull()
    .references(() => company.id, { onDelete: "cascade" }),
  variation: varchar("variation").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CompanyNameVariationData = typeof companyNameVariation.$inferInsert;
export type CompanyNameVariation = typeof companyNameVariation.$inferSelect;

export const publicInformation = pgTable("public_information", {
  id: serial("public_information_id").primaryKey(),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  source: sourceEnum("source").notNull(),
  type: varchar("type"),
  companyId: integer("company_id")
    .notNull()
    .references(() => company.id, { onDelete: "cascade" }),
  timestamp: timestamp("timestamp").notNull(),
});

export type PublicInformationData = typeof publicInformation.$inferInsert;
export type PublicInformation = typeof publicInformation.$inferSelect;
