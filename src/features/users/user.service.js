import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { query } from "../../config/db.js";
dotenv.config();

export const registerUser = async ({ full_name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await query(
    "SELECT user_id from users where  LOWER(email) = LOWER($1)",
    [normalizedEmail],
  );
  if (existingUser.rows.length > 0) {
    return {
      success: false,
      message: "user already existed",
    };
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query(
    "INSERT INTO users(full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, full_name, email, created_at;",
    [full_name.trim(), normalizedEmail, passwordHash],
  );
  return {
    success: true,
    message: "user registration completed",
    user: result.rows[0],
  };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const result = await query(
    "SELECT user_id, full_name, email, password_hash, created_at FROM users WHERE LOWER(email) = LOWER($1)",
    [normalizedEmail],
  );
  if (result.rows.length === 0) {
    return {
      success: false,
      message: "invalid email or password",
    };
  }
  const user = result.rows[0];
  const isPasswordMatched = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordMatched) {
    return {
      success: false,
      message: "invalid email or password",
    };
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign(
    {
      id: user.user_id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
  return {
    success: true,
    data: {
      token,
      user: {
        id: user.user_id,
        name: user.full_name,
        email: user.email,
        created_at: user.created_at,
      },
    },
  };
};
