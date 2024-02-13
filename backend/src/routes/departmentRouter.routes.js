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
  addMultipleStudents,
  addSingleStudent,
  addMultipleTeachers,addSingleTeacher
  
} from "../controllers/departmentAdmin.controller.js";

const router = Router();

//! - Students Related Routes
router.route("/add-multiple-students").post(addMultipleStudents);
router.route("/add-single-students").post(addSingleStudent);

//! - Teachers related routes
router.route('/add-single-teacher').post(addSingleTeacher)
router.route('/add-multiple-teachers').post(addMultipleTeachers)
router.route("/add-teacher-to-course").patch(addTeacherToCourse);
router.route("/remove-teacher-from-course").patch(removeTeacherFromCourse);
router.route("/search-teacher").get(searchTeacher);

//! - Courses related routes
router.route("/add-course").post(addCourse);
router.route("/fetch-courses").get(fetchCourses);
router.route("/fetch-all-courses").get(fetchAllCourses);
router.route("/fetch-all-courses-by-semester").get(fetchAllCoursesBySemester);
router.route("/delete-course").delete(deleteCourse);
router.route("/search-course").get(searchCourse);

//! - Timetable Routes
router.route("/search-time-table").get(searchTimeTable);
router.route("/save-time-table").post(saveTiemeTable);

export default router;
