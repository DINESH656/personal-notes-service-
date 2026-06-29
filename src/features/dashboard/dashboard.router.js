import express from "express";
import { authenticateUser } from "../../middleware/auth.middleware.js";
import { getDashboardStatsController } from "./dashboard.controller.js";

const router = express.Router();
router.use(authenticateUser);
router.get("/stats", getDashboardStatsController);
export default router;
