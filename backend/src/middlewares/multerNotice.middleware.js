import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/notice");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const uploadNotice = multer({
  storage,
});
