import { Router } from "express";
import { loginAdmin, signUpAdmin } from "../controllers/admin.controller.js";

const router = Router();

router.route("/sign-up").post(signUpAdmin);
router.route("/login").post(loginAdmin);

export default router;
