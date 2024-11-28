import Discussion from "../models/Discussion.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const createDiscussions = asyncHandler(async (req, res) => {
  const { question, user, comment } = req.body;

  if (!question || !user || !comment) {
    throw ApiError.BadRequest("Invalid request, all fields mandatory.");
  }

  const [userCheck, questionCheck] = await Promise.all([
    Question.exists({ _id: question }),
    User.exists({ _id: user }),
  ]);

  if (!userCheck) {
    throw ApiError.NotFound("User not found.");
  }

  if (!questionCheck) {
    throw ApiError.NotFound("Question not found.");
  }

  const discussion = await Discussion.create(req.body);

  await Promise.all([
    Question.updateOne(
      { _id: question },
      { $push: { discussion: discussion._id } }
    ),
    User.updateOne({ _id: user }, { $push: { comments: discussion._id } }),
  ]);

  return ApiResponse.Created("Created discussion successfully.", {
    discussion,
  }).send(res);
});

export const replyToDiscussion = asyncHandler(async (req, res) => {
  const { discussionId } = req.params;
  const { question, user, comment } = req.body;

  if (!question || !user || !comment) {
    throw ApiError.BadRequest("Invalid request, all fields mandatory.");
  }

  const discussionCheck = await Discussion.exists({ _id: discussionId });

  if (!discussionCheck) {
    throw ApiError.NotFound("Discussion does not exist.");
  }

  const userCheck = await User.exists({ _id: user });

  if (!userCheck) {
    throw ApiError.NotFound("User not found.");
  }

  const body = {
    question,
    user,
    comment,
    parentDiscussion: discussionId,
  };

  const discussion = await Discussion.create(body);

  await Promise.all([
    Question.updateOne(
      { _id: question },
      { $push: { discussion: discussion._id } }
    ),
    User.updateOne({ _id: user }, { $push: { comments: discussion._id } }),
  ]);

  return ApiResponse.Created("Replied to discussion successfully.", {
    discussion,
  }).send(res);
});

export const getAllDiscussions = asyncHandler(async (req, res) => {
  const discussions = await Discussion.find({}).lean();

  if (!discussions) {
    throw ApiError.NotFound("No discussions found.");
  }

  return ApiResponse.Ok("Fetched all discussions.", {
    count: discussions.length,
    discussions,
  }).send(res);
});

export const getDiscussionsByQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const question = await Question.exists({ _id: questionId });

  if (!question) {
    throw ApiError.NotFound("Question does not exist.");
  }

  const questions = await Discussion.find({
    question: questionId,
    parentDiscussion: null,
  }).lean();

  if (!questions || questions.length === 0) {
    throw ApiError.NotFound("No discussions for this question.");
  }

  return ApiResponse.Ok("Fetched discussions for the question.", {
    count: questions.length,
    questions,
  }).send(res);
});

export const getDiscussionsWithReactionCount = asyncHandler(
  async (req, res) => {
    const { questionId } = req.params;

    const discussions = await Discussion.find({
      question: questionId,
      parentDiscussion: null,
    })
      .populate("user", "username profilePicture email")
      .select("-__v")
      .lean()
      .exec();

    if (!discussions) {
      throw ApiError.NotFound("No discussions found.");
    }

    const formattedDiscussions = discussions.map((discussion) => ({
      ...discussion,
      reactionCounts: {
        likes: discussion.reactions.likes.length,
        dislikes: discussion.reactions.dislikes.length,
      },
    }));

    return ApiResponse.Ok("Fetched all discussions for given question.", {
      count: formattedDiscussions.length,
      discussions: formattedDiscussions,
    }).send(res);
  }
);

export const getUsersDiscussion = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const userCheck = await User.exists({ _id: userId });

  if (!userCheck) {
    throw ApiError.NotFound("User not found.");
  }

  const discussion = await Discussion.find({ user: userId }).lean();

  if (!discussion) {
    throw ApiError.NotFound("No comments by this user.");
  }

  return ApiResponse.Ok("Fetched comments made by user.", {
    count: discussion.length,
    discussion,
  }).send(res);
});

export const getReplyToDiscussion = asyncHandler(async (req, res) => {
  const { discussionId } = req.params;
  const discussionCheck = await Discussion.exists({ _id: discussionId });

  if (!discussionCheck) {
    throw ApiError.NotFound("Discussion not found.");
  }

  const replies = await Discussion.find({
    parentDiscussion: discussionId,
  }).lean();

  if (!replies) {
    throw ApiError.NotFound("No replies for this question.");
  }

  return ApiResponse.Ok("Fetched replies for the discussion.", {
    count: replies.length,
    replies,
  }).send(res);
});

export const reactToDiscussion = asyncHandler(async (req, res) => {
  const { discussionId, userId } = req.body;
  const { like } = req.query;

  if (!discussion || !userId) {
    throw ApiError.BadRequest("Discussion ID and user ID are mandatory.");
  }

  const discussion = await Discussion.findById(discussionId);

  if (!discussion) {
    throw ApiError.NotFound("Discussion not found");
  }

  const isLike = like === "true";

  const addToArray = isLike ? "reactions.likes" : "reactions.dislikes";
  const removeFromArray = isLike ? "reactions.dislikes" : "reactions.likes";

  const hasLiked = discussion.reactions.likes.includes(userId);
  const hasDisliked = discussion.reactions.dislikes.includes(userId);

  if (isLike && hasLiked) {
    await Discussion.findByIdAndUpdate(discussionId, {
      $pull: { "reactions.likes": userId },
    });

    return ApiResponse.Ok("Like removed").send(res);
  }

  if (!isLike && hasDisliked) {
    await Discussion.findByIdAndUpdate(discussionId, {
      $pull: { "reactions.dislikes": userId },
    });

    return ApiResponse.Ok("Dislike removed").send(res);
  }

  const updatedDiscussion = await Discussion.findByIdAndUpdate(
    discussionId,
    {
      $addToSet: { [addToArray]: userId },
      $pull: { [removeFromArray]: userId },
    },
    { new: true }
  ).populate("user", "username profilePicture email");

  const reactionCounts = {
    likes: updatedDiscussion.reactions.likes.length,
    dislikes: updatedDiscussion.reactions.dislikes.length,
  };

  return ApiResponse.Ok(`${isLike ? "Like" : "Dislike"} added`, {
    action: "added",
    reactionType: isLike ? "like" : "dislike",
    reactionCounts,
  }).send(res);
});
