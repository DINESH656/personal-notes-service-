import {
  createNote,
  getNotesByUser,
  getNoteById,
  updateNotes,
  deleteNotes,
  searchNotes,
} from "./notes.service.js";

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
    const notes = await getNotesByUser(req.user.id);

    return res.status(200).json({
      success: true,
      message: "notes fetched successfully ",
      data: { notes },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "something went wrong ",
    });
  }
};

export const getMyNotesById = async (req, res) => {
  try {
    const {id} = req.params
    const note = await getNoteById({
      noteId : id,
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
    const deletedNote = await deleteNotes({
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

export const searchNotesController = async (req, res) => {
  try {
    const title = req.query.title?.trim() || null;
    const category = req.query.category?.trim() || null;
    const keyword = req.query.keyword?.trim() || null;
    if (!title && !category && !keyword) {
      return res.status(400).json({
        success: false,
        message:
          "At least one search parameter is required: title, category, or keyword",
      });
    }
    const notes = await searchNotes({
      userId: req.user.id,
      title,
      category,
      keyword,
    });
    return res.status(200).json({
      success: true,
      message: "search completed successfully ",
      data: { notes },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "something went wrong ",
    });
  }
};
