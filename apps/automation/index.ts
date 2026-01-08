import "dotenv/config";
import cron from "node-cron";
import { scrapeStockwatchInfoJob } from "./jobs/scrape-stockwatch-info-job/scrapeStockwatchInfo";

console.log("Starting automation scheduler...\n");

// Schedule: Scrape stockwatch info
// Weekday morning/afternoon: Every 5 minutes from 08:30-16:59, Monday-Friday (Warsaw time)
const scrapeStockwatchInfoWeekdayMorningSchedule =
  process.env.SCRAP_STOCKWATCH_INFO_SCHEDULE_WEEKDAY_MORNING ||
  "0 */5 8-16 * * 1-5";

// Weekday evening: Every hour from 17:00-23:00, Monday-Friday (Warsaw time)
const scrapeStockwatchInfoWeekdayEveningSchedule =
  process.env.SCRAP_STOCKWATCH_INFO_SCHEDULE_WEEKDAY_EVENING ||
  "0 0 17-23 * * 1-5";

// Weekend: 12:00 and 23:00 on Saturday-Sunday (Warsaw time)
const scrapeStockwatchInfoWeekendSchedule =
  process.env.SCRAP_STOCKWATCH_INFO_SCHEDULE_WEEKEND || "0 0 12,23 * * 0,6";

cron.schedule(
  scrapeStockwatchInfoWeekdayMorningSchedule,
  async () => {
    await scrapeStockwatchInfoJob();
  },
  { timezone: "Europe/Warsaw" }
);
console.log(
  `✓ Scheduled: Scrape stockwatch info - Weekdays Morning (${scrapeStockwatchInfoWeekdayMorningSchedule})`
);

cron.schedule(
  scrapeStockwatchInfoWeekdayEveningSchedule,
  async () => {
    await scrapeStockwatchInfoJob();
  },
  { timezone: "Europe/Warsaw" }
);
console.log(
  `✓ Scheduled: Scrape stockwatch info - Weekdays Evening (${scrapeStockwatchInfoWeekdayEveningSchedule})`
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
