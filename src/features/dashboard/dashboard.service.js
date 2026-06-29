import { query } from "../../config/db.js";

export const getDashboardStats = async ({ userId }) => {
  const result = await query(
    `SELECT  
        ( COUNT(*) FROM notes
        WHERE userId = $1
        )AS total_notes
        (
        SELECT COUNT(*)
        FROM notes 
        WHERE userId = $1
        AND is_deleted = FALSE 
        ) AS active_notes
         (
        SELECT COUNT(*)
        FROM NOTES
        WHERE userId = $1
        AND is_deleted = TRUE
        ) AS deleted_notes
         (SELECT COUNT(*)
         FROM tags 
         WHERE user_id = $1
         ) AS total_tags
          (
         SELECT COUNT(*)
         FROM note_activities
         WHERE user_id = $1
          ) AS total_activities
           (
          SELECT COUNT(DISTINCT category)
          FROM notes 
        WHERE user_id = $1
        AND is_deleted = FALSE
          )AS total_catgories
          (
          SELECT COUNT(*)
          FROM notes
          WHERE user_id = $1
          AND updated_at >= CURRENT_DATE
          AND is_deleted = FALSE
          )AS recently updated
           (
      SELECT category
      FROM notes
      WHERE user_id = $1
      AND is_deleted = FALSE
      GROUP BY category
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) AS most_used_category,

    (
      SELECT row_to_json(n)
      FROM (
          SELECT
              note_id,
              title,
              updated_at
          FROM notes
          WHERE user_id = $1
          AND is_deleted = FALSE
          ORDER BY updated_at DESC
          LIMIT 1
      ) n
    ) AS latest_note,

    (
      SELECT row_to_json(a)
      FROM (
          SELECT
              action_type,
              action_description,
              created_at
          FROM note_activities
          WHERE user_id = $1
          ORDER BY created_at DESC
          LIMIT 1
      ) a
    ) AS latest_activity
`,
    [userId],
  );

  const stats = result.rows[0];
  return {
    totalNotes: Number(stats.total_notes),
    activeNotes: Number(stats.active_notes),
    deletedNotes: Number(stats.deleted_notes),
    totalTags: Number(stats.total_tags),
    totalActivities: Number(stats.total_activities),
    totalCategories: Number(stats.total_categories),
    recentlyUpdated: Number(stats.recently_updated),
    mostUsedCategory: stats.most_used_category ?? null,
    latestNote: stats.latest_note,
    latestActivity: stats.latest_activity,
  };
};
