import { Router } from "express";
import {
  registerSingleTeacher,
  registerMultipleTeachers,
  deleteMultipleTeachers,
  deleteSingleTeacher,
} from "../controllers/teacher.controller.js";

const router = Router();

router.route("/register-single-teacher").post(registerSingleTeacher);
router.route("/register-multiple-teachers").post(registerMultipleTeachers);
router.route("/delete-single-teacher").delete(deleteSingleTeacher);
router.route("/delete-multiple-teachers").delete(deleteMultipleTeachers);

export default router;
