import { Router } from "express";
import {
  registerSingleTeacher,
  registerMultipleTeachers,
  deleteMultipleTeachers,
  deleteSingleTeacher,
  fetchAllTeachers,
  fetchTeachersByDepartment,
  loginTeacher,
} from "../controllers/teacher.controller.js";

const router = Router();

router.route("/fetch-all-teachers").get(fetchAllTeachers);
router.route("/fetch-teachers-by-department").get(fetchTeachersByDepartment);
router.route("/register-single-teacher").post(registerSingleTeacher);
router.route("/register-multiple-teachers").post(registerMultipleTeachers);
router.route("/login-teacher").post(loginTeacher);
router.route("/delete-single-teacher").delete(deleteSingleTeacher);
router.route("/delete-multiple-teachers").delete(deleteMultipleTeachers);

export default router;
