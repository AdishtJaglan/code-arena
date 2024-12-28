import { Router } from "express";
import {
  createBugReport,
  getAllBugReports,
} from "../controllers/bugReportController.js";
const router = Router();

router.post("/create", createBugReport);
router.get("/all", getAllBugReports);

export default router;
