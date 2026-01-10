"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWebSocket } from "./WebSocketContext";

export function WebSocketHandler() {
  const { isConnected, subscribe } = useWebSocket();
  const router = useRouter();

  useEffect(() => {
    console.log(
      "[WebSocketHandler] Connection status:",
      isConnected ? "Connected" : "Disconnected"
    );
  }, [isConnected]);

  useEffect(() => {
    // Handler for notification events
    const unsubscribeNotificationCreated = subscribe(
      "notification_created",
      (data) => {
        console.log("[WebSocketHandler] Notification created:", data);
        // Refresh the current route to fetch new data
        router.refresh();
        // Show notification to user or update notification list
        // toast.info(`New notification: ${data.title}`);
      }
    );

    // Global handler for all messages (optional)
    // const unsubscribeAll = subscribe("*", (message) => {
    //   console.log("[WebSocketHandler] Received message:", message);
    //   // You can add logic here that applies to all messages
    // });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeNotificationCreated();
      // unsubscribeAll();
    };
  }, [subscribe, router]);

  // This component doesn't render anything
  return null;
}
