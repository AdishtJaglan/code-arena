import { Router } from "express";
import {
  createExample,
  createManyExample,
  getAllExamples,
  getExamplesByQuestions,
} from "../controllers/exampleController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = Router();

router.post("/create-many", isAuthenticated, createManyExample);
router.post("/create", createExample);
router.get("/all", getAllExamples);
router.get("/question/:questionId", getExamplesByQuestions);

export default router;
