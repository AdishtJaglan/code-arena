import { Router } from "express";
import {
  createAnswer,
  getAllAnswers,
  getAnswersForAQuestion,
  getCompleteAnswer,
} from "../controllers/answerController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = Router();

router.post("/create", isAuthenticated, createAnswer);
router.get("/all", getAllAnswers);
router.get("/question/:questionId", getAnswersForAQuestion);
router.get("/complete/:id", getCompleteAnswer);

export default router;
