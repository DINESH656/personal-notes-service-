import { query } from "../../config/db.js";
import { logActivity } from "../activities/activities.service.js";
import {
  uploadFile,
  deleteFile,
  generateSignedUrl,
} from "./storage/supabaseStorage.service.js";

const ATTACHMENT_SELECT_FIELDS = `attachment_id,
 note_id,
 user_id,
 original_file_name,
 stored_file_name,
 file_type,
 file_size,
 storage_bucket,
 storage_path,
 created_at`;

export const uploadAttachment = async ({ noteId, userId, file }) => {
  const noteResult = await query(
    `SELECT note_id , title
    FROM notes
    WHERE note_id = $1
    AND user_id = $2
    AND is_deleted = FALSE`,
    [noteId, userId],
  );

  if (noteResult.rows.length === 0) {
    const error = new Error("note not found");
    error.statusCode = 404;
    throw error;
  }
  const uploadedFile = await uploadFile(file);
  const result = await query(
    `INSERT INTO attachments(
    note_id ,
    user_id,
    original_file_name,
    stored_file_name,
    file_type,
    file_size,
    storage_bucket,
    storage_path)
    VALUES(
    $1 , $2, $3,$4,$5,$6,$7,$8)
    RETURNING ${ATTACHMENT_SELECT_FIELDS}`,
    [
      noteId,
      userId,
      uploadedFile.originalFileName,
      uploadedFile.storedFileName,
      uploadedFile.fileType,
      uploadedFile.fileSize,
      uploadedFile.storageBucket,
      uploadedFile.storagePath,
    ],
  );
  return result.rows[0];
  await logActivity({
    noteId: noteResult.rows[0].note_id,
    userId,
    actionType: "UPLOAD_ATTACHMENT",
    actionDescription: `Uploaded Attachment '${uploadedFile.originalFileName}'`,
  });
};

export const getAttachments = async ({ noteId, userId }) => {
  const result = await query(
    `SELECT ${ATTACHMENT_SELECT_FIELDS}
        FROM attachments
        WHERE note_id = $1
        AND user_id = $2
        ORDER BY created_at DESC`,
    [noteId, userId],
  );
  if (result.rows.length === 0) {
    const error = new Error("note not found");
    error.statusCode = 404;
    throw error;
  }
  return result.rows;
};

export const getAttachmentById = async ({ attachmentId, userId }) => {
  const result = await query(
    `SELECT ${ATTACHMENT_SELECT_FIELDS}
       FROM attachments
       WHERE attachment_id = $1
       AND user_id = $2 `,
    [attachmentId, userId],
  );
  if (result.rows.length === 0) {
    throw (error = new Error("Attachment not found"));
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
};

export const getAttachmentDownloadUrl = async ({ attachmentId, userId }) => {
  const attachment = await getAttachmentById({
    attachmentId,
    userId,
  });
  const signedUrl = await generateSignedUrl(attachment.stored_file_name);
  return {
    attachment,
    signedUrl,
  };
};
export const deleteAttachment = async ({ attachmentId, userId }) => {
  const attachment = await getAttachmentById({
    attachmentId,
    userId,
  });
  await deleteFile(attachment.stored_file_name);
  await query(`DELETE FROM attachments WHERE attachment_id = $1`, [
    attachmentId,
  ]);
  return {
    message: "Attachments deleted successfully ",
  };
};
