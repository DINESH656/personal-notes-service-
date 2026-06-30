import { query, getClient } from "../../config/db.js";
import { logActivity } from "../activities/activities.service.js";

const NOTE_SELECT_FIELDS = `
  note_id,
  user_id,
  title,
  content,
  category,
  is_deleted,
  deleted_at,
  created_at,
  updated_at
`;

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
  newest: "n.updated_at DESC",
  oldest: "n.updated_at ASC",
  title_asc: "LOWER(n.title) ASC, n.updated_at DESC",
  title_desc: "LOWER(n.title) DESC, n.updated_at DESC",
};

const buildOrderByClause = ({ sortBy, hasKeyword }) => {
  const requestedSort = SORT_OPTIONS[sortBy] || SORT_OPTIONS.newest;
  if (hasKeyword && sortBy === "newest") {
    return "search_rank DESC, n.updated_at DESC";
  }
  return requestedSort;
};

const normalizePagination = ({ page = 1, limit = 10 }) => {
  const currentPage = Number(page) > 0 ? Number(page) : 1;
  const perPage = Number(limit) > 0 ? Number(limit) : 10;

  return {
    currentPage,
    perPage,
    offset: (currentPage - 1) * perPage,
  };
};

export const createNote = async ({ userId, title, content, category }) => {
  const result = await query(
    `INSERT INTO notes (user_id, title, content, category)
     VALUES ($1, $2, $3, $4)
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

  return { ...note, tags: [] };
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
  const { currentPage, perPage, offset } = normalizePagination({ page, limit });
  const orderByClause = buildOrderByClause({
    sortBy,
    hasKeyword: Boolean(normalizedKeyword),
  });

  const params = [
    userId,
    isDeleted,
    normalizedTitle,
    normalizedCategory,
    normalizedKeyword,
    normalizedTag,
  ];

  const whereClause = `
    n.user_id = $1
    AND n.is_deleted = $2
    AND ($3::TEXT IS NULL OR n.title ILIKE '%' || $3 || '%')
    AND ($4::TEXT IS NULL OR n.category ILIKE '%' || $4 || '%')
    AND (
      $5::TEXT IS NULL
      OR n.search_vector @@ plainto_tsquery('english', $5)
      OR n.title ILIKE '%' || $5 || '%'
      OR n.content ILIKE '%' || $5 || '%'
    )
    AND (
      $6::TEXT IS NULL
      OR EXISTS (
        SELECT 1
        FROM note_tags nt_filter
        INNER JOIN tags t_filter
          ON t_filter.tag_id = nt_filter.tag_id
        WHERE nt_filter.note_id = n.note_id
          AND t_filter.user_id = $1
          AND (
            LOWER(t_filter.tag_name) = $6
            OR LOWER(t_filter.tag_id) = $6
          )
      )
    )
  `;

  const countResult = await query(
    `SELECT COUNT(*)::int AS total
     FROM notes n
     WHERE ${whereClause}`,
    params,
  );

  const notesResult = await query(
    `SELECT
       ${NOTE_SELECT_FIELDS_WITH_ALIAS},
       CASE
         WHEN $5::TEXT IS NULL THEN 0
         ELSE ts_rank_cd(n.search_vector, plainto_tsquery('english', $5))
       END AS search_rank,
       COALESCE(
         json_agg(
           DISTINCT jsonb_build_object(
             'tag_id', t.tag_id,
             'tag_name', t.tag_name
           )
         ) FILTER (WHERE t.tag_id IS NOT NULL),
         '[]'
       ) AS tags
     FROM notes n
     LEFT JOIN note_tags nt
       ON nt.note_id = n.note_id
     LEFT JOIN tags t
       ON t.tag_id = nt.tag_id
     WHERE ${whereClause}
     GROUP BY ${NOTE_SELECT_FIELDS_WITH_ALIAS}, search_rank
     ORDER BY ${orderByClause}
     LIMIT $7
     OFFSET $8`,
    [...params, perPage, offset],
  );

  const total = countResult.rows[0].total;
  const totalPages = Math.max(Math.ceil(total / perPage), 1);

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
    `SELECT
       ${NOTE_SELECT_FIELDS_WITH_ALIAS},
       COALESCE(
         json_agg(
           DISTINCT jsonb_build_object(
             'tag_id', t.tag_id,
             'tag_name', t.tag_name
           )
         ) FILTER (WHERE t.tag_id IS NOT NULL),
         '[]'
       ) AS tags
     FROM notes n
     LEFT JOIN note_tags nt
       ON nt.note_id = n.note_id
     LEFT JOIN tags t
       ON t.tag_id = nt.tag_id
     WHERE n.note_id = $1
       AND n.user_id = $2
       AND n.is_deleted = FALSE
     GROUP BY ${NOTE_SELECT_FIELDS_WITH_ALIAS}`,
    [noteId, userId],
  );

  if (result.rows.length === 0) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  const note = result.rows[0];
  await logActivity({
    noteId,
    userId,
    actionType: "VIEW",
    actionDescription: `Viewed note "${note.title}"`,
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
    `UPDATE notes
     SET title = $1,
         content = $2,
         category = $3,
         updated_at = CURRENT_TIMESTAMP
     WHERE note_id = $4
       AND user_id = $5
       AND is_deleted = FALSE
     RETURNING ${NOTE_SELECT_FIELDS}`,
    [title.trim(), content.trim(), category.trim(), noteId, userId],
  );

  if (result.rows.length === 0) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  const note = result.rows[0];
  await logActivity({
    noteId,
    userId,
    actionType: "EDIT",
    actionDescription: `Updated note "${note.title}"`,
  });

  return note;
};

export const SoftDeleteNotes = async ({ noteId, userId }) => {
  const result = await query(
    `UPDATE notes
     SET is_deleted = TRUE,
         deleted_at = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP
     WHERE note_id = $1
       AND user_id = $2
       AND is_deleted = FALSE
     RETURNING ${NOTE_SELECT_FIELDS}`,
    [noteId, userId],
  );

  if (result.rows.length === 0) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  const note = result.rows[0];
  await logActivity({
    noteId,
    userId,
    actionType: "DELETE",
    actionDescription: `Deleted note "${note.title}"`,
  });

  return note;
};

export const restoreNote = async ({ noteId, userId }) => {
  const client = await getClient();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `UPDATE notes 
       SET is_deleted = FALSE, 
           deleted_at = NULL,
           updated_at = CURRENT_TIMESTAMP
       WHERE note_id = $1 
         AND user_id = $2 
         AND is_deleted = TRUE
       RETURNING ${NOTE_SELECT_FIELDS}`,
      [noteId, userId],
    );

    if (result.rows.length === 0) {
      const error = new Error("Deleted note not found");
      error.statusCode = 404;
      throw error;
    }

    const note = result.rows[0];
    await logActivity({
      client,
      noteId,
      userId,
      actionType: "RESTORE",
      actionDescription: `Restored note "${note.title}"`,
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
