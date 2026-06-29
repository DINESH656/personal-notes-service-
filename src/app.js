import express from "express";
import cors from "cors";
import userRoutes from "./features/users/user.routes.js";
import noteRoutes from "./features/notes/notes.router.js";
import tagRoutes from "./features/tags/tag.router.js";
import activityRoutes from "./features/activities/activities.router.js";
import dashboardRoutes from "./features/dashboard/dashboard.router.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Personal Knowledge Base API is running",
  });
});

app.use("/api/auth", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
