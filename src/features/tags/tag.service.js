import { query, getClient } from "../../config/db.js";
import { logActivity } from "../activities/activities.service.js";

export const createTag = async ({ userId, tagName }) => {
  const result = await query(
    `INSERT INTO tags(user_id , tag_name )
        VALUES ($1 ,$2) 
        RETURNING tag_id ,
        user_id ,
        tag_name ,
        created_at `,
    [userId, tagName.trim()],
  );
  return result.rows[0];
};

export const getTagByUser = async (userId) => {
  const result = await query(
    `SELECT 
        tag_id ,
        user_id ,
        tag_name ,
        created_at 
        FROM tags
        WHERE user_id = $1 
        ORDER BY tag_name ASC`,
    [userId],
  );
  return result.rows;
};

export const updateTag = async ({ tagId, userId, tagName }) => {
  const result = await query(
    `UPDATE tags
        SET tag_name = $1 
        WHERE tag_id = $2
        AND user_id = $3
        RETURNING 
        tag_id ,
        user_id ,
        tag_name ,
        created_at`,
    [tagName.trim(), tagId, userId],
  );
  if (result.rows.length === 0) {
    const error = new Error("tag not found");
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
};

export const deleteTag = async ({ tagId, userId }) => {
  const result = await query(
    `DELETE FROM tags 
        WHERE tag_id = $1
        AND user_id = $2
        RETURNING 
        tag_id ,
        user_id ,
        tag_name 
        `,
    [tagId, userId],
  );
  if (result.rows.length === 0) {
    const error = new Error("tag not found");
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
};

export const assignTagsToNote = async ({ noteId, userId, tagIds }) => {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    const noteResult = await client.query(
      `SELECT note_id 
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
    const uniqueTagIds = [...new Set(tagIds)];
    if (uniqueTagIds.length > 0) {
      const verifyTags = await client.query(
        `SELECT tag_id 
        from tags 
        WHERE user_id = $1 
        AND tag_id = ANY($2 :: VARCHAR[])`,
        [userId, uniqueTagIds],
      );
      if (verifyTags.rows.length !== uniqueTagIds.length) {
        const error = new Error(
          "one or more tags do not belong to this user. ",
        );
        error.statusCode = 400;
        throw error;
      }
    }
    await client.query(
      `DELETE FROM note_tags
        WHERE note_id = $1`,
      [noteId],
    );
    for (const tagId of uniqueTagIds) {
      await client.query(
        `INSERT INTO note_tags 
            ( note_id , tag_id )
            VALUES (
            $1 , $2)`,
        [noteId, tagId],
      );
    }
    await logActivity({
      client,
      noteId,
      userId,
      actionType: "TAG_ADD",
      actionDescription: "Updated note tags",
    });
    await client.query("COMMIT");
    return await getTagsByNote({
      noteId,
      userId,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
export const getTagsByNote = async ({ noteId, userId }) => {
  const result = await query(
    `SELECT 
        t.tag_id ,
        t.tag_name
        FROM tags t 
        INNER JOIN note_tags nt 
        ON nt.tag_id = t.tag_id
        INNER JOIN notes n  
        ON n.note_id = nt.note_id
        WHERE 
        n.note_id = $1
        AND n.user_id = $2
        AND n.is_deleted = FALSE 
        ORDER BY t.tag_name`,
    [noteId, userId],
  );
  return result.rows;
};
