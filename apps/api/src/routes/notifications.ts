import { Router } from "express";
import { db } from "../db/db";
import { company, publicInformation } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { wsManager } from "../websocket";

const router = Router();

const createNotificationSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  source: z.enum(["pap", "espi"]),
  type: z.string().optional(),
  companyId: z.number().int().positive(),
  timestamp: z.string().datetime(),
});

const updateNotificationSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  source: z.enum(["pap", "espi"]).optional(),
  type: z.string().optional(),
  companyId: z.number().int().positive().optional(),
  timestamp: z.string().datetime().optional(),
});

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const notifications = await db
      .select({
        id: publicInformation.id,
        title: publicInformation.title,
        content: publicInformation.content,
        source: publicInformation.source,
        type: publicInformation.type,
        companyId: publicInformation.companyId,
        timestamp: publicInformation.timestamp,
        companyName: company.name,
        companyTicker: company.ticker,
      })
      .from(publicInformation)
      .innerJoin(company, eq(publicInformation.companyId, company.id))
      .orderBy(desc(publicInformation.timestamp))
      .limit(limit)
      .offset(offset);

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.get("/company/:companyId", async (req, res) => {
  try {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) {
      return res.status(400).json({ error: "Invalid company ID" });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const notifications = await db
      .select()
      .from(publicInformation)
      .where(eq(publicInformation.companyId, companyId))
      .orderBy(desc(publicInformation.timestamp))
      .limit(limit)
      .offset(offset);

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching company notifications:", error);
    res.status(500).json({ error: "Failed to fetch company notifications" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid notification ID" });
    }

    const result = await db
      .select()
      .from(publicInformation)
      .where(eq(publicInformation.id, id))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({ error: "Failed to fetch notification" });
  }
});

router.post("/", async (req, res) => {
  try {
    const validated = createNotificationSchema.parse(req.body);

    const result = await db
      .insert(publicInformation)
      .values({
        title: validated.title,
        content: validated.content,
        source: validated.source,
        type: validated.type || null,
        companyId: validated.companyId,
        timestamp: new Date(validated.timestamp),
      })
      .returning();

    wsManager.broadcast({
      type: "notification_created",
      data: result[0],
    });

    res.status(201).json(result[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid notification ID" });
    }

    const validated = updateNotificationSchema.parse(req.body);

    if (Object.keys(validated).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const updateData: any = { ...validated };
    if (validated.timestamp) {
      updateData.timestamp = new Date(validated.timestamp);
    }

    const result = await db
      .update(publicInformation)
      .set(updateData)
      .where(eq(publicInformation.id, id))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(result[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error updating notification:", error);
    res.status(500).json({ error: "Failed to update notification" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid notification ID" });
    }

    const result = await db
      .delete(publicInformation)
      .where(eq(publicInformation.id, id))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    wsManager.broadcast({
      type: "notification_deleted",
      data: result[0],
    });

    res.json({
      message: "Notification deleted successfully",
      notification: result[0],
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

export default router;
