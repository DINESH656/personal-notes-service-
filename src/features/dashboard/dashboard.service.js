import { query } from "../../config/db.js";

export const getDashboardStats = async ({ userId }) => {
  try {
    const result = await query(
    `SELECT  
    (
      SELECT COUNT(*)::int
      FROM notes
      WHERE user_id = $1
    ) AS total_notes,
    (
      SELECT COUNT(*)::int
      FROM notes 
      WHERE user_id = $1
      AND is_deleted = FALSE 
    ) AS active_notes,
    (
      SELECT COUNT(*)::int
      FROM notes
      WHERE user_id = $1
      AND is_deleted = TRUE
    ) AS deleted_notes,
    (
      SELECT COUNT(*)::int
      FROM tags 
      WHERE user_id = $1
    ) AS total_tags,
    (
      SELECT COUNT(*)::int
      FROM note_activities
      WHERE user_id = $1
    ) AS total_activities,
    (
      SELECT COUNT(DISTINCT category)::int
      FROM notes 
      WHERE user_id = $1
      AND is_deleted = FALSE
    ) AS total_categories,
    (
      SELECT COUNT(*)::int
      FROM notes
      WHERE user_id = $1
      AND updated_at >= CURRENT_DATE
      AND is_deleted = FALSE
    ) AS recently_updated,
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
  } catch (error) {
    // If DB schema isn't present yet (tables missing), return safe defaults
    console.warn("dashboard.service: failed to fetch stats:", error.message);
    return {
      totalNotes: 0,
      activeNotes: 0,
      deletedNotes: 0,
      totalTags: 0,
      totalActivities: 0,
      totalCategories: 0,
      recentlyUpdated: 0,
      mostUsedCategory: null,
      latestNote: null,
      latestActivity: null,
    };
  }
};
