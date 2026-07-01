import {
  uploadAttachment,
  getAttachmentById,
  getAttachments,
  deleteAttachment,
  getAttachmentDownloadUrl,
} from "./attachments.service.js";

export const uploadAttachmentsController = async (req, res, next) => {
  try {
    const attachment = await uploadAttachment({
      noteId: req.params.noteId,
      userId: req.user.id,
      file: req.file,
    });
    return res.status(201).json({
      success: true,
      message: "attachments uploaded successfully ",
      data: attachment,
    });
  } catch (error) {
    next(error);
  }
};

export const getAttachmentsController = async (req, res, next) => {
  try {
    const attachments = await getAttachments({
      noteId: req.params.noteId,
      userId: req.user.id,
    });
    res.json({
      success: true,
      data: attachments,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadAttachmentsController = async (req, res, next) => {
  try {
    const attachment = await getAttachmentDownloadUrl({
      attachmentId: req.params.attachmentId,
      userId: req.user.id,
    });
    res.json({
      success: true,
      data: attachment,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteAttachmentsController = async (req, res, next) => {
  try {
    const result = await deleteAttachment({
      attachmentId: req.params.attachmentId,
      userId: req.user.id,
    });
    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
