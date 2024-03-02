import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/student_profile_photo");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const uploadStudentProfilePhoto = multer({
  storage,
});
