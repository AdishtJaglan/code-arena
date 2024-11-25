import Question from "../models/Question.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const createQuestion = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { title, constraints, tags, difficulty } = req.body;

  if (!title || !constraints || !tags || !difficulty) {
    throw new ApiError.BadRequest("All fields mandatory.");
  }

  const user = await User.exists({ _id: userId });

  if (!user) {
    throw new ApiError.NotFound("User does not exist.");
  }

  const body = {
    title,
    constraints,
    tags,
    difficulty,
    submittedBy: user._id,
  };

  const question = await Question.create(body);

  return ApiResponse.Created("Created question successfully.", { question });
});

export const getAllQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find({});

  if (!questions) {
    throw new ApiError.NotFound("No questions were found.");
  }

  return ApiResponse.Ok("Fetched questions.", { questions }).send(res);
});

export const getQuestionsByUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const questions = await Question.find({ submittedBy: id });

  if (!questions) {
    throw new ApiError.NotFound("No questions created by the user.");
  }

  return ApiResponse.Ok("Fetched contributed questions.", { questions }).send(
    res
  );
});

export const getQuestionsByTag = asyncHandler(async (req, res) => {
  const { tag } = req.query;
  const questions = await Question.find({ tags: { $in: tag } });

  if (!questions) {
    throw new ApiError.NotFound("No questions found for given tag.");
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
    throw new ApiError.NotFound("Question with tags were not found.");
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
    throw new ApiError.NotFound("Question not found.");
  }

  return ApiResponse.Ok("Fetched question.", { question }).send(res);
});

export const getCompleteQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find({
    testCases: { $exists: true, $ne: [] },
    examples: { $exists: true, $ne: [] },
    answer: { $exists: true, $ne: null },
  }).lean();

  if (!questions || questions.length === 0) {
    throw new ApiError.NotFound("Not able to find any complete questions.");
  }

  return ApiResponse.Ok("Fetched complete questions successfully.", {
    count: questions.length,
    questions: questions,
  }).send(res);
});
