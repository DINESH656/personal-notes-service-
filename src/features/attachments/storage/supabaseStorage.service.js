import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import path from "path";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
);
const BUCKET = process.env.SUPABASE_BUCKET;
export const testSupaBaseConnection = async () => {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    throw new Error(error.message);
  }
  const bucketExists = data.some((bucket) => bucket.name === BUCKET);
  if (!bucketExists) {
    throw new Error(`Bucket '${BUCKET}' does not exists`);
  }
  console.log("connected to supabase successfully ");
};

export const uploadFile = async (file) => {
  const extension = path.extname(file.originalname);
  const storedFileName = `${crypto.randomUUID()}${extension}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storedFileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });
  if (error) {
    throw new Error(error.message);
  }
  return {
    originalFileName: file.originalname,
    storedFileName,
    fileType: file.mimetype,
    fileSize: file.size,
    storageBucket: BUCKET,
    storagePath: storedFileName,
  };
};

export const deleteFile = async (storedFileName) => {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([storedFileName]);
  if (error) {
    throw new Error(error.message);
  }
};

export const generateSignedUrl = async (storedFileName) => {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storedFileName, 60 * 10);
  if (error) {
    throw new Error(error.message);
  }
  return data.signedUrl;
};


