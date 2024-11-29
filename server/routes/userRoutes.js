import { Router } from "express";
import {
  getAllUser,
  getContributions,
  getLeaderBoardRankings,
  getUserByEmail,
  getUserById,
  getUserQuestionsSolved,
  loginUser,
  registerUser,
  sendAccountabilityPartnerRequest,
} from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

router.post(
  "/register",
  upload.fields([{ name: "profilePicture", maxCount: 1 }]),
  registerUser
);
router.post("/login", loginUser);
router.get("/data/:id", getUserById);
router.get("/solved/:id", isAuthenticated, getUserQuestionsSolved);
router.get("/contributions/:id", isAuthenticated, getContributions);
router.get("/all", getAllUser);
router.post("/email", getUserByEmail);
router.post("/request/:senderId", sendAccountabilityPartnerRequest);
router.get("/leaderboard", getLeaderBoardRankings);

export default router;
