import express from "express";
import cors from "cors";
import userRoutes from "./features/users/user.routes.js";
import noteRoutes from "./features/notes/notes.router.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Personal Notes Service API is running",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
