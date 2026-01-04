"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function NotificationListener() {
  const router = useRouter();

  useEffect(() => {
    const eventSource = new EventSource("/api/events");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received:", data);

      if (data.type === "database_update") {
        router.refresh(); // Refresh page data
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [router]);

  return null;
}
