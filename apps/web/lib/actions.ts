"use server";
import { db } from "@stock-app/db";
import { company, CompanyData, publicInformation } from "@stock-app/db/schema";
import { revalidatePath } from "next/cache";
import webpush, { PushSubscription } from "web-push";

webpush.setVapidDetails(
  "mailto:daniel.sic@hotmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

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

let subscription: PushSubscription | null = null;

export async function subscribeUser(sub: PushSubscription) {
  subscription = sub;
  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })
  return { success: true };
}

export async function sendNotification(message: string) {
  if (!subscription) {
    console.error("No subscription available");
    throw new Error("No subscription available");
  }

  try {
    console.log("Sending notification to:", subscription.endpoint);
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "New notifications",
        body: message || "You have new updates available",
        icon: "/icon192.png",
      })
    );
    console.log("Notification sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}
