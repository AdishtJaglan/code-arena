import Question from "../models/Question.js";
import User from "../models/User.js";
import Example from "../models/Example.js";
import Solution from "../models/Solution.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const createQuestion = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { title, constraints, tags, difficulty, explanation } = req.body;

  if (!title || !constraints || !tags || !difficulty || !explanation) {
    throw ApiError.BadRequest("All fields mandatory.");
  }

  const user = await User.exists({ _id: userId });

  if (!user) {
    throw ApiError.NotFound("User does not exist.");
  }

  const body = {
    title,
    constraints,
    tags,
    difficulty,
    explanation,
    submittedBy: user._id,
  };

  const question = await Question.create(body);

  return ApiResponse.Created("Created question successfully.", { question });
});

export const getAllQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find({});

  if (!questions) {
    throw ApiError.NotFound("No questions were found.");
  }

  return ApiResponse.Ok("Fetched questions.", { questions }).send(res);
});

export const getQuestionsByUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const questions = await Question.find({ submittedBy: id });

  if (!questions) {
    throw ApiError.NotFound("No questions created by the user.");
  }

  return ApiResponse.Ok("Fetched contributed questions.", { questions }).send(
    res
  );
});

export const getQuestionsByTag = asyncHandler(async (req, res) => {
  const { tag } = req.query;
  const questions = await Question.find({ tags: { $in: tag } });

  if (!questions) {
    throw ApiError.NotFound("No questions found for given tag.");
  }

  return ApiResponse.Ok("Fetched question with given tag.", { questions }).send(
    res
  );
});

export const getNoOfQuestionForEachTag = asyncHandler(async (req, res) => {
  const result = await Question.aggregate([
    {
      $unwind: "$tags",
    },
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);

  if (!result) {
    throw ApiError.NotFound("Question with tags were not found.");
  }

  return ApiResponse.Ok("Tag count found.", {
    noOfTags: result.length,
    counts: result,
  }).send(res);
});

export const getQuestionbyId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const question = await Question.findById(id);

  if (!question) {
    throw ApiError.NotFound("Question not found.");
  }

  return ApiResponse.Ok("Fetched question.", { question }).send(res);
});

export const getCompleteQuestions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const difficulty = req.query.difficulty || null;
  const tags = req.query.tags || null;

  const skip = (page - 1) * limit;

  const filter = {
    testCases: { $exists: true, $ne: [] },
    examples: { $exists: true, $ne: [] },
    answer: { $exists: true, $ne: null },
  };

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  if (tags) {
    const tagArray = Array.isArray(tags)
      ? tags
      : tags.split(",").map((tag) => tag.trim());
    filter.tags = { $all: tagArray };
  }

  const [questions, totalQuestions] = await Promise.all([
    Question.find(filter)
      .select("-testCases -discussion -examples")
      .skip(skip)
      .limit(limit)
      .lean(),
    Question.countDocuments(filter),
  ]);

  if (!questions || questions.length === 0) {
    throw ApiError.NotFound("Not able to find any complete questions.");
  }

  const totalPages = Math.ceil(totalQuestions / limit);

  return ApiResponse.Ok("Fetched complete questions successfully.", {
    count: questions.length,
    totalQuestions,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    questions,
  }).send(res);
});

export const getQuestionByQuestionId = asyncHandler(async (req, res) => {
  const { question_id } = req.params;

  if (!question_id) {
    throw ApiError.BadRequest("Question ID is mandatory.");
  }

  const question = await Question.findOne({ question_id: question_id })
    .select("-discussion")
    .populate({
      path: "submittedBy",
      select: "username profilePicture rating bio",
    })
    .populate({
      path: "answer",
      populate: {
        path: "solutions.contributedBy",
        select: "username profilePicture bio rating",
      },
    })
    .populate({
      path: "testCases",
      match: { isHidden: false },
    })
    .populate("examples")
    .lean();

  if (!question) {
    throw ApiError.NotFound("No question found for this quesiton ID.");
  }

  return ApiResponse.Ok("Question fetched successfully.", { question }).send(
    res
  );
});

export const getQuestionCountForDifficulty = asyncHandler(async (req, res) => {
  const result = await Question.aggregate([
    {
      $group: {
        _id: null,
        easyTotal: {
          $sum: {
            $cond: [{ $eq: ["$difficulty", "Easy"] }, 1, 0],
          },
        },
        mediumTotal: {
          $sum: {
            $cond: [{ $eq: ["$difficulty", "Medium"] }, 1, 0],
          },
        },
        hardTotal: {
          $sum: {
            $cond: [{ $eq: ["$difficulty", "Hard"] }, 1, 0],
          },
        },
        totalQuestions: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        easyTotal: 1,
        mediumTotal: 1,
        hardTotal: 1,
        totalQuestions: 1,
      },
    },
  ]);

  const questionCount = result[0] || {
    easyTotal: 0,
    mediumTotal: 0,
    hardTotal: 0,
    totalQuestions: 0,
  };

  return ApiResponse.Ok(
    "Fetched difficutly count for questions.",
    questionCount
  ).send(res);
});
