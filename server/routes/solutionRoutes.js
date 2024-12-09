import { Router } from "express";
import {
  addCodeAnswers,
  createMultipleSolutions,
  createSolution,
  getAllSolutions,
} from "../controllers/solutionControlller.js";
const router = Router();

router.post("/create", createSolution);
router.post("/create-many", createMultipleSolutions);
router.put("/code-answer/:solutionId", addCodeAnswers);
router.get("/all", getAllSolutions);

export default router;
