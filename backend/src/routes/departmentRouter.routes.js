import { Router } from "express";
import {
  addCourse,
  addTeacherToCourse,
  fetchCourses,
  removeTeacherFromCourse,
  testApi,
  fetchAllCourses,
  deleteCourse,
  searchTimeTable,
  searchCourse,
  searchTeacher,
  fetchAllCoursesBySemester,
  saveTiemeTable,
} from "../controllers/departmentAdmin.controller.js";

const router = Router();

router.route("/").get(testApi);
router.route("/add-course").post(addCourse);
router.route("/add-teacher-to-course").patch(addTeacherToCourse);
router.route("/remove-teacher-from-course").patch(removeTeacherFromCourse);
router.route("/search-teacher").get(searchTeacher);

router.route("/fetch-courses").get(fetchCourses);
router.route("/fetch-all-courses").get(fetchAllCourses);
router.route("/fetch-all-courses-by-semester").get(fetchAllCoursesBySemester);
router.route("/delete-course").delete(deleteCourse);
router.route("/search-course").get(searchCourse);

router.route("/search-time-table").get(searchTimeTable);
router.route("/save-time-table").post(saveTiemeTable);

export default router;
