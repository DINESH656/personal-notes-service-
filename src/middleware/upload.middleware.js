import multer from "multer";
const storage = multer.memoryStorage();
const allowdMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const fileFilter = (req, file, cb) => {
  if (allowdMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type "), false);
  }
};
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter,
});

export default upload;
