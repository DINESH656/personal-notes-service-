import api from "../../app/axios";
export const getNoteById = async (noteId) => {
  const response = await api.get(`/notes/${noteId}`);
  return response.data.data.note;
};
export const createNote = async (payload) => {
  const response = await api.post(`/notes`, payload);
  return response.data.data.note;
};
export const updateNote = async (noteId, payload) => {
  const response = await api.put(`/notes/${noteId}`, payload);
  return response.data.data.note;
};
export const deleteNote = async (noteId) => {
  const response = await api.delete(`/notes/${noteId}`);
  return response.data.data.note;
};
export const getNotes = async ({
  page = 1,
  limit = 10,
  sortBy = "newest",
  title = "",
  category = "",
  keyword = "",
}) => {
  const response = await api.get("/notes", {
    params: {
      page,
      limit,
      sortBy,
      title,
      category,
      keyword,
    },
  });
  return response.data.data;
};
export const restoredNote = async (noteId) => {
  const response = await api.patch(`/notes/${noteId}/restore`);
  return response.data.data.note;
};
export const getTrashNotes = async ({
  page = 1,
  limit = 10,
  sortBy = "newest",
  title = "",
  category = "",
  keyword = "",
}) => {
  const response = await api.get("/notes/trash", {
    params: {
      page,
      limit,
      sortBy,
      title,
      category,
      keyword,
    },
  });
  return response.data.data;
};
