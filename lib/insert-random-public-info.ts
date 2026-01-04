import "dotenv/config";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "./db";
import { publicInformation } from "../db/schema";

const htmlSamples = [
  "<p>The company has announced a new product line that will revolutionize the market. <strong>Expected launch: Q2 2026</strong></p>",
  "<div><h2>Quarterly Results</h2><p>Revenue increased by <em>15%</em> compared to last quarter. Operating margins improved significantly.</p></div>",
  "<article><h3>Partnership Announcement</h3><p>We are excited to partner with leading technology providers to expand our reach in emerging markets.</p></article>",
  "<section><p>The board of directors has approved a <strong>dividend of $0.50 per share</strong>, payable on March 15, 2026.</p></section>",
  "<p>New manufacturing facility opens in <strong>Austin, Texas</strong>, creating 500 new jobs. <a href='#'>Learn more</a></p>",
  "<div><h4>Innovation Update</h4><ul><li>AI-powered analytics platform</li><li>Cloud infrastructure expansion</li><li>Mobile app redesign</li></ul></div>",
  "<p>CEO statement: <blockquote>We remain committed to delivering exceptional value to our shareholders through innovation and operational excellence.</blockquote></p>",
  "<article><p>Sustainability report shows <strong>30% reduction</strong> in carbon emissions year-over-year. New renewable energy initiatives launched.</p></article>",
  "<section><h3>Market Expansion</h3><p>Entering three new international markets this year: <em>Germany, Japan, and Brazil</em>.</p></section>",
  "<p>R&D investment increased to <strong>$100M annually</strong>. Focus areas include machine learning, IoT, and advanced materials.</p>",
];

const titles = [
  "New Product Launch Announcement",
  "Quarterly Financial Results",
  "Strategic Partnership Formed",
  "Dividend Declaration",
  "Facility Expansion News",
  "Innovation Milestone Achieved",
  "CEO Statement on Performance",
  "Sustainability Report Released",
  "International Market Expansion",
  "R&D Investment Update",
];

const sources = ["pap", "espi"];
const types = [
  "announcement",
  "financial",
  "partnership",
  "dividend",
  "expansion",
  "innovation",
];

function getRandomElement(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

async function insertRandomPublicInfo() {
  try {
    const newInfo = {
      companyId: 1,
      title: getRandomElement(titles),
      content: getRandomElement(htmlSamples),
      source: getRandomElement(sources),
      type: getRandomElement(types),
      timestamp: new Date(),
    };

    await db.insert(publicInformation).values(newInfo);

    await fetch("https://localhost:3000/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/notifications" }),
    });

    console.log(`[${new Date().toISOString()}] Inserted: ${newInfo.title}`);
  } catch (error) {
    console.error("Error inserting public information:", error);
  }
}

async function main() {
  console.log("Starting random public information insertion script...");
  console.log(
    "Inserting a new record every 10 seconds. Press Ctrl+C to stop.\n"
  );

  // Insert first record immediately
  await insertRandomPublicInfo();

  // Then insert every 10 seconds
  setInterval(insertRandomPublicInfo, 30000);
}

main();
