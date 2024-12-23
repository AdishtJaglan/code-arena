import Solution from "../models/Solution.js";
import User from "../models/User.js";
import CodeAnswer from "../models/CodeAnswers.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import Answer from "../models/Answer.js";

export const createMultipleSolutions = asyncHandler(async (req, res) => {
  const { contributedBy, solutions, answerId } = req.body;

  if (!answerId) {
    throw ApiError.BadRequest("Answer ID is mandatory.");
  }

  if (!contributedBy) {
    throw ApiError.BadRequest("User ID is mandatory.");
  }

  if (!Array.isArray(solutions) || solutions.length === 0) {
    throw ApiError.BadRequest(
      "Solutions must be an array and cannot be empty."
    );
  }

  const [userCheck, answerCheck] = await Promise.all([
    User.exists({ _id: contributedBy }),
    Answer.findById(answerId),
  ]);

  if (!userCheck) {
    throw ApiError.NotFound("User not found.");
  }

  if (!answerCheck) {
    throw ApiError.NotFound("Answer not found.");
  }

  for (const solution of solutions) {
    if (!solution.type || !solution.heading || !solution.explanation) {
      throw ApiError.BadRequest(
        "Each solutions object must have: heading, type, explanation"
      );
    }

    solution.contributedBy = contributedBy;
  }

  const newSolutions = await Solution.insertMany(solutions);
  const newSolutionIds = newSolutions.map((sol) => sol._id);

  answerCheck.solutions.push(...newSolutionIds);
  await answerCheck.save();

  return ApiResponse.Created("Created solutions.", {
    count: solutions.length,
    solutions: newSolutions,
  }).send(res);
});

export const createSolution = asyncHandler(async (req, res) => {
  const { type, heading, explanation, contributedBy } = req.body;

  if (!type || !heading || !explanation || !contributedBy) {
    throw ApiError.BadRequest("All fields are mandatory.");
  }

  const user = await User.exists({ _id: contributedBy });

  if (!user) {
    throw ApiError.NotFound("User not found.");
  }

  const solution = await Solution.create({
    type,
    heading,
    explanation,
    contributedBy,
  });

  return ApiResponse.Created("Created solution successfully.", {
    solution,
  }).send(res);
});

export const getAllSolutions = asyncHandler(async (req, res) => {
  const solutions = await Solution.find({}).lean();

  if (!solutions) {
    throw ApiError.NotFound("No solutions found.");
  }

  return ApiResponse.Ok("Solution fetched successfully.", {
    count: solutions.length,
    solutions,
  }).send(res);
});

export const addCodeAnswers = asyncHandler(async (req, res) => {
  const { codeAnswers } = req.body;
  const { solutionId } = req.params;

  if (!solutionId) {
    throw ApiError.BadRequest("Solution ID is required.");
  }

  if (!Array.isArray(codeAnswers) || codeAnswers.length === 0) {
    throw ApiError.BadRequest("Code answers must be an array.");
  }

  for (const codeAnswer of codeAnswers) {
    const codeAnswerCheck = await CodeAnswer.exists({ _id: codeAnswer });

    if (!codeAnswerCheck) {
      throw ApiError.NotFound(
        `Code answer with ID ${codeAnswer} does not exist.`
      );
    }
  }

  const solution = await Solution.findById(solutionId).select("codeAnswer");

  if (!solution) {
    throw ApiError.NotFound("Solution not found.");
  }

  solution.codeAnswer.push(...codeAnswers);
  await solution.save();

  return ApiResponse.Accepted("Added code answers to solution.", {
    count: codeAnswers.length,
    codeAnswers,
    solution,
  }).send(res);
});
