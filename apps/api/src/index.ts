import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import companiesRouter from "./routes/companies";
import notificationsRouter from "./routes/notifications";
import { wsManager } from "./websocket";

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/ws/info", (_req, res) => {
  res.json({
    clients: wsManager.getClientCount(),
    message: "WebSocket server is running. Connect to ws://localhost:" + PORT,
  });
});

app.use("/api/companies", companiesRouter);
app.use("/api/notifications", notificationsRouter);

wsManager.initialize(server);

server.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`WebSocket available at ws://localhost:${PORT}`);
});
