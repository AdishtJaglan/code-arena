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
  getLoggedInUserData,
  getParnterData,
  getUserQuestionsSolvedAll,
  getUserByUserId,
  getPublicPartnerData,
  getUserRank,
  getPotentialPartners,
  getUserQuestionsSolvedAllPublic,
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
router.get("/", isAuthenticated, getLoggedInUserData);
router.get("/data/:id", getUserById);
router.get("/solved/:id", isAuthenticated, getUserQuestionsSolved);
router.get("/contributions/:id", isAuthenticated, getContributions);
router.get("/all", getAllUser);
router.post("/email", getUserByEmail);
router.get("/leaderboard", getLeaderBoardRankings);
router.get("/partner", isAuthenticated, getParnterData);
router.get("/questions-solved", isAuthenticated, getUserQuestionsSolvedAll);
router.get("/questions-solved/:id", getUserQuestionsSolvedAllPublic);
router.get("/user-data/:id", getUserByUserId);
router.get("/partner/:id", getPublicPartnerData);
router.get("/rank/:id", getUserRank);
router.get("/potential-partners", isAuthenticated, getPotentialPartners);

export default router;
