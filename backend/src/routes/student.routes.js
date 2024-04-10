import { Router } from "express";
import { uploadAssignmentStudent } from "../middlewares/multerAssignmentStudent.middleware.js";
import {
  uploadAssignment,
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
  fetchStudentAttendance,
  getTimeTable,
  getStudentDetailsById,
  getAssignments,
} from "../controllers/student.controller.js";
import { uploadStudentProfilePhoto } from "../middlewares/multerUploadProfilePhotoStudent.middleware.js";

const router = Router();

//basic routes
router.route("/get-student-basic-details").get(getStudentBasicDetails);
router.route("/fetch-student-details").get(getStudentDetails);
router.route("/fetch-details-by-id").get(getStudentDetailsById);
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

router.route("/fetch-student-attendance").get(fetchStudentAttendance);

router.route("/get-time-table").get(getTimeTable);

router.route("/get-all-assignments").get(getAssignments);
router
  .route("/upload-assignment")
  .post(uploadAssignmentStudent.single("assignment"), uploadAssignment);

export default router;
