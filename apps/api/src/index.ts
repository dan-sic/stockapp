import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import companiesRouter from "./routes/companies";
import notificationsRouter from "./routes/notifications";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/companies", companiesRouter);
app.use("/api/notifications", notificationsRouter);

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
