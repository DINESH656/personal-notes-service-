import validator from "validator";
import { registerUser, loginUser } from "./user.service.js";

export const registerController = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    if (!full_name || !full_name.trim()) {
      return res.status(400).json({ error: "enter a name" });
    }
    if (!email || !password || !password.trim()) {
      return res.status(400).json({ error: "enter an email and password" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ error: "Please provide a valid email address" });
    }
    const result = await registerUser({ full_name, email, password });
    if (!result.success) {
      return res.status(400).json({
        error: result.message,
      });
    }

    res.status(201).json({
      message: "User registered successfully",
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || !password.trim()) {
      return res.status(400).json({ error: "email and password are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: "Please provide a valid email address",
      });
    }
    const result = await loginUser({ email, password });
    if (!result.success) {
      return res.status(400).json({
        error: result.message,
      });
    }
    return res.status(200).json({
      message: "Login Successful!",
      data: result.data,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
