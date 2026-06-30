import express from "express";
import { authenticateUser } from "../../middleware/auth.middleware.js";
import {
  createTagController,
  getTagsController,
  updateTagController,
  deleteTagController,
  assignTagsToNoteController,
  getTagsByNoteController,
} from "./tag.controller.js";

const router = express.Router();
router.use(authenticateUser);

router.post("/", createTagController);
router.get("/", getTagsController);
router.put("/note/:noteId", assignTagsToNoteController);
router.get("/note/:noteId", getTagsByNoteController);
router.put("/:id", updateTagController);
router.delete("/:id", deleteTagController);
export default router;
