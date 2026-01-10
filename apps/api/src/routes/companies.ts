import { Router } from "express";
import { db } from "../db/db";
import { company } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const createCompanySchema = z.object({
  name: z.string().min(1),
  ticker: z.string().min(1),
  observed: z.boolean().optional().default(false),
});

const updateCompanySchema = z.object({
  name: z.string().min(1).optional(),
  ticker: z.string().min(1).optional(),
  observed: z.boolean().optional(),
});

router.get("/", async (req, res) => {
  try {
    const companies = await db.select().from(company);
    res.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

router.get("/observed", async (req, res) => {
  try {
    const observedCompanies = await db
      .select()
      .from(company)
      .where(eq(company.observed, true));
    res.json(observedCompanies);
  } catch (error) {
    console.error("Error fetching observed companies:", error);
    res.status(500).json({ error: "Failed to fetch observed companies" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid company ID" });
    }

    const result = await db
      .select()
      .from(company)
      .where(eq(company.id, id))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Error fetching company:", error);
    res.status(500).json({ error: "Failed to fetch company" });
  }
});

router.post("/", async (req, res) => {
  try {
    const validated = createCompanySchema.parse(req.body);

    const result = await db
      .insert(company)
      .values({
        name: validated.name,
        ticker: validated.ticker,
        observed: validated.observed,
        lastUpdate: new Date(),
      })
      .returning();

    res.status(201).json(result[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating company:", error);
    res.status(500).json({ error: "Failed to create company" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid company ID" });
    }

    const validated = updateCompanySchema.parse(req.body);

    if (Object.keys(validated).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const result = await db
      .update(company)
      .set({
        ...validated,
        lastUpdate: new Date(),
      })
      .where(eq(company.id, id))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json(result[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error updating company:", error);
    res.status(500).json({ error: "Failed to update company" });
  }
});

router.patch("/:id/observe", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid company ID" });
    }

    const { observed } = req.body;
    if (typeof observed !== "boolean") {
      return res.status(400).json({ error: "observed must be a boolean" });
    }

    const result = await db
      .update(company)
      .set({
        observed,
        lastUpdate: new Date(),
      })
      .where(eq(company.id, id))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Error updating company observation status:", error);
    res
      .status(500)
      .json({ error: "Failed to update company observation status" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid company ID" });
    }

    const result = await db
      .delete(company)
      .where(eq(company.id, id))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json({ message: "Company deleted successfully", company: result[0] });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ error: "Failed to delete company" });
  }
});

export default router;
