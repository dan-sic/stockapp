#!/usr/bin/env tsx
import "dotenv/config";
import { scrapeStockwatchInfoJob } from "./scrapeStockwatchInfo";

/**
 * Standalone script to run the scrapeStockwatchInfo job manually
 * Usage: tsx apps/automation/jobs/runScrapeStockwatchInfo.ts
 */
async function main() {
  try {
    console.log("Running scrapeStockwatchInfo job manually...\n");
    await scrapeStockwatchInfoJob();
    console.log("\n✓ Job completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n✗ Job failed:", error);
    process.exit(1);
  }
}

main();
