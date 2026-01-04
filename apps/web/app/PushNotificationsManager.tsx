"use client";

import { subscribeUser } from "@/lib/actions";
import { useEffect } from "react";
// import { subscribeUser, unsubscribeUser, sendNotification } from './actions'

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const PushNotificationsManager = () => {
  async function subscribeToPush() {
    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);

      if (permission !== "granted") {
        console.error("Notification permission denied");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });
      console.log("Push subscription created:", sub);
      debugger;
      const serializedSub = JSON.parse(JSON.stringify(sub));
      await subscribeUser(serializedSub);
      console.log("User subscribed successfully");

      // Show a test notification to register with macOS
      await registration.showNotification("Notifications Enabled", {
        body: "You'll now receive push notifications",
        icon: "/icon192.png",
        badge: "/icon192.png",
        tag: "welcome-notification",
      });
      console.log("Welcome notification shown");
    } catch (error) {
      console.error("Error subscribing to push:", error);
    }
  }

  useEffect(() => {
    async function registerServiceWorker() {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        console.log("Service worker registered:", registration);
        await subscribeToPush();
      } catch (error) {
        console.error("Error registering service worker:", error);
      }
    }

    // Listen for messages from service worker to play notification sound
    function handleServiceWorkerMessage(event: MessageEvent) {
      if (event.data && event.data.type === "PLAY_NOTIFICATION_SOUND") {
        console.log("Playing notification sound");
        const audio = new Audio("/notification-sound.mp3");
        audio.play().catch((err) => console.error("Error playing sound:", err));
      }
    }

    if ("serviceWorker" in navigator && "PushManager" in window) {
      registerServiceWorker();
      navigator.serviceWorker.addEventListener(
        "message",
        handleServiceWorkerMessage
      );

      return () => {
        navigator.serviceWorker.removeEventListener(
          "message",
          handleServiceWorkerMessage
        );
      };
    }
  }, []);

  return null;
};
