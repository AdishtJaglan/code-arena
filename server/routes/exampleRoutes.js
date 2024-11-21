import { Router } from "express";
import {
  createExample,
  getAllExamples,
  getExamplesByQuestions,
} from "../controllers/exampleController.js";
const router = Router();

router.post("/create", createExample);
router.get("/all", getAllExamples);
router.get("/question/:questionId", getExamplesByQuestions);

export default router;
