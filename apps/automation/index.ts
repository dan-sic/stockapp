import "dotenv/config";
import cron from "node-cron";
import { scrapeStockwatchInfoJob } from "./jobs/scrape-stockwatch-info-job/scrapeStockwatchInfo";

console.log("Starting automation scheduler...\n");

// Schedule: Scrape stockwatch info
// Weekday: Every hour from 08:30-23:30, Monday-Friday (Warsaw time)
const scrapeStockwatchInfoWeekdaySchedule =
  process.env.SCRAP_STOCKWATCH_INFO_SCHEDULE_WEEKDAY || "0 30 8-23 * * 1-5";

// Weekend: 12:00 and 23:00 on Saturday-Sunday (Warsaw time)
const scrapeStockwatchInfoWeekendSchedule =
  process.env.SCRAP_STOCKWATCH_INFO_SCHEDULE_WEEKEND || "0 0 12,23 * * 0,6";

cron.schedule(
  scrapeStockwatchInfoWeekdaySchedule,
  async () => {
    await scrapeStockwatchInfoJob();
  },
  { timezone: "Europe/Warsaw" }
);
console.log(
  `✓ Scheduled: Scrape stockwatch info - Weekdays (${scrapeStockwatchInfoWeekdaySchedule})`
);

cron.schedule(
  scrapeStockwatchInfoWeekendSchedule,
  async () => {
    await scrapeStockwatchInfoJob();
  },
  { timezone: "Europe/Warsaw" }
);
console.log(
  `✓ Scheduled: Scrape stockwatch info - Weekends (${scrapeStockwatchInfoWeekendSchedule})`
);

console.log("\nAll jobs scheduled. Press Ctrl+C to stop.\n");

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("\nReceived SIGTERM, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\nReceived SIGINT, shutting down gracefully...");
  process.exit(0);
});
