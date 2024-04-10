import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/studentAssignments");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const uploadAssignmentStudent = multer({
  storage,
});
