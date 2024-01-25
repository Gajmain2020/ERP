import { Router } from "express";

import departmentRouter from "./departmentRouter.routes.js";
import { loginAdmin, signUpAdmin } from "../controllers/admin.controller.js";

const router = Router();

router.use("/:department", departmentRouter);

router.route("/sign-up").post(signUpAdmin);
router.route("/login").post(loginAdmin);

export default router;
