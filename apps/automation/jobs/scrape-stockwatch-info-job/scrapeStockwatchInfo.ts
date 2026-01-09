import * as cheerio from "cheerio";
import {
  getLastScrapedTimestamp,
  updateJobMetadata,
  recordJobRun,
} from "@stock-app/db/jobMetadata";
import {
  getObservedCompanyNames,
  getCompanyByName,
} from "@stock-app/db/companies";
import { db } from "@stock-app/db";
import { publicInformation } from "@stock-app/db/schema";

const JOB_NAME = "scrapeStockwatchInfo";

interface ScrapedRecord {
  companyName: string;
  date: string;
  title: string;
  content: string;
}

/**
 * Parses a date string from stockwatch.pl format (YYYY-MM-DD HH:mm) to a Date object
 */
function parseStockwatchDate(dateStr: string): Date {
  // Format: "2026-01-07 13:06"
  const [datePart, timePart] = dateStr.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

/**
 * Fetches the list page and scrapes records added since the last scrape
 * @param sinceTimestamp - Only scrape records newer than this timestamp
 * @param observedCompanies - Set of observed company names to filter by
 */
async function scrapeListPage(
  sinceTimestamp?: Date,
  observedCompanies?: Set<string>
): Promise<
  Array<{
    companyName: string;
    date: string;
    title: string;
    detailUrl: string;
  }>
> {
  const listUrl =
    "https://www.stockwatch.pl/komunikaty-spolek/wszystkie.aspx?page=0&type=&c=&t=Wszystkie";

  console.log(`Fetching list page: ${listUrl}`);
  const response = await fetch(listUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch list page: ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const records: Array<{
    companyName: string;
    date: string;
    title: string;
    detailUrl: string;
  }> = [];

  // Find all rows in the msgTable
  $("#msgTable tbody tr").each((_, row) => {
    const $row = $(row);

    // Extract data from columns
    const companyName = $row.find("td").eq(0).find("strong a").text().trim();
    const dateText = $row.find("td").eq(3).text().trim(); // Data Publikacji column
    const titleElement = $row.find("td").eq(4).find("a");
    const title = titleElement.text().trim();
    const detailUrl = titleElement.attr("href");

    // Parse the record timestamp
    if (dateText && companyName && title && detailUrl) {
      const recordTimestamp = parseStockwatchDate(dateText);

      // Filter by timestamp
      const isNewRecord = !sinceTimestamp || recordTimestamp > sinceTimestamp;

      // Filter by observed companies (if filter is provided)
      const isObservedCompany =
        !observedCompanies || observedCompanies.has(companyName);

      // Only include records that pass both filters
      if (isNewRecord) {
        // if (isNewRecord && isObservedCompany) {
        records.push({
          companyName,
          date: dateText,
          title,
          detailUrl: `https://www.stockwatch.pl${detailUrl}`,
        });
      }
    }
  });

  const sinceInfo = sinceTimestamp
    ? `since ${sinceTimestamp.toISOString()}`
    : "all records";
  const filterInfo = observedCompanies
    ? `for ${observedCompanies.size} observed companies`
    : "no company filter";
  console.log(`Found ${records.length} records (${sinceInfo}, ${filterInfo})`);
  return records;
}

/**
 * Scrapes the detail page to extract the content from the first table.content_espi element
 */
async function scrapeDetailPage(url: string): Promise<string> {
  console.log(`Fetching detail page: ${url}`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch detail page: ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Find the first table.content_espi element and get its HTML
  const article = $("article").first();

  // Return the outer HTML of the table
  return $.html(article);
}

/**
 * Main job function that scrapes all records added since the last run
 * Uses the job_metadata table to track the last scraped timestamp
 */
export async function scrapeStockwatchInfoJob(): Promise<ScrapedRecord[]> {
  try {
    console.log(
      `[${new Date().toISOString()}] Starting scrapeStockwatchInfoJob`
    );

    // Record that the job is starting
    await recordJobRun(JOB_NAME);

    // Step 1: Get the list of observed companies from the database
    const observedCompanyNames = await getObservedCompanyNames();
    const observedCompaniesSet = new Set(observedCompanyNames);
    // console.log(
    //   `Observing ${observedCompanyNames.length} companies: ${
    //     observedCompanyNames.join(", ") || "none"
    //   }`
    // );

    // If no companies are observed, skip scraping
    // if (observedCompanyNames.length === 0) {
    //   console.log(
    //     "No companies are marked as observed. Skipping scraping. Mark companies as observed in the database to enable scraping."
    //   );
    //   return [];
    // }

    // Step 2: Get the last scraped timestamp from the database
    const lastScrapedTimestamp = await getLastScrapedTimestamp(JOB_NAME);
    console.log(
      `Last scraped timestamp: ${
        lastScrapedTimestamp?.toISOString() || "never (first run)"
      }`
    );

    // Step 3: Scrape the list page (only records newer than last scrape and for observed companies)
    const listRecords = await scrapeListPage(
      lastScrapedTimestamp || undefined,
      observedCompaniesSet
    );

    if (listRecords.length === 0) {
      console.log("No new records to scrape.");
      return [];
    }

    // Step 3: Scrape each detail page and insert into database
    const results: ScrapedRecord[] = [];
    let mostRecentTimestamp: Date | null = null;
    let insertedCount = 0;

    for (const record of listRecords) {
      try {
        const content = await scrapeDetailPage(record.detailUrl);
        const recordTimestamp = parseStockwatchDate(record.date);

        // Look up the company in the database
        const company = await getCompanyByName(record.companyName);

        if (!company) {
          console.warn(
            `⚠ Company "${record.companyName}" not found in database. Skipping record.`
          );
          continue;
        }

        // Insert into public_information table
        await db.insert(publicInformation).values({
          title: record.title,
          content: content,
          source: "espi",
          type: "espi",
          companyId: company.id,
          timestamp: recordTimestamp,
        });

        insertedCount++;
        results.push({
          companyName: record.companyName,
          date: record.date,
          title: record.title,
          content,
        });

        // Track the most recent timestamp
        if (!mostRecentTimestamp || recordTimestamp > mostRecentTimestamp) {
          mostRecentTimestamp = recordTimestamp;
        }

        console.log(
          `✓ Inserted: ${record.companyName} - ${record.title.substring(
            0,
            50
          )}...`
        );

        // Add a small delay to avoid overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error processing record for ${record.title}:`, error);
        // Continue with other records even if one fails
      }
    }

    const webServiceUrl =
      process.env.WEB_SERVICE_URL || "https://localhost:3000";
    try {
      console.log("revalidating notifications");

      await fetch(`${webServiceUrl}/api/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/notifications" }),
      });
    } catch (error) {
      console.error(`Error revalidating notifications: `, error);
    }

    try {
      console.log("sending push notifications");

      await fetch(`${webServiceUrl}/api/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notifications: results.map((r) => ({
            title: r.companyName,
            body: r.title,
          })),
        }),
      });
    } catch (error) {
      console.error(`Error sending notifications: `, error);
    }

    // Step 4: Update the job metadata with the most recent timestamp
    if (mostRecentTimestamp) {
      await updateJobMetadata(JOB_NAME, mostRecentTimestamp, {
        recordsScraped: listRecords.length,
        recordsInserted: insertedCount,
        lastRun: new Date().toISOString(),
      });
      console.log(
        `Updated last scraped timestamp to: ${mostRecentTimestamp.toISOString()}`
      );
    }

    console.log(
      `[${new Date().toISOString()}] Scraping completed. Total records found: ${
        listRecords.length
      }, inserted: ${insertedCount}`
    );

    console.log(
      `\n✓ Success! Inserted ${insertedCount} records into database.`
    );
    return results;
  } catch (error) {
    console.error("✗ Error in scrapeStockwatchInfoJob:", error);
    throw error;
  }
}
