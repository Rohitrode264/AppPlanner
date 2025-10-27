import express, { type Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import { schedulePendingReminders } from "./utils/scheduler.js";

dotenv.config();
connectDB();

const app: Application = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await schedulePendingReminders();
});
