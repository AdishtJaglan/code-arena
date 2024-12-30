import { Router } from "express";
import {
  createSubmission,
  getAllSubmissions,
  getPreferredLanguage,
  getRecentlySolvedQues,
  getSubmission,
  getUserHeatMapData,
  getUsersSubmissions,
  testCasesRun,
} from "../controllers/submissionController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = Router();

router.post("/submit", createSubmission);
router.post("/run", isAuthenticated, testCasesRun);
router.get("/all", getAllSubmissions);
router.get("/data/:id", getSubmission);
router.get("/user/:userId", getUsersSubmissions);
router.get("/heatmap/:userId", getUserHeatMapData);
router.get("/preferred-language/:id", getPreferredLanguage);
router.get("/recent-questions/:id", getRecentlySolvedQues);

export default router;
