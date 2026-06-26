import { query } from "../../config/db";

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
