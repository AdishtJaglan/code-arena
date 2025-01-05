import { Router } from "express";
import {
  createQuestion,
  getAllQuestions,
  getCompleteQuestions,
  getNoOfQuestionForEachTag,
  getQuestionbyId,
  getQuestionByQuestionId,
  getQuestionCountForDifficulty,
  getQuestionsByTag,
  getQuestionsByUser,
  reactToQuestion,
} from "../controllers/questionController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = Router();

router.post("/create", isAuthenticated, createQuestion);
router.post("/like/:id", isAuthenticated, reactToQuestion);

router.get("/all", getAllQuestions);
router.get("/data/:id", getQuestionbyId);
router.get("/contribution/:id", getQuestionsByUser);
router.get("/tag", getQuestionsByTag);
router.get("/count-tags", getNoOfQuestionForEachTag);
router.get("/complete-question", getCompleteQuestions);
router.get("/complete-question/:question_id", getQuestionByQuestionId);
router.get("/difficulty-count", getQuestionCountForDifficulty);

export default router;
