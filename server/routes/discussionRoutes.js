import { Router } from "express";
import {
  createDiscussions,
  getAllDiscussions,
  getDiscussionsByQuestion,
  getDiscussionsWithReactionCount,
  getReplyToDiscussion,
  getUsersDiscussion,
  reactToDiscussion,
  replyToDiscussion,
} from "../controllers/discussionController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = Router();

router.post("/create", isAuthenticated, createDiscussions);
router.post("/reply/:discussionId", replyToDiscussion);
router.get("/all", getAllDiscussions);
router.get("/question/:questionId", getDiscussionsByQuestion);
router.get("/reaction/:questionId", getDiscussionsWithReactionCount);
router.get("/reply/:discussionId", getReplyToDiscussion);
router.get("/user/:userId", getUsersDiscussion);
router.patch("/react", reactToDiscussion);

export default router;
