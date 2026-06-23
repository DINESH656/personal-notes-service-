import express from "express";
import { authenticateUser } from "../../middleware/auth.middleware.js";
import {
  createNoteController,
 getMyNotesById,
 updateNotesController,
  getMyNotesController,
} from "./notes.controller.js";

const router = express.Router();

router.use(authenticateUser);

router.post("/", createNoteController);
router.get("/", getMyNotesController);
router.get("/:id", getMyNotesById);
router.put("/:id", updateNotesController);

export default router;
