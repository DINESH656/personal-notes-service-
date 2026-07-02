import api from "../../app/axios";

export const uploadAttachments = async (noteId, file) => {
  const formData = new FormData();

  formData.append("attachment", file);
  const response = await api.post(
    `/attachments/notes/${noteId}/attachments`,
    formData,
  );
  return response.data;
};
export const getAttachments = async (noteId) => {
  const response = await api.get(`/attachments/notes/${noteId}/attachments`);
  return response.data.data;
};

export const getAttachmentDownloadUrl = async (attachmentId) => {
  const response = await api.get(`/attachments/${attachmentId}/download`);
  return response.data.data;
};

export const deleteAttachments = async (attachmentId) => {
  const response = await api.delete(`/attachments/${attachmentId}`);
  return response.data;
};
