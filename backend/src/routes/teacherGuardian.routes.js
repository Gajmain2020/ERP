import { Router } from "express";
import {
  fetchAllTG,
  assignTG,
  addSingleStudentTG,
  addMultipleStudentTG,
  removeTG,
} from "../controllers/teacherGuardian.controller.js";

const router = Router();

router.route("/fetch-all-tgs").get(fetchAllTG);
router.route("/assign-tg").post(assignTG);
router.route("/remove-tg").post(removeTG);
router.route("/add-single-student-to-tg").post(addSingleStudentTG);
router.route("/add-multiple-students-to-tg").post(addMultipleStudentTG);

export default router;
