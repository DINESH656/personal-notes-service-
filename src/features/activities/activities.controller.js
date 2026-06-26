import { getActivities } from "./activities.service.js";

export const getActivitiesController = async (req, res) => {
  try {
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);
    const actionType = req.query.actionType?.trim() || null;
    const noteId = req.query.noteId?.trim() || null;
    const sortBy = req.query.sortBy?.trim() || "newest";
    const allowedSortOptions = ["newest", "oldest"];

    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        success: false,
        message: "page must be a positive integer",
      });
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: "limit must be an integer between 1 and 100",
      });
    }

    if (!allowedSortOptions.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sortBy value. Allowed values: newest, oldest",
      });
    }

    const result = await getActivities({
      userId: req.user.id,
      page,
      limit,
      actionType,
      noteId,
      sortBy,
    });
    return res.status(200).json({
      success: true,
      message: "Activities fetched successfully ",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "something went wrong ",
    });
  }
};
