import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text, params) => {
  return pool.query(text, params);
};

// ⭐ NEW
export const getClient = async () => {
  return await pool.connect();
};

export const checkConnection = async () => {
  const client = await getClient();

  try {
    console.log("Database connected successfully");
  } finally {
    client.release();
  }
};
