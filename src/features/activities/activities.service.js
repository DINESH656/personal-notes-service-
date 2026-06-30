import { query } from "../../config/db.js";

export const logActivity = async ({
  client = null,
  noteId,
  userId,
  actionType,
  actionDescription,
}) => {
  const executor = client ?? { query };
  await executor.query(
    `INSERT INTO note_activities
        (
        note_id,
        user_id,
        action_type,
        action_description
        )VALUES(
        $1,
        $2,
        $3,
        $4)`,
    [noteId, userId, actionType, actionDescription],
  );
};

export const getActivities = async ({
  userId,
  page = 1,
  limit = 10,
  actionType = null,
  noteId = null,
  sortBy = "newest",
}) => {
  const offset = (page - 1) * limit;
  let orderBy = "created_at DESC";
  if (sortBy === "oldest") {
    orderBy = "created_at ASC";
  }
  const result = await query(
    `SELECT
        activity_id,
        note_id ,
        user_id,
        action_type,
        action_description,
        created_at
        FROM note_activities
        WHERE 
        user_id = $1 
        AND (
        $2 :: text IS NULL 
        OR action_type = $2
        )
        AND (
        $3 :: text IS NULL 
        OR note_id = $3
        ) 
        ORDER BY ${orderBy}
        LIMIT $4 OFFSET $5`,
    [userId, actionType, noteId, limit, offset],
  );
  const countResult = await query(
    `SELECT COUNT(*) AS total 
    FROM note_activities
    WHERE 
    user_id =$1
    AND(
    $2::text IS NULL 
    OR action_type =$2
    ) AND (
     $3::text IS NULL 
     OR note_id = $3
    )`,
    [userId, actionType, noteId],
  );
  const total = Number(countResult.rows[0].total);
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return {
    activities: result.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};
