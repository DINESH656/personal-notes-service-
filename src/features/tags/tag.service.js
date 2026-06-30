import e from "cors";
import { query, getClient } from "../../config/db.js";
import { logActivity } from "../activities/activities.service.js";

export const createTag = async ({ userId, tagName }) => {
  const client = await getClient();
  try {
    await client.query("BEGIN");
    const normalizedTag = tagName.trim.toLowerCase();
    if (normalizedTag.length > 50) {
      const error = new Error("Tag name cannot exceed 50 characters.");
      error.statusCode = 400;
      throw error;
    }
    const existingTag = await client.query(
      `SELECT tag_id 
    FROM tags
    WHERE user_id = $1
    AND LOWER(tag_name) = $2`,
      [userId, normalizedTag],
    );
    if (existingTag.rows.length > 0) {
      const error = new Error("tags already exists");
      error.statusCode = 409;
      throw error;
    }
    const result = await client.query(
      `INSERT INTO tags(
    user_id ,
    tag_name ,
    ) VALUES($1 , $2)
     RETURNING 
     tag_id ,
     user_id,
     tag_name,
     created_at`,
      [userId, normalizedTag],
    );
    const tag = result.rows[0];
    await logActivity({
      client,
      noteId: null,
      userId,
      actionType: "TAG_CREATE",
      actionDescription: `Created tag '${tag.tag_name}'`,
    });
    await client.query("COMMIT");
    return tag;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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
  const client = await getClient();
  try {
    await client.query("BEGIN");
    const normalizedTag = tagName.trim().toLowerCase();
    if (normalizedTag.length > 50) {
      const error = new Error("Tag name cannot exceed 50 characters.");
      error.statusCode = 400;
      throw error;
    }
    const duplicate = await client.query(
      `SELECT tag_id 
    FROM tags 
    WHERE user_id = $1
    AND LOWER(tag_name) = $2
    AND tag_id <>$3`,
      [userId, normalizedTag, tagId],
    );
    if (duplicate.rows.length > 0) {
      const error = new Error("Tag already exists");
      error.statusCode = 409;
      throw error;
    }

    const result = await client.query(
      `UPDATE tags
        SET tag_name = $1 
        WHERE tag_id = $2
        AND user_id = $3
        RETURNING 
        tag_id ,
        user_id ,
        tag_name ,
        created_at`,
      [normalizedTag, tagId, userId],
    );
    if (result.rows.length === 0) {
      const error = new Error("tag not found");
      error.statusCode = 404;
      throw error;
    }
    const tag = result.rows[0];
    await logActivity({
      client,
      noteId: null,
      userId,
      actionType: "TAG_UPDATE",
      actionDescription: `Update tag to'${tag.tag_name}'`,
    });
    await client.query("COMMIT");
    return tag;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const deleteTag = async ({ tagId, userId }) => {
  const client = await getClient();
  try {
    await client.query("BEGIN");
    const result = await client.query(
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
    const tag = result.rows[0];
    await logActivity({
      client,
      noteId: null,
      userId,
      actionType: "TAG_DELETE",
      actionDescription: `Deleted tag '${tag.tag_name}'`,
    });
    return tag;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const assignTagsToNote = async ({ noteId, userId, tagIds }) => {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    const noteResults = await client.query(
      `SELECT note_id 
      FROM notes
      WHERE note_id = $1
      AND user_id = $2
      AND is_deleted = FALSE`,
      [noteId, userId],
    );
    if (noteResults.rows.length === 0) {
      const error = new Error("note not found");
      error.statusCode = 404;
      throw error;
    }
    const uniqueTagIds = [...new Set(tagIds)];
    if (uniqueTagIds.length > 0) {
      const verifyTags = await client.query(
        `SELECT tag_id 
        FROM tags
        WHERE user_id = $1
        AND tag_id = ANY($2 :: VARCHAR[])`,
        [userId, uniqueTagIds],
      );
      if (verifyTags.rows.length !== uniqueTagIds.length) {
        const error = new Error("Invalid tag selection");
        error.statusCode = 400;
        throw error;
      }
    }
    await client.query(
      `DELETE FROM 
      note_tags
      WHERE note_id = $1`,
      [noteId],
    );
    if (uniqueTagIds.length > 0) {
      await client.query(
        `INSERT INTO note_tags(note_id , tag_id)
        SELECT $1 UNNEST($2 :: VARCHAR[])`,
        [noteId, uniqueTagIds],
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
