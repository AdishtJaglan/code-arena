import TestCase from "../models/TestCase.js";
import Question from "../models/Question.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createBulkTestCases = asyncHandler(async (req, res) => {
  const { testCases, question } = req.body;

  if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
    return res
      .status(400)
      .json({ message: "An array of test cases is required." });
  }

  if (!question) {
    return res.status(400).json({ message: "A question ID is mandatory." });
  }

  const questionCheck = await Question.findById(question)
    .select("testCases")
    .lean();

  if (!questionCheck) {
    return res.status(404).json({ message: "Question not found." });
  }

  if (questionCheck.testCases.length + testCases.length >= 30) {
    return res.status(400).json({ message: "Maximum 30 test cases allowed." });
  }

  const invalidTestCases = testCases.find(
    (tc) => !tc.input || !tc.output || tc.isHidden == null
  );

  if (invalidTestCases) {
    return res.status(400).json({
      message: "Each test case must have an input, output and hidden flag.",
    });
  }

  const newTestCases = await TestCase.insertMany(
    testCases.map((tc) => ({ ...tc, question }))
  );
  const newTestCaseIds = newTestCases.map((tc) => tc._id);

  await Question.updateOne(
    { _id: question },
    { $push: { testCases: newTestCaseIds } }
  );

  return res.status(201).json({
    message: "Test cases created successfully.",
    count: newTestCases.length,
    testCases: newTestCases,
  });
});

export const createTestCase = asyncHandler(async (req, res) => {
  const { input, output, isHidden, question } = req.body;

  if (!input || !output || !isHidden || !question) {
    return res.status(400).json({ message: "All fiels are mandatory." });
  }

  const questionCheck = await Question.findById(question)
    .select("testCases")
    .lean();

  if (!questionCheck) {
    return res.status(404).json({ message: "Question not found." });
  }

  if (questionCheck.testCases.length >= 30) {
    return res
      .status(400)
      .json({ message: "Maximum 30 test cases allowed per question." });
  }

  const testCase = await TestCase.create(req.body);
  await Question.updateOne(
    { _id: question },
    { $push: { testCases: testCase } }
  );

  return res
    .status(201)
    .json({ message: "Created test case successfully.", testCase });
});

export const getAllTestCases = asyncHandler(async (req, res) => {
  const testCases = await TestCase.find({}).lean();

  if (!testCases) {
    return res.status(404).json({ message: "No test cases found." });
  }

  return res.status(200).json({
    message: "Fetched test cases.",
    count: testCases.length,
    testCases,
  });
});

export const getTestCasesByQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const question = await Question.exists({ _id: questionId });

  if (!question) {
    return res.status(404).json({ message: "Question does not exist." });
  }

  const testCases = await TestCase.find({ question: questionId }).lean();

  if (!testCases) {
    return res
      .status(404)
      .json({ message: "This question does not have any test cases." });
  }

  return res.status(200).json({
    message: "Fetched test cases.",
    count: testCases.length,
    testCases,
  });
});
