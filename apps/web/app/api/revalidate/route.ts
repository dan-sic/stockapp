import { notificationEmitter } from "@/lib/eventEmitter";
import { sendNotification } from "@/lib/web-push";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { path } = await request.json();
  revalidatePath(path);

  notificationEmitter.emit("data_added");

  sendNotification();

  return Response.json({ revalidated: true });
}
