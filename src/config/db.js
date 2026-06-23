import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on("connect", () => {
  console.log("Database connected");
});

pool.on("error", (error) => {
  console.error("Database error:", error.message);
});

export const query = (text, params) => pool.query(text, params);

export const checkConnection = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
    console.log("Database connection verified");
  } finally {
    client.release();
  }
};
