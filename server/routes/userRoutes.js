import { Router } from "express";
import {
  getAllUser,
  getContributions,
  getUserById,
  getUserQuestionsSolved,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/data/:id", isAuthenticated, getUserById);
router.get("/solved/:id", isAuthenticated, getUserQuestionsSolved);
router.get("/contributions/:id", isAuthenticated, getContributions);
router.get("/all", isAuthenticated, getAllUser);

export default router;
