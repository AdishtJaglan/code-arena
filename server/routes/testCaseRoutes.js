import { Router } from "express";
import {
  createBulkTestCases,
  createTestCase,
  getAllTestCases,
  getTestCasesByQuestion,
} from "../controllers/testCaseController.js";
const router = Router();

router.post("/create-many", createBulkTestCases);
router.post("/create", createTestCase);
router.get("/all", getAllTestCases);
router.get("/question/:questionId", getTestCasesByQuestion);

export default router;
