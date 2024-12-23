import { Router } from "express";
import {
  addCodeAnswers,
  createMultipleSolutions,
  createSolution,
  getAllSolutions,
} from "../controllers/solutionControlller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = Router();

router.post("/create", isAuthenticated, createSolution);
router.post("/create-many", isAuthenticated, createMultipleSolutions);
router.put("/code-answer/:solutionId", addCodeAnswers);
router.get("/all", getAllSolutions);

export default router;
