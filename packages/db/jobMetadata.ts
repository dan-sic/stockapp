import { db } from "./db";
import { jobMetadata } from "./schema";
import { eq } from "drizzle-orm";

/**
 * Gets the last scraped timestamp for a specific job
 * @param jobName - The unique name of the job
 * @returns The last scraped timestamp, or null if not found
 */
export async function getLastScrapedTimestamp(
  jobName: string
): Promise<Date | null> {
  const result = await db
    .select({
      lastScrapedTimestamp: jobMetadata.lastScrapedTimestamp,
    })
    .from(jobMetadata)
    .where(eq(jobMetadata.jobName, jobName))
    .limit(1);

  return result[0]?.lastScrapedTimestamp || null;
}

/**
 * Updates job metadata after a successful run
 * @param jobName - The unique name of the job
 * @param lastScrapedTimestamp - The timestamp of the most recent record scraped
 * @param additionalMetadata - Optional additional metadata as an object
 */
export async function updateJobMetadata(
  jobName: string,
  lastScrapedTimestamp: Date,
  additionalMetadata?: Record<string, any>
): Promise<void> {
  const now = new Date();

  // Check if job metadata already exists
  const existing = await db
    .select()
    .from(jobMetadata)
    .where(eq(jobMetadata.jobName, jobName))
    .limit(1);

  if (existing.length > 0) {
    // Update existing record
    await db
      .update(jobMetadata)
      .set({
        lastRunAt: now,
        lastSuccessAt: now,
        lastScrapedTimestamp,
        metadata: additionalMetadata ? JSON.stringify(additionalMetadata) : null,
        updatedAt: now,
      })
      .where(eq(jobMetadata.jobName, jobName));
  } else {
    // Insert new record
    await db.insert(jobMetadata).values({
      jobName,
      lastRunAt: now,
      lastSuccessAt: now,
      lastScrapedTimestamp,
      metadata: additionalMetadata ? JSON.stringify(additionalMetadata) : null,
    });
  }
}

/**
 * Records a job run (even if it fails)
 * @param jobName - The unique name of the job
 */
export async function recordJobRun(jobName: string): Promise<void> {
  const now = new Date();

  const existing = await db
    .select()
    .from(jobMetadata)
    .where(eq(jobMetadata.jobName, jobName))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(jobMetadata)
      .set({
        lastRunAt: now,
        updatedAt: now,
      })
      .where(eq(jobMetadata.jobName, jobName));
  } else {
    await db.insert(jobMetadata).values({
      jobName,
      lastRunAt: now,
    });
  }
}

/**
 * Gets all metadata for a specific job
 * @param jobName - The unique name of the job
 */
export async function getJobMetadata(jobName: string) {
  const result = await db
    .select()
    .from(jobMetadata)
    .where(eq(jobMetadata.jobName, jobName))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const meta = result[0];
  return {
    ...meta,
    metadata: meta.metadata ? JSON.parse(meta.metadata) : null,
  };
}
