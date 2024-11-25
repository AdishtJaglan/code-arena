import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

export const createAnswer = asyncHandler(async (req, res) => {
  const { solutions, question } = req.body;

  if (!solutions || !Array.isArray(solutions) || solutions.length === 0) {
    throw new ApiError.BadRequest("Solution must be an array.");
  }

  if (!question) {
    throw new ApiError.BadRequest("Question ID is mandatory.");
  }

  const questionCheck = await Question.findById(question).select("answer");

  if (!questionCheck) {
    throw new ApiError.NotFound("Question not found.");
  }

  for (const solution of solutions) {
    const { type, heading, answer, contributedBy } = solution;

    if (!type || !heading || !answer || !contributedBy) {
      throw new ApiError.BadRequest(
        "Each solution must include type, heading, answer, and contributedBy."
      );
    }

    if (!["Brute Force", "Better", "Optimal", "NA"].includes(type)) {
      throw new ApiError.BadRequest(
        `Invalid solution type '${type}'. Allowed types are: 'Brute Force', 'Better', 'Optimal', 'NA'.`
      );
    }

    const userExists = await User.exists({ _id: contributedBy });
    if (!userExists) {
      throw new ApiError.NotFound(`User with ID ${contributedBy} not found.`);
    }
  }

  const answer = await Answer.create(req.body);

  questionCheck.answer = answer._id;
  await questionCheck.save();

  return res
    .status(201)
    .json({ message: "Successfully created answer.", answer });
});

export const getAllAnswers = asyncHandler(async (req, res) => {
  const answers = await Answer.find({}).lean();

  if (!answers) {
    throw new ApiError.NotFound("Unable to find any answers.");
  }

  return res.status(200).json({
    message: "Fetched all answers.",
    count: answers.length,
    answers,
  });
});

export const getAnswersForAQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;

  if (!questionId) {
    throw new ApiError.BadRequest("Question ID is mandatory.");
  }

  const question = await Question.exists({ _id: questionId });

  if (!question) {
    throw new ApiError.NotFound("Question not found.");
  }

  const answer = await Answer.find({ question: questionId });

  if (!answer) {
    throw new ApiError.NotFound("No answers for this question.");
  }

  return res
    .status(200)
    .json({ message: "Fetched answer for this question.", answer });
});
