import { query } from "../../config/db.js";
import { logActivity } from "../activities/activities.service.js";
import { getClient } from "../../config/db.js";
const NOTE_SELECT_FIELDS = `
note_id ,
user_id ,
title,
content ,
category ,
is_deleted,
deleted_at,
created_at ,
updated_at`;
const NOTE_SELECT_FIELDS_WITH_ALIAS = `
n.note_id,
n.user_id,
n.title,
n.content,
n.category,
n.is_deleted,
n.deleted_at,
n.created_at,
n.updated_at
`;
const SORT_OPTIONS = {
  newest: "updated_at DESC",
  oldest: "updated_at ASC",
  title_asc: "title ASC",
  title_desc: "title DESC",
};

export const createNote = async ({ userId, title, content, category }) => {
  const result = await query(
    `INSERT INTO notes (user_id, title, content , category )
     VALUES ($1, $2, $3,$4)
     RETURNING ${NOTE_SELECT_FIELDS}`,
    [userId, title.trim(), content.trim(), category.trim()],
  );
  const note = result.rows[0];
  await logActivity({
    noteId: note.note_id,
    userId,
    actionType: "CREATE",
    actionDescription: `Created note "${note.title}"`,
  });
  return note;
};
export const getMyNotes = async ({
  userId,
  page = 1,
  limit = 10,
  sortBy = "newest",
  title = null,
  category = null,
  keyword = null,
  tag = null,
  isDeleted = false,
}) => {
  const normalizedTitle = title?.trim() || null;
  const normalizedCategory = category?.trim() || null;
  const normalizedKeyword = keyword?.trim() || null;
  const normalizedTag = tag?.trim().toLowerCase() || null;
  const currentPage = Number(page) > 0 ? Number(page) : 1;
  const perPage = Number(limit) > 0 ? Number(limit) : 10;
  const offset = (currentPage - 1) * perPage;
  const orderByClause = SORT_OPTIONS[sortBy] || SORT_OPTIONS.newest;
  const countResult = await query(
    `SELECT COUNT(DISTINCT n.note_id) :: int AS total
    FROM notes n
    LEFT JOIN note_tags nt
    ON nt.note_id = n.note_id
    LEFT JOIN tags t 
    ON t.tag_id = nt.tag_id
    WHERE 
    n.user_id = $1
    AND n.is_deleted = $2
    AND($3 :: TEXT IS NULL OR n.title ILIKE '%' || $3 || '%')
    AND($4 :: TEXT IS NULL OR n.category ILIKE '%' || $4 || '%')
    AND(
    $5 :: TEXT IS NULL OR n.title ILIKE '%' || $5 || '%'
    OR n.content ILIKE '%' || $5 || '%')
   AND (
   $6 :: TEXT IS NULL OR LOWER(t.tag_name) = $6)
    `,
    [
      userId,
      isDeleted,
      normalizedTitle,
      normalizedCategory,
      normalizedKeyword,
      normalizedTag,
    ],
  );
  const total = countResult.rows[0].total;
  const notesResult = await query(
    `
  SELECT DISTINCT
      n.${NOTE_SELECT_FIELDS_WITH_ALIAS}
  FROM notes n
  LEFT JOIN note_tags nt
      ON nt.note_id = n.note_id
  LEFT JOIN tags t
      ON t.tag_id = nt.tag_id
  WHERE
      n.user_id = $1
      AND n.is_deleted = $2
      AND ($3::TEXT IS NULL OR n.title ILIKE '%' || $3 || '%')
      AND ($4::TEXT IS NULL OR n.category ILIKE '%' || $4 || '%')
      AND (
          $5::TEXT IS NULL
          OR n.title ILIKE '%' || $5 || '%'
          OR n.content ILIKE '%' || $5 || '%'
      )
      AND (
          $6::TEXT IS NULL
          OR LOWER(t.tag_name) = $6
      )
  ORDER BY ${orderByClause}
  LIMIT $7
  OFFSET $8
`,
    [
      userId,
      isDeleted,
      normalizedTitle,
      normalizedCategory,
      normalizedKeyword,
      normalizedTag,
      perPage,
      offset,
    ],
  );
  const totalPages = Math.ceil(total / perPage) || 1;
  return {
    notes: notesResult.rows,
    pagination: {
      total,
      page: currentPage,
      limit: perPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
};

export const getNoteById = async ({ noteId, userId }) => {
  const result = await query(
    `SELECT ${NOTE_SELECT_FIELDS} FROM notes 
    WHERE note_id = $1 AND user_id = $2
    AND is_deleted = FALSE`,
    [noteId, userId],
  );
  if (result.rows.length === 0) {
    const error = new Error("note not found ");
    error.statusCode = 404;
    throw error;
  }
  const note = result.rows[0];
  await logActivity({
    noteId,
    userId,
    actionType: "VIEW",
    actionDescription: `Viewed note '${note.title}'`,
  });
  return note;
};

export const updateNotes = async ({
  noteId,
  userId,
  title,
  content,
  category,
}) => {
  const result = await query(
    `UPDATE notes SET title = $1 ,
    content = $2 ,
    category = $3,
    updated_at = CURRENT_TIMESTAMP 
    WHERE note_id = $4 AND user_id = $5
    AND is_deleted = FALSE
    RETURNING ${NOTE_SELECT_FIELDS} `,
    [title.trim(), content.trim(), category.trim(), noteId, userId],
  );
  if (result.rows.length === 0) {
    const error = new Error("note not found ");
    error.statusCode = 404;
    throw error;
  }
  const note = result.rows[0];
  await logActivity({
    noteId,
    userId,
    actionType: "EDIT",
    actionDescription: `Updated note '${note.title}'`,
  });
  return note;
};
export const SoftDeleteNotes = async ({ noteId, userId }) => {
  const result = await query(
    `UPDATE notes
    SET is_deleted = TRUE ,
    deleted_at = CURRENT_TIMESTAMP ,
    updated_at = CURRENT_TIMESTAMP
    WHERE note_id = $1
    AND user_id = $2 
    AND is_deleted = FALSE
    RETURNING ${NOTE_SELECT_FIELDS}`,
    [noteId, userId],
  );
  if (result.rows.length === 0) {
    const error = new Error("user not found");
    error.statusCode = 404;
    throw error;
  }

  const note = result.rows[0];
  await logActivity({
    noteId,
    userId,
    actionType: "DELETE",
    actionDescription: `DELETED note '${note.title} '`,
  });
  return note;
};

export const restoreNote = async ({ noteId, userId }) => {
  const client = await getClient();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `UPDATE notes 
      SET 
      is_deleted = FALSE , 
      deleted_at = NULL ,
      updated_at = CURRENT_TIMESTAMP
      WHERE 
      note_id = $1 
      AND user_id = $2 
      AND is_deleted = TRUE
      RETURNING *`,
      [noteId, userId],
    );
    if (result.rows.length === 0) {
      const error = new Error("Deleted note not found ");
      error.statusCode = 404;
      throw error;
    }
    const note = result.rows[0];

    await logActivity({
      client,
      noteId,
      userId,
      actionType: "RESTORE",
      actionDescription: `Restored note '${note.title}'`,
    });
    await client.query("COMMIT");
    return note;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
