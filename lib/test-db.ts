// scripts/test-db.ts or lib/test-db.ts
import "dotenv/config";
import { db } from "./db";
import { sql } from "drizzle-orm";

async function testConnection() {
  try {
    // Simple query to test connection
    const result = await db.execute(sql`SELECT NOW()`);
    console.log("✓ Database connection successful!");
    console.log("Server time:", result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error("✗ Database connection failed:", error);
    process.exit(1);
  }
}

testConnection();
