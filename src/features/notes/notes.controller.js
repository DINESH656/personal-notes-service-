import {
  createNote,
  getNoteById,
  updateNotes,
  SoftDeleteNotes,
  getMyNotes,
  restoreNote,
} from "./notes.service.js";

const ALLOWED_SORT_OPTIONS = ["newest", "oldest", "title_asc", "title_desc"];

export const createNoteController = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note title is required",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note content is required",
      });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "note category is required",
      });
    }

    const note = await createNote({
      userId: req.user.id,
      title,
      content,
      category,
    });

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: { note },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "something went wrong ",
    });
  }
};
export const getMyNotesController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "newest";
    const title = req.query.title?.trim() || null;
    const category = req.query.category?.trim() || null;
    const keyword = req.query.keyword?.trim() || null;
    const tag = req.query.tag?.trim() || null;

    if (page < 1) {
      return res.status(400).json({
        success: false,
        message: "page must be greater than or equal to 1 ",
      });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: "limit must be between 1 and 100",
      });
    }

    if (!ALLOWED_SORT_OPTIONS.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid sortBy value , Allowed values : newest , oldest , title_asc , title_desc ",
      });
    }

    const result = await getMyNotes({
      userId: req.user.id,
      page,
      limit,
      sortBy,
      title,
      category,
      keyword,
      tag,
      isDeleted: false,
    });
    return res.status(200).json({
      success: true,
      message: "notes fetched successfully",
      data: {
        notes: result.notes,
        pagination: result.pagination,
        filters: {
          title,
          category,
          keyword,
          tag,
          sortBy,
        },
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      Message: error.message || "something went wrong",
    });
  }
};

export const getMyNotesById = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await getNoteById({
      noteId,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "note not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "note fetched successfully",
      data: { note },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "something went wrong ",
    });
  }
};
export const updateNotesController = async (req, res) => {
  try {
    const noteId = req.params.id;
    const { title, content, category } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "note title is required ",
      });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "note context is required",
      });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "note category is required",
      });
    }

    const updatedNotes = await updateNotes({
      noteId,
      userId: req.user.id,
      title,
      content,
      category,
    });
    if (!updatedNotes) {
      return res.status(404).json({
        success: false,
        message: "Note not found or you are not allowed to update it",
      });
    }
    return res.status(200).json({
      success: true,
      message: "note updated successfully ",
      data: { note: updatedNotes },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "something went wrong ",
    });
  }
};
export const deleteNoteController = async (req, res) => {
  try {
    const noteId = req.params.id;
    const deletedNote = await SoftDeleteNotes({
      noteId,
      userId: req.user.id,
    });
    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found or you are not allowed to delete it",
      });
    }
    return res.status(200).json({
      success: true,
      message: "note deleted successfully ",
      data: { note: deletedNote },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "something went wrong ",
    });
  }
};

export const restoreNoteController = async (req, res) => {
  try {
    const note = await restoreNote({
      noteId: req.params.id,
      userId: req.user.id,
    });
    return res.status(200).json({
      success: true,
      message: "Note restored successfully",
      data: { note },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "something went wrong ",
    });
  }
};
export const getTrashController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "newest";
    const title = req.query.title?.trim() || null;
    const category = req.query.category?.trim() || null;
    const keyword = req.query.keyword?.trim() || null;
    const tag = req.query.tag?.trim() || null;
    if (page < 1) {
      return res.status(400).json({
        success: false,
        message: "page must be greater than or equal to 1",
      });
    }
    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: "limit must be between 1 to 100 ",
      });
    }
    if (!ALLOWED_SORT_OPTIONS.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message:
          "invalid sortBy value. allowed values :newest, oldest, title_asc, title_desc",
      });
    }
    const result = await getMyNotes({
      userId: req.user.id,
      page,
      limit,
      sortBy,
      title,
      category,
      keyword,
      tag,
      isDeleted: true,
    });
    return res.status(200).json({
      success: true,
      message: "trash feteched successfully ",
      data: {
        notes: result.notes,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
