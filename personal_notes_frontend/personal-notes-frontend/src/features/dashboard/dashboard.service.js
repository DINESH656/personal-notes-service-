import api from "../../app/axios";

export const getDashboardStats = async () => {
  const response = await api.get("/dashboard/stats");
  return response.data.data;
};
