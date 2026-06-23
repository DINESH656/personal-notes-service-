import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { query } from "../../config/db.js";
dotenv.config();

export const registerUser = async ({ full_name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedName = full_name.trim();
  const existingUser = await query(
    "SELECT user_id from users where  LOWER(email) = LOWER($1)",
    [normalizedEmail],
  );
  if (existingUser.rows.length > 0) {
    const error = new Error("user already exists with this email ");
    error.statusCode = 409;
    throw error;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query(
    "INSERT INTO users(full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, full_name, email, created_at , updated_at;",
    [normalizedName, normalizedEmail, passwordHash],
  );
  return result.rows[0];
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const result = await query(
    "SELECT user_id, full_name, email, password_hash, created_at , updated_at FROM users WHERE LOWER(email) = LOWER($1)",
    [normalizedEmail],
  );
  if (result.rows.length === 0) {
    const error = new Error("invalid email  or password");
    error.statusCode = 401;
    throw error;
  }
  const user = result.rows[0];
  const isPasswordMatched = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordMatched) {
    const error = new Error("incorrect password");
    error.statusCode = 401;
    throw error;
  }

  if (!process.env.JWT_SECRET) {
    const error = new Error("JWT_SECRET is not configured");
    error.statusCode = 500;
    throw error;
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
    token,
    user: {
      id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
};
export const getCurrentUser = async({userId}) =>{
  const result = await query(
    `SELECT user_id, full_name, email, created_at, updated_at
     FROM users
     WHERE user_id = $1`,
    [userId]
  );
  if(result.rows.length === 0){
    const error = new Error('user not found');
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];  
};
