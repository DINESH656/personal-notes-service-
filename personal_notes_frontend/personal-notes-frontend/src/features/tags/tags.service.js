import api from "../../app/axios";

export const getTags = async () => {
  const response = await api.get("/tags");
  return response.data.data.tags;
};

export const createTag = async (tagName) => {
  const response = await api.post("/tags", { tagName });
  return response.data.data.tag;
};

export const updateTag = async (tagId, tagName) => {
  const response = await api.put(`/tags/${tagId}`, { tagName });
  return response.data.data.tag;
};

export const deleteTag = async (tagId) => {
  const response = await api.delete(`/tags/${tagId}`);
  return response.data.data.tag;
};

export const assignTagsToNote = async (noteId, tagIds) => {
  const response = await api.put(`/tags/note/${noteId}`, { tagIds });
  return response.data.data.tags;
};
