import { notificationEmitter } from "@/lib/eventEmitter";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`)
      );

      const onDataAdded = () => {
        const message = {
          type: "database_update",
        };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(message)}\n\n`)
        );
      };

      notificationEmitter.on("data_added", onDataAdded);

      // Cleanup on disconnect
      request.signal.addEventListener("abort", () => {
        notificationEmitter.off("data_added", onDataAdded);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
