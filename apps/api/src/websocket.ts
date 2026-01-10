import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";

export class WebSocketManager {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();

  initialize(server: Server) {
    this.wss = new WebSocketServer({ server });

    this.wss.on("connection", (ws: WebSocket) => {
      console.log("New WebSocket client connected");
      this.clients.add(ws);

      ws.on("message", (message: Buffer) => {
        console.log("Received message:", message.toString());
      });

      ws.on("close", () => {
        console.log("WebSocket client disconnected");
        this.clients.delete(ws);
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        this.clients.delete(ws);
      });

      ws.send(JSON.stringify({ type: "connected", message: "Connected to API WebSocket" }));
    });

    console.log("WebSocket server initialized");
  }

  broadcast(message: any) {
    const payload = typeof message === "string" ? message : JSON.stringify(message);

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  send(client: WebSocket, message: any) {
    const payload = typeof message === "string" ? message : JSON.stringify(message);

    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }

  getClientCount(): number {
    return this.clients.size;
  }
}

export const wsManager = new WebSocketManager();
