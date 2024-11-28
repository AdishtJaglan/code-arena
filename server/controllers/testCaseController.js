import TestCase from "../models/TestCase.js";
import Question from "../models/Question.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const createBulkTestCases = asyncHandler(async (req, res) => {
  const { testCases, question } = req.body;

  if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
    throw ApiError.BadRequest("An array of test cases is required.");
  }

  if (!question) {
    throw ApiError.BadRequest("A question ID is mandatory.");
  }

  const questionCheck = await Question.findById(question)
    .select("testCases")
    .lean();

  if (!questionCheck) {
    throw ApiError.NotFound("Question not found.");
  }

  if (questionCheck.testCases.length + testCases.length >= 30) {
    throw ApiError.BadRequest("Maximum 30 test cases allowed.");
  }

  const invalidTestCases = testCases.find(
    (tc) => !tc.input || !tc.output || tc.isHidden == null
  );

  if (invalidTestCases) {
    throw ApiError.BadRequest(
      "Each test case must have an input, output and hidden flag."
    );
  }

  const newTestCases = await TestCase.insertMany(
    testCases.map((tc) => ({ ...tc, question }))
  );
  const newTestCaseIds = newTestCases.map((tc) => tc._id);

  await Question.updateOne(
    { _id: question },
    { $push: { testCases: newTestCaseIds } }
  );

  return ApiResponse.Created("Test cases created successfully.", {
    count: newTestCases.length,
    testCases: newTestCases,
  }).send(res);
});

export const createTestCase = asyncHandler(async (req, res) => {
  const { input, output, isHidden, question } = req.body;

  if (!input || !output || !isHidden || !question) {
    throw ApiError.BadRequest("All fiels are mandatory.");
  }

  const questionCheck = await Question.findById(question)
    .select("testCases")
    .lean();

  if (!questionCheck) {
    throw ApiError.NotFound("Question not found.");
  }

  if (questionCheck.testCases.length >= 30) {
    throw ApiError.BadRequest("Maximum 30 test cases allowed per question.");
  }

  const testCase = await TestCase.create(req.body);
  await Question.updateOne(
    { _id: question },
    { $push: { testCases: testCase } }
  );

  return ApiResponse.Created("Created test case successfully.", {
    testCase,
  }).send(res);
});

export const getAllTestCases = asyncHandler(async (req, res) => {
  const testCases = await TestCase.find({}).lean();

  if (!testCases) {
    throw ApiError.NotFound("No test cases found.");
  }

  return ApiResponse.Ok("Fetched test cases.", {
    count: testCases.length,
    testCases,
  }).send(res);
});

export const getTestCasesByQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const question = await Question.exists({ _id: questionId });

  if (!question) {
    throw ApiError.NotFound("Question does not exist.");
  }

  const testCases = await TestCase.find({ question: questionId }).lean();

  if (!testCases) {
    throw ApiError.NotFound("This question does not have any test cases.");
  }

  return ApiResponse.Ok("Fetched test cases.", {
    count: testCases.length,
    testCases,
  }).send(res);
});
