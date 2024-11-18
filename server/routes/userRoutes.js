import { Router } from "express";
import {
  getAllUser,
  getContributions,
  getUserByEmail,
  getUserById,
  getUserQuestionsSolved,
  loginUser,
  registerUser,
  sendAccountabilityPartnerRequest,
} from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/data/:id", getUserById);
router.get("/solved/:id", isAuthenticated, getUserQuestionsSolved);
router.get("/contributions/:id", isAuthenticated, getContributions);
router.get("/all", getAllUser);
router.post("/email", getUserByEmail);
router.post("/request/:senderId", sendAccountabilityPartnerRequest);

export default router;
