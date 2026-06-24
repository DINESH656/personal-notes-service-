import api from "../../app/axios";
export const getMyNotes = async () => {
  const response = await api.get("/notes");
  return response.data;
};
export const getNoteById = async (noteId) => {
  const response = await api.get(`/notes/${noteId}`);
  return response.data;
};
export const createNote = async (payload) => {
  const response = await api.post(`/notes`, payload);
  return response.data;
};
export const updateNote = async (noteId, payload) => {
  const response = await api.put(`/notes/${noteId}`, payload);
  return response.data;
};
export const deleteNote = async (noteId) => {
  const response = await api.delete(`/notes/${noteId}`);
  return response.data;
};
export const searchNotes = async (params) => {
  const query = new URLSearchParams();
  if (params.title) {
    query.append("title", params.title);
  }
  if (params.category) {
    query.append("category", params.category);
  }
  if (params.keyword) {
    query.append("keyword", params.keyword);
  }
  const response = await api.get(`/notes/search?${query.toString()}`);
  return response.data;
};
