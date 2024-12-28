import { Router } from "express";
import {
  createBulkTestCases,
  createTestCase,
  getAllTestCases,
  getNotHiddenTestCasesByQuestionId,
  getTestCasesByQuestion,
} from "../controllers/testCaseController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = Router();

router.post("/create-many", isAuthenticated, createBulkTestCases);
router.post("/create", createTestCase);
router.get("/all", getAllTestCases);
router.get("/question/:questionId", getTestCasesByQuestion);
router.get("/:question_id", getNotHiddenTestCasesByQuestionId);

export default router;
