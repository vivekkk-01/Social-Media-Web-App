const multer = require("multer");
const uuid = require("uuid");

const MIME_TYPES = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const date = new Date();
const fileUpload = multer({
  limits: 50000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const type = MIME_TYPES[file.mimetype];
      cb(null, `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}` + file.originalname);
    },
  }),

  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPES[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
