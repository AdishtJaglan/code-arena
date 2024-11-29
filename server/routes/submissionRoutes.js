import { Router } from "express";
import {
  createSubmission,
  getAllSubmissions,
  getSubmission,
  getUserHeatMapData,
  getUsersSubmissions,
  testCasesRun,
} from "../controllers/submissionController.js";
const router = Router();

router.post("/submit", createSubmission);
router.post("/run", testCasesRun);
router.get("/all", getAllSubmissions);
router.get("/data/:id", getSubmission);
router.get("/user/:userId", getUsersSubmissions);
router.get("/heatmap/:userId", getUserHeatMapData);

export default router;
