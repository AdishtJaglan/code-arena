import Discussion from "../models/Discussion.js";
import Question from "../models/Question.js";
import User from "../models/User.js";

export const createDiscussions = async (req, res) => {
  try {
    const { question, user, comment } = req.body;

    if (!question || !user || !comment) {
      return res
        .status(400)
        .json({ message: "Invalid request, all fields mandatory." });
    }

    const [userCheck, questionCheck] = await Promise.all([
      Question.exists({ _id: question }),
      User.exists({ _id: user }),
    ]);

    if (!userCheck) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!questionCheck) {
      return res.status(404).json({ message: "Question not found." });
    }

    const discussion = await Discussion.create(req.body);

    await Promise.all([
      Question.updateOne(
        { _id: question },
        { $push: { discussion: discussion._id } }
      ),
      User.updateOne({ _id: user }, { $push: { comments: discussion._id } }),
    ]);

    return res
      .status(201)
      .json({ message: "Created discussion successfully.", discussion });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating discussion.", error });
  }
};

export const replyToDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const discussionCheck = await Discussion.exists({ _id: discussionId });

    if (!discussionCheck) {
      return res.status(404).json({ message: "Discussion does not exist." });
    }

    const { question, user, comment } = req.body;

    if (!question || !user || !comment) {
      return res
        .status(400)
        .json({ message: "Invalid request, all fields mandatory." });
    }

    const userCheck = await User.exists({ _id: user });

    if (!userCheck) {
      return res.status(404).json({ message: "User not found." });
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

    return res
      .status(201)
      .json({ message: "Replied to discussion successfully.", discussion });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to reply to discussion.", error });
  }
};

export const getAllDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find({}).lean();

    if (!discussions) {
      return res.status(404).json({ message: "No discussions found." });
    }

    return res.status(200).json({
      message: "Fetched all discussions.",
      count: discussions.length,
      discussions,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to get all discussions.", error });
  }
};

export const getDiscussionsByQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await Question.exists({ _id: questionId });

    if (!question) {
      return res.status(404).json({ message: "Question does not exist." });
    }

    const questions = await Discussion.find({
      question: questionId,
      parentDiscussion: null,
    }).lean();

    if (!questions || questions.length === 0) {
      return res
        .status(404)
        .json({ message: "No discussions for this question." });
    }

    return res.status(200).json({
      message: "Fetched discussions for the question.",
      count: questions.length,
      questions,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to discussions for this question.", error });
  }
};

export const getDiscussionsWithReactionCount = async (req, res) => {
  try {
    const { questionId } = req.params;

    const discussions = await Discussion.find({
      question: questionId,
      parentDiscussion: null,
    })
      .populate("user", "username profilePicture email")
      .select("-__v")
      .lean()
      .exec();

    const formattedDiscussions = discussions.map((discussion) => ({
      ...discussion,
      reactionCounts: {
        likes: discussion.reactions.likes.length,
        dislikes: discussion.reactions.dislikes.length,
      },
    }));

    return res.status(200).json({
      message: "Fetched all discussions for given question.",
      count: formattedDiscussions.length,
      discussions: formattedDiscussions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch discussions with reaction count.",
      error,
    });
  }
};

export const getUsersDiscussion = async (req, res) => {
  try {
    const { userId } = req.params;
    const userCheck = await User.exists({ _id: userId });

    if (!userCheck) {
      return res.status(404).json({ message: "User not found." });
    }

    const discussion = await Discussion.find({ user: userId }).lean();

    if (!discussion) {
      return res.status(404).json({ message: "No comments by this user." });
    }

    return res.status(200).json({
      message: "Fetched comments made by user.",
      count: discussion.length,
      discussion,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to get user's discussion.", error });
  }
};

export const getReplyToDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const discussionCheck = await Discussion.exists({ _id: discussionId });

    if (!discussionCheck) {
      return res.status(404).json({ message: "Discussion not found." });
    }

    const replies = await Discussion.find({
      parentDiscussion: discussionId,
    }).lean();

    if (!replies) {
      return res.status(404).json({ message: "No replies for this question." });
    }

    return res.status(200).json({
      message: "Fetched replies for the discussion.",
      count: replies.length,
      replies,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to get reply.", error });
  }
};

export const reactToDiscussion = async (req, res) => {
  try {
    const { discussionId, userId } = req.body;
    const { like } = req.query;

    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
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

      return res.status(200).json({
        success: true,
        message: "Like removed",
        action: "removed",
        reactionType: "like",
      });
    }

    if (!isLike && hasDisliked) {
      await Discussion.findByIdAndUpdate(discussionId, {
        $pull: { "reactions.dislikes": userId },
      });

      return res.status(200).json({
        success: true,
        message: "Dislike removed",
        action: "removed",
        reactionType: "dislike",
      });
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

    return res.status(200).json({
      success: true,
      message: `${isLike ? "Like" : "Dislike"} added`,
      action: "added",
      reactionType: isLike ? "like" : "dislike",
      reactionCounts,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to react to discussion." });
  }
};