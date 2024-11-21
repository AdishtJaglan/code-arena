import { Router } from "express";
import {
  createAnswer,
  getAllAnswers,
  getAnswersForAQuestion,
} from "../controllers/answerController.js";
const router = Router();

router.post("/create", createAnswer);
router.get("/all", getAllAnswers);
router.get("/question/:questionId", getAnswersForAQuestion);

export default router;
