import { Router } from "express";
import {
  registerSingleTeacher,
  registerMultipleTeachers,
  deleteMultipleTeachers,
  deleteSingleTeacher,
  fetchAllTeachers,
  fetchTeachersByDepartment,
  loginTeacher,
  addNewNotice,
  addNewAssignment,
  deleteNotice,
  deleteAssignment,
  searchStudent,
  getAllStudentsByDepartment,
  getAllStudentsBySemester,
  fetchClass,
  downloadAttendanceCSV,
  addAttendance,
  fetchStudentDetails,
} from "../controllers/teacher.controller.js";
import { uploadNotice } from "../middlewares/multerNotice.middleware.js";
import { uploadAssignment } from "../middlewares/multerAssignment.middleware.js";
import { fetchStudentsByTG } from "../controllers/teacherGuardian.controller.js";

const router = Router();

//! basic routes
router.route("/fetch-all-teachers").get(fetchAllTeachers);
router.route("/fetch-teachers-by-department").get(fetchTeachersByDepartment);
router.route("/register-single-teacher").post(registerSingleTeacher);
router.route("/register-multiple-teachers").post(registerMultipleTeachers);
router.route("/login-teacher").post(loginTeacher);
router.route("/delete-single-teacher").delete(deleteSingleTeacher);
router.route("/delete-multiple-teachers").delete(deleteMultipleTeachers);

//! Notice Routes
router.route("/add-notice").post(uploadNotice.single("notice"), addNewNotice);
router.route("/delete-notice").delete(deleteNotice);

//! assignments Routes
router
  .route("/add-assignment")
  .post(uploadAssignment.single("assignment"), addNewAssignment);
router.route("/delete-assignment").delete(deleteAssignment);

//! teacher route
router.route("/fetch-class").get(fetchClass);
router.route("/download-attendance-CSV").get(downloadAttendanceCSV);
router.route("/add-attendance").patch(addAttendance);

//! students related routes
router.route("/search-students").get(searchStudent);
router
  .route("/get-all-students-by-semester-department")
  .get(getAllStudentsBySemester);
router.route("/get-all-students-by-department").get(getAllStudentsByDepartment);

//! teacher guardian routes
router.route("/fetch-student-tg").get(fetchStudentsByTG);
router.route("/fetch-student-details").get(fetchStudentDetails);

export default router;
