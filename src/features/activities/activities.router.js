import express from "express";
import { authenticateUser } from "../../middleware/auth.middleware.js";
import { getActivitiesController } from "./activities.controller.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/", getActivitiesController);

export default router;
