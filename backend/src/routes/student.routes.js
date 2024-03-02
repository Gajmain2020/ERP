import { Router } from "express";
import { uploadAssignment } from "../middlewares/multerAssignment.middleware.js";
import {
  editStudentDetails,
  getStudentBasicDetails,
  getStudentDetails,
  loginStudent,
  registerSingleStudent,
  saveStudentDetails,
  fetchAllStudents,
  registerMultipleStudents,
  updateProfile,
  deleteMultipleStudents,
  deleteSingleStudent,
} from "../controllers/student.controller.js";
import { uploadStudentProfilePhoto } from "../middlewares/multerUploadProfilePhotoStudent.middleware.js";

const router = Router();

//basic routes
router.route("/get-student-basic-details").get(getStudentBasicDetails);
router.route("/get-student-details").get(getStudentDetails);
router.route("/fetch-all-students").get(fetchAllStudents);
router.route("/login-student").post(loginStudent);
router.route("/register-single-student").post(registerSingleStudent);
router.route("/register-multiple-students").post(registerMultipleStudents);
router
  .route("/save-details")
  .patch(uploadStudentProfilePhoto.single("profilePhoto"), saveStudentDetails);
router.route("/edit-details").patch(editStudentDetails);
router.route("/update-profile").patch(updateProfile);
router.route("/delete-single-student").delete(deleteSingleStudent);
router.route("/delete-multiple-students").delete(deleteMultipleStudents);

export default router;
