import { getDashboardStats } from "./dashboard.service.js";

export const getDashboardStatsController = async (req, res) => {
  try {
    const stats = await getDashboardStats({
      userId: req.user.id,
    });
    return res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: stats,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
};
