import { query } from "../../config/db.js";

export const createNote = async ({ userId, title, context }) => {
  const result = await query(
    `INSERT INTO notes (user_id, title, context)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, title.trim(), context.trim()],
  );

  return result.rows[0];
};

export const getNotesByUser = async (userId) => {
  const result = await query(
    `SELECT *
     FROM notes
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId],
  );

  return result.rows;
};
export const getNoteById = async ({ noteId, userId }) => {
  const result = await query(
    `SELECT * FROM notes 
    WHERE notes_id = $1 AND user_id = $2`,
    [noteId, userId],
  );
  return result.rows[0];
};

export const updateNotes = async({noteId , userId , title , context}) =>{
  const result = await query(
    `UPDATE notes SET title = $1 ,
    context = $2 ,
    updated_at = CURRENT_TIMESTAMP 
    WHERE user_id = $3 AND notes_id = $4
    RETURNING * `, [title.trim() , context.trim() , noteId , userId]
  );
  return result.rows[0]
}