import { notificationEmitter } from "@/lib/eventEmitter";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { path } = await request.json();
  revalidatePath(path);

  notificationEmitter.emit("data_added");

  return Response.json({ revalidated: true });
}
