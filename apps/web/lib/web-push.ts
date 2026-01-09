import { db } from "@stock-app/db";
import { pushSubscription } from "@stock-app/db/schema";
import webpush, { PushSubscription } from "web-push";
import { eq } from "drizzle-orm";

webpush.setVapidDetails(
  "mailto:daniel.sic@hotmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendNotification(notification: {
  title: string;
  body: string;
}) {
  try {
    // Fetch all subscriptions from database
    const subscriptions = await db.select().from(pushSubscription);

    if (subscriptions.length === 0) {
      console.error("No subscriptions available");
      throw new Error("No subscriptions available");
    }

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          const pushSubscriptionObject: PushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          };

          console.log("Sending notification to:", sub.endpoint);
          await webpush.sendNotification(
            pushSubscriptionObject,
            JSON.stringify({
              title: notification.title,
              body: notification.body,
              icon: "/app-images/android/android-launchericon-192-192.png",
            })
          );
          console.log("Notification sent successfully to:", sub.endpoint);
        } catch (error) {
          // If subscription is no longer valid (410 Gone), remove it from database
          if (
            error &&
            typeof error === "object" &&
            "statusCode" in error &&
            error.statusCode === 410
          ) {
            console.log("Subscription expired, removing:", sub.endpoint);
            await db
              .delete(pushSubscription)
              .where(eq(pushSubscription.endpoint, sub.endpoint));
          }
          throw error;
        }
      })
    );

    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const failureCount = results.filter((r) => r.status === "rejected").length;

    console.log(
      `Notifications sent: ${successCount} successful, ${failureCount} failed`
    );
  } catch (error) {
    console.error("Error sending push notifications:", error);
  }
}
