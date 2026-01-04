"use server";
import { db } from "@stock-app/db";
import {
  company,
  CompanyData,
  publicInformation,
  pushSubscription,
} from "@stock-app/db/schema";
import { revalidatePath } from "next/cache";
import { PushSubscription } from "web-push";

export async function createCompany(data: CompanyData) {
  await db.insert(company).values(data);
}

export async function getCompanies() {
  return await db.select().from(company);
}

export async function getNotifications() {
  return await db.select().from(publicInformation);
}

export async function revalidateNotifications() {
  revalidatePath("/notifications");
}

export async function subscribeUser(sub: PushSubscription) {
  try {
    // Extract the keys from the subscription object
    const p256dh = sub.keys?.p256dh;
    const auth = sub.keys?.auth;

    if (!p256dh || !auth) {
      throw new Error("Invalid subscription keys");
    }

    // Check if subscription already exists and update, or insert new
    await db
      .insert(pushSubscription)
      .values({
        endpoint: sub.endpoint,
        p256dh,
        auth,
      })
      .onConflictDoUpdate({
        target: pushSubscription.endpoint,
        set: {
          p256dh,
          auth,
          updatedAt: new Date(),
        },
      });

    return { success: true };
  } catch (error) {
    console.error("Error saving subscription:", error);
    return { success: false, error: "Failed to save subscription" };
  }
}
