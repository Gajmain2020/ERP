import { Router } from "express";
import {
  addCourse,
  addTeacherToCourse,
  removeTeacherFromCourse,
  testApi,
} from "../controllers/departmentAdmin.controller.js";

const router = Router();

router.route("/").get(testApi);
router.route("/add-course").post(addCourse);
router.route("/add-teacher-to-course").patch(addTeacherToCourse);
router.route("/remove-teacher-from-course").patch(removeTeacherFromCourse);

export default router;
