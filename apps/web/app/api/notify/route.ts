import { sendNotification } from "@/lib/web-push";
import { NextRequest } from "next/server";
import z from "zod";

const notifyPayloadSchema = z.object({
  notifications: z.array(
    z.object({
      title: z.string(),
      body: z.string(),
    })
  ),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const validated = notifyPayloadSchema.parse(body);

    validated.notifications.forEach(({ body, title }) => {
      sendNotification({
        body,
        title,
      });
    });

    return Response.json(
      `Sent ${validated.notifications.length} notifications`
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
    }
    console.error("Error sending notifications:", error);
    return Response.json({ error });
  }
}
