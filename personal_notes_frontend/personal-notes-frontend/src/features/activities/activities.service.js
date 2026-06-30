import api from "../../app/axios";

export const getActivities = async ({
  page = 1,
  limit = 10,
  actionType = "",
  noteId = "",
  sortBy = "newest",
} = {}) => {
  const response = await api.get("/activities", {
    params: {
      page,
      limit,
      actionType,
      noteId,
      sortBy,
    },
  });

  return response.data.data;
};
