import {
  createTag,
  getTagByUser,
  updateTag,
  deleteTag,
  assignTagsToNote,
  getTagsByNote,
} from "./tag.service.js";

export const createTagController = async (req, res) => {
  try {
    const { tagName } = req.body;
    if (!tagName || !tagName.trim()) {
      return res.status(400).json({
        success: false,
        message: "tag name is required",
      });
    }
    const tag = await createTag({
      userId: req.user.id,
      tagName,
    });
    return res.status(200).json({
      success: true,
      message: "tag created successfully ",
      data: { tag },
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "tag already exists",
      });
    }
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "something went wrong ",
    });
  }
};

export const getTagsController = async (req, res) => {
  try {
    const tags = await getTagByUser(req.user.id);
    return res.status(200).json({
      success: true,
      message: "tags fetched successfully",
      data: { tags },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "something went wrong ",
    });
  }
};
export const updateTagController = async (req, res) => {
  try {
    const tagId = req.params.id;
    const { tagName } = req.body;

    if (!tagName || !tagName.trim()) {
      return res.status(400).json({
        success: false,
        message: "tag name is required ",
      });
    }
    const tag = await updateTag({
      tagId,
      userId: req.user.id,
      tagName,
    });
    return res.status(200).json({
      success: true,
      message: "tag updated successfully ",
      data: { tag },
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "tag already exists",
      });
    }
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "something went wrong ",
    });
  }
};
export const deleteTagController = async (req, res) => {
  try {
    const tagId = req.params.id;
    const tag = await deleteTag({
      tagId,
      userId: req.user.id,
    });
    return res.status(200).json({
      success: true,
      message: "tag deleted successfully",
      data: { tag },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "something went wrong ",
    });
  }
};
export const assignTagsToNoteController = async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const { tagIds } = req.body;
    if (!Array.isArray(tagIds)) {
      return res.status(400).json({
        success: false,
        message: "tagIds must be an Array",
      });
    }
    const tags = await assignTagsToNote({
      noteId,
      userId: req.user.id,
      tagIds,
    });
    return res.status(200).json({
      success: true,
      message: "tags assigned successfully",
      data: { tags },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "something went wrong ",
    });
  }
};
export const getTagsByNoteController = async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const tags = await getTagsByNote({
      noteId,
      userId: req.user.id,
    });
    return res.status(200).json({
      success: true,
      message: "tags fetched successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "something went wrong ",
    });
  }
};
