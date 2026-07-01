import multer from "multer";
import path from "path";
const storage = multer.memoryStorage();
import { STORAGE_CONFIG } from "../config/storage.js";
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".docx", ".txt"];

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const validMimeType = STORAGE_CONFIG.ALLOWED_MIME_TYPES.includes(
    file.mimetype,
  );
  const validExtension = STORAGE_CONFIG.ALLOWED_EXTENSIONS.includes(extension);

  if (validMimeType && validExtension) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Unsupported File Type, Only JPG, JPEG, PNG, PDF, DOCX and TXT files are allowed.",
      ),
    );
  }
};
const upload = multer({
  storage,
  limits: {
    fileSize: STORAGE_CONFIG.MAX_FILE_SIZE,
  },
  fileFilter,
});

export default upload;
