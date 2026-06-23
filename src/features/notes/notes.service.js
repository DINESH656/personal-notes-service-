import { query } from "../../config/db.js";

export const createNote = async ({ userId, title, content, category }) => {
  const result = await query(
    `INSERT INTO notes (user_id, title, content , category )
     VALUES ($1, $2, $3,$4)
     RETURNING note_id, user_id, title, content, category, created_at, updated_at`,
    [userId, title.trim(), content.trim(), category.trim()],
  );

  return result.rows[0];
};

export const getNotesByUser = async (userId) => {
  const result = await query(
    `SELECT note_id, user_id, title, content, category, created_at, updated_at
     FROM notes
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId],
  );

  return result.rows;
};
export const getNoteById = async ({ noteId, userId }) => {
  const result = await query(
    `SELECT note_id, user_id, title, content, category, created_at, updated_at FROM notes 
    WHERE note_id = $1 AND user_id = $2`,
    [noteId, userId],
  );
  if (result.rows.length === 0) {
    const error = new Error("note not found ");
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
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
    RETURNING note_id, user_id, title, content, category, created_at, updated_at `,
    [title.trim(), content.trim(), category.trim(), noteId, userId],
  );
  if (result.rows.length === 0) {
    const error = new Error("note not found ");
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
};
export const deleteNotes = async ({ noteId, userId }) => {
  const result = await query(
    `DELETE FROM notes
     WHERE note_id = $1 AND user_id = $2
     RETURNING note_id, user_id, title, content, category, created_at, updated_at`,
    [noteId , userId]
  );
  if(result.rows.length === 0){
    const error = new Error('user not found');
    error.statusCode = 404 ;
    throw error;
  }
  return result.rows[0];
};
export const searchNotes = async({userId , title , category , keyword}) =>{
  const normalisedTitle = title?.trim() || null ;
  const normalisedCategory = category?.trim()||null
  const normalisedkeyword = keyword?.trim()|| null;

  const result = await query(
    `SELECT note_id, user_id, title, content, category, created_at, updated_at 
    FROM notes 
    WHERE user_id = $1 
    AND ($2::text IS NULL OR title ILIKE '%' || $2 || '%')
    AND ($3::text IS NULL OR category ILIKE '%' || $3 || '%')
    AND ($4::text IS NULL OR title ILIKE '%' || $4 || '%' OR content ILIKE '%' || $4 || '%')
    ORDER BY updated_at DESC  `,[userId , normalisedTitle??null , normalisedCategory??null , normalisedkeyword??null]
  );
  if(result.rows.length === 0){
    const error = new Error('not found');
    error.statusCode = 404;
    throw error;
  }
   return result.rows;

}
