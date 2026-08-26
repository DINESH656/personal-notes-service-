import { query, getClient } from "../../config/db.js";
import { logActivity } from "../activities/activities.service.js";
import crypto from "crypto";
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
  const client = await getClient();
  let uploadedFile;
  try {
    await client.query("BEGIN");
    uploadedFile = await uploadFile(file, userId, noteId);

    const result = await client.query(
      `INSERT INTO attachments(
        attachment_id,
        note_id,
          user_id,
          original_file_name,
          stored_file_name,
          file_type,
          file_size,
          storage_bucket,
          storage_path
        )VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9
        ) RETURNING ${ATTACHMENT_SELECT_FIELDS}`,
      [
        `attachment_${crypto.randomUUID()}`,
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
    await logActivity({
      client,
      noteId,
      userId,
      actionType: "ATTACHMENT_ADD",
      actionDescription: `Uploaded attachment "${uploadedFile.originalFileName}"`,
    });
    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    if (uploadedFile) {
      try {
        await deleteFile(uploadedFile.storagePath);
      } catch (deleteError) {
        console.error(
          "failed to remove uploaded file after the rollback: ",
          deleteError.message,
        );
      }
    }
    throw error;
  } finally {
    client.release();
  }
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
    const error = new Error("Attachment not found");
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
  const signedUrl = await generateSignedUrl(attachment.storage_path);
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
  await deleteFile(attachment.storage_path);
  await query(`DELETE FROM attachments WHERE attachment_id = $1`, [
    attachmentId,
  ]);
  return {
    message: "Attachments deleted successfully ",
  };
};
