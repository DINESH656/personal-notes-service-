#!/usr/bin/env node
import dotenv from "dotenv";
import { getClient } from "../src/config/db.js";

dotenv.config();

const run = async () => {
  const client = await getClient();
  try {
    console.log("Applying notes table schema migrations...");
    await client.query(
      `ALTER TABLE notes
       ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
       ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL`
    );
    console.log("Migration applied successfully.");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    process.exit();
  }
};

run();
