import { Router } from "express";
import {
  createCodeAnswer,
  createMultipleCodeAnswer,
  getAllCodeAnswers,
} from "../controllers/codeAnswerController.js";
const router = Router();

router.post("/create", createCodeAnswer);
router.post("/create-many", createMultipleCodeAnswer);
router.get("/all", getAllCodeAnswers);

export default router;
