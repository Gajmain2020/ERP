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
} from "../controllers/teacher.controller.js";
import { uploadNotice } from "../middlewares/multerNotice.middleware.js";
import { uploadAssignment } from "../middlewares/multerAssignment.middleware.js";

const router = Router();

//basic routes
router.route("/fetch-all-teachers").get(fetchAllTeachers);
router.route("/fetch-teachers-by-department").get(fetchTeachersByDepartment);
router.route("/register-single-teacher").post(registerSingleTeacher);
router.route("/register-multiple-teachers").post(registerMultipleTeachers);
router.route("/login-teacher").post(loginTeacher);
router.route("/delete-single-teacher").delete(deleteSingleTeacher);
router.route("/delete-multiple-teachers").delete(deleteMultipleTeachers);

// Notice Routes
router.route("/add-notice").post(uploadNotice.single("notice"), addNewNotice);
router.route("/delete-notice").delete(deleteNotice);

//assignments Routes
router
  .route("/add-assignment")
  .post(uploadAssignment.single("assignment"), addNewAssignment);
router.route("/delete-assignment").delete(deleteAssignment);

//students related routes
router.route("/search-student").get(searchStudent);
router.route("/get-all-students-by-semester").get(getAllStudentsBySemester);
router.route("/get-all-students-by-department").get(getAllStudentsByDepartment);
export default router;
