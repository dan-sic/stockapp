import {
  serial,
  text,
  timestamp,
  varchar,
  integer,
  pgSchema,
} from "drizzle-orm/pg-core";

// Create the stockapp schema
export const stockappSchema = pgSchema("stockapp");

// Define enum types BEFORE the tables
export const sourceEnum = stockappSchema.enum("source", ["pap", "espi"]);

export const company = stockappSchema.table("company", {
  id: serial("company_id").primaryKey(),
  name: varchar("name").notNull(),
  ticker: varchar("ticker").unique().notNull(),
  lastUpdate: timestamp("last_update").defaultNow().notNull(),
});

export type CompanyData = typeof company.$inferInsert;
export type Company = typeof company.$inferSelect;

export const companyNameVariation = stockappSchema.table("company_name_variation", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id")
    .notNull()
    .references(() => company.id, { onDelete: "cascade" }),
  variation: varchar("variation").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CompanyNameVariationData = typeof companyNameVariation.$inferInsert;
export type CompanyNameVariation = typeof companyNameVariation.$inferSelect;

export const publicInformation = stockappSchema.table("public_information", {
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

export const pushSubscription = stockappSchema.table("push_subscription", {
  id: serial("id").primaryKey(),
  endpoint: text("endpoint").notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type PushSubscriptionData = typeof pushSubscription.$inferInsert;
export type PushSubscription = typeof pushSubscription.$inferSelect;
