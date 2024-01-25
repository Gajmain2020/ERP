import { Router } from "express";
import { testApi } from "../controllers/departmentAdmin.controller.js";

const router = Router();

router.route("/").get(testApi);

export default router;
