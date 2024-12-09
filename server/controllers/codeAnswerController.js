import CodeAnswer from "../models/CodeAnswers.js";
import Solution from "../models/Solution.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

export const createMultipleCodeAnswer = asyncHandler(async (req, res) => {
  const { solutionId, codeAnswers } = req.body;

  if (!solutionId) {
    throw ApiError.BadRequest("Solution ID is mandatory.");
  }

  if (!Array.isArray(codeAnswers) || codeAnswers.length === 0) {
    throw ApiError.BadRequest(
      "Code answer must be an array of length greater than 0."
    );
  }

  const solutionCheck = await Solution.findById(solutionId).select(
    "codeAnswer"
  );

  if (!solutionCheck) {
    throw ApiError.NotFound("Solution not found.");
  }

  for (const codeAnswer of codeAnswers) {
    if (!codeAnswer.code || !codeAnswer.language) {
      throw ApiError.BadRequest(
        "Each code answer object must have code and language. "
      );
    }

    codeAnswer.solution = solutionId;
  }

  const newCodeAnswers = await CodeAnswer.insertMany(codeAnswers);
  const codeAnswerIds = newCodeAnswers.map((obj) => obj._id);

  solutionCheck.codeAnswer.push(...codeAnswerIds);
  solutionCheck.save();

  return ApiResponse.Created("Created multiple for code answers.", {
    count: newCodeAnswers.length,
    codeAnswers: newCodeAnswers,
  }).send(res);
});

export const createCodeAnswer = asyncHandler(async (req, res) => {
  const { solutionId, code, language } = req.body;

  if (!solutionId || !code || !language) {
    throw ApiError.BadRequest("All fields are mandatory.");
  }

  const solution = await Solution.findById(solutionId).select("codeAnswer");

  if (!solution) {
    throw ApiError.NotFound("Solution not found.");
  }

  const codeAnswer = await CodeAnswer.create({ solutionId, code, language });

  solution.codeAnswer.push(codeAnswer);
  await solution.save();

  return ApiResponse.Created(
    "Created code answer successfully.",
    codeAnswer
  ).send(res);
});

export const getAllCodeAnswers = asyncHandler(async (req, res) => {
  const codeAnswers = await CodeAnswer.find().lean();

  if (!codeAnswers) {
    throw ApiError.NotFound("No code answers found.");
  }

  return ApiResponse.Ok("Fetched code answers.", {
    count: codeAnswers.length,
    codeAnswers,
  }).send(res);
});
