#!/usr/bin/env node
import dotenv from "dotenv";
import { getClient } from "../src/config/db.js";

dotenv.config();

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
  note_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  search_vector tsvector
);

CREATE TABLE IF NOT EXISTS tags (
  tag_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  tag_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS note_tags (
  note_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (note_id, tag_id)
);

CREATE TABLE IF NOT EXISTS attachments (
  attachment_id TEXT PRIMARY KEY,
  note_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  original_file_name TEXT,
  stored_file_name TEXT,
  file_type TEXT,
  file_size BIGINT,
  storage_bucket TEXT,
  storage_path TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS note_activities (
  activity_id TEXT PRIMARY KEY,
  note_id TEXT,
  user_id TEXT,
  action_type TEXT,
  action_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- simple helper indexes to avoid full text failures
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
`;

const run = async () => {
  const client = await getClient();
  try {
    console.log("Applying full DB schema migrations...");
    await client.query(SQL);
    console.log("Full migration applied successfully.");
  } catch (err) {
    console.error("Full migration failed:", err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    process.exit();
  }
};

run();
