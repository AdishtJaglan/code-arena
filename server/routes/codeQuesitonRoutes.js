import { Router } from "express";
import {
  createCodeQuestion,
  createMultipleCodeQuestions,
  getAllCodeQuestions,
  getCodeQuestionsForQuestion,
} from "../controllers/codeQuestionController.js";
const router = Router();

router.post("/create", createCodeQuestion);
router.post("/create-many", createMultipleCodeQuestions);
router.get("/all", getAllCodeQuestions);
router.get("/:questionId", getCodeQuestionsForQuestion);

export default router;
