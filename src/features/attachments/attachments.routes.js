import express from "express";

import authenticateUser from "../../middleware/auth.middleware.js";

import upload from "../../middleware/upload.middleware.js";

import {
  uploadAttachmentsController,
  getAttachmentsController,
  downloadAttachmentsController,
  deleteAttachmentsController,
} from "./attachments.controller.js";

const router = express.Router();
router.use(authenticateUser);
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Attachments router working",
  });
});
router.post(
  "/notes/:noteId/attachments",
  upload.single("attachment"),
  uploadAttachmentsController,
);
router.get("/notes/:noteId/attachments", getAttachmentsController);
router.get("/:attachmentId/download", downloadAttachmentsController);
router.delete("/:attachmentId", deleteAttachmentsController);

export default router;
