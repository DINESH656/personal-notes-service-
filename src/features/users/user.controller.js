import validator from "validator";
import { registerUser, loginUser, getCurrentUser } from "./user.service.js";

export const registerController = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    if (!full_name || !full_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "full name is required",
      });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "email is required",
      });
    }
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "provide a valid email address" });
    }
    if (!password || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: "password is required",
      });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    const result = await registerUser({ full_name, email, password });
    return res.status(200).json({
      success: true,
      message: "user registered successfully",
      data: { result },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "something went wrong ",
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "enter a email address",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "enter a valid email address",
      });
    }
    if (!password || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: "enter a password",
      });
    }
    const result = await loginUser({ email, password });

    return res.status(200).json({
      success: true,
      message: "Login Successful!",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "something went wrong ",
    });
  }
};

export const currentUserController = async (req, res) => {
  try {
    const user = await getCurrentUser({ userId: req.user.id });
    return res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      data: { user },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "something went wrong ",
    });
  }
};
