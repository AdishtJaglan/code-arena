import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const createAnswer = asyncHandler(async (req, res) => {
  const { solutions, question } = req.body;

  if (!solutions || !Array.isArray(solutions) || solutions.length === 0) {
    throw ApiError.BadRequest("Solution must be an array.");
  }

  if (!question) {
    throw ApiError.BadRequest("Question ID is mandatory.");
  }

  const questionCheck = await Question.findById(question).select("answer");

  if (!questionCheck) {
    throw ApiError.NotFound("Question not found.");
  }

  for (const solution of solutions) {
    const { type, heading, answer, contributedBy } = solution;

    if (!type || !heading || !answer || !contributedBy) {
      throw ApiError.BadRequest(
        "Each solution must include type, heading, answer, and contributedBy."
      );
    }

    if (!["Brute Force", "Better", "Optimal", "NA"].includes(type)) {
      throw ApiError.BadRequest(
        `Invalid solution type '${type}'. Allowed types are: 'Brute Force', 'Better', 'Optimal', 'NA'.`
      );
    }

    const userExists = await User.exists({ _id: contributedBy });
    if (!userExists) {
      throw ApiError.NotFound(`User with ID ${contributedBy} not found.`);
    }
  }

  const answer = await Answer.create(req.body);

  questionCheck.answer = answer._id;
  await questionCheck.save();

  return ApiResponse.Created("Successfully created answer.", { answer }).send(
    res
  );
});

export const getAllAnswers = asyncHandler(async (req, res) => {
  const answers = await Answer.find({}).lean();

  if (!answers) {
    throw ApiError.NotFound("Unable to find any answers.");
  }

  return ApiResponse.Ok("Fetched all answers", {
    count: answers.length,
    answers,
  }).send(res);
});

export const getAnswersForAQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;

  if (!questionId) {
    throw ApiError.BadRequest("Question ID is mandatory.");
  }

  const question = await Question.exists({ _id: questionId });

  if (!question) {
    throw ApiError.NotFound("Question not found.");
  }

  const answer = await Answer.find({ question: questionId });

  if (!answer) {
    throw ApiError.NotFound("No answers for this question.");
  }

  return ApiResponse.Ok("Fetched answer for this question.", { answer }).send(
    res
  );
});
