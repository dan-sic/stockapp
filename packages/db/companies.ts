import { db } from "./db";
import { company } from "./schema";
import { eq } from "drizzle-orm";

/**
 * Gets all observed company names
 * @returns Array of company names that are marked as observed
 */
export async function getObservedCompanyNames(): Promise<string[]> {
  const result = await db
    .select({
      name: company.name,
    })
    .from(company)
    .where(eq(company.observed, true));

  return result.map((row) => row.name);
}

/**
 * Gets all observed companies (full records)
 * @returns Array of observed company records
 */
export async function getObservedCompanies() {
  return await db.select().from(company).where(eq(company.observed, true));
}

/**
 * Marks a company as observed
 * @param companyId - The ID of the company
 */
export async function setCompanyObserved(
  companyId: number,
  observed: boolean
): Promise<void> {
  await db
    .update(company)
    .set({ observed, lastUpdate: new Date() })
    .where(eq(company.id, companyId));
}

/**
 * Marks a company as observed by name
 * @param companyName - The name of the company
 * @param observed - Whether to observe or unobserve
 */
export async function setCompanyObservedByName(
  companyName: string,
  observed: boolean
): Promise<void> {
  await db
    .update(company)
    .set({ observed, lastUpdate: new Date() })
    .where(eq(company.name, companyName));
}

/**
 * Gets a company by name
 * @param companyName - The name of the company
 */
export async function getCompanyByName(companyName: string) {
  const result = await db
    .select()
    .from(company)
    .where(eq(company.name, companyName))
    .limit(1);

  return result[0] || null;
}
