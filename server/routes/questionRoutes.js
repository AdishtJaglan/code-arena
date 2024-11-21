import { Router } from "express";
import {
  createQuestion,
  getAllQuestions,
  getNoOfQuestionForEachTag,
  getQuestionbyId,
  getQuestionsByTag,
  getQuestionsByUser,
} from "../controllers/questionController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = Router();

router.post("/create/:userId", createQuestion);
router.get("/all", getAllQuestions);
router.get("/data/:id", getQuestionbyId);
router.get("/contribution/:id", getQuestionsByUser);
router.get("/tag", getQuestionsByTag);
router.get("/count-tags", getNoOfQuestionForEachTag);

export default router;
