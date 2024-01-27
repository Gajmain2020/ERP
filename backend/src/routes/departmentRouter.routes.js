import { Router } from "express";
import {
  addCourse,
  addTeacherToCourse,
  fetchCourses,
  removeTeacherFromCourse,
  testApi,
  fetchAllCourses,
} from "../controllers/departmentAdmin.controller.js";

const router = Router();

router.route("/").get(testApi);
router.route("/add-course").post(addCourse);
router.route("/add-teacher-to-course").patch(addTeacherToCourse);
router.route("/remove-teacher-from-course").patch(removeTeacherFromCourse);

router.route("/fetch-courses").get(fetchCourses);
router.route("/fetch-all-courses").get(fetchAllCourses);

export default router;
