import mongoose from "mongoose";
import Submission from "../models/Submission.js";
import User from "../models/User.js";
import Question from "../models/Question.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
// import { verifyToken, submitCode, runTestCases } from "../utils/judge0.js"; //!for production
import { submitCode, verifyToken, runTestCases } from "../utils/judge0Dev.js"; //! for development

export const createSubmission = asyncHandler(async (req, res) => {
  const { sourceCode, language, languageId, user, question } = req.body;

  if (!sourceCode || !language || !languageId || !user || !question) {
    throw ApiError.BadRequest("All fields are mandatory.");
  }

  const [userExists, questionExists] = await Promise.all([
    User.exists({ _id: user }),
    Question.exists({ _id: question }),
  ]);

  if (!userExists) throw ApiError.NotFound("User does not exist.");
  if (!questionExists) throw ApiError.NotFound("Question does not exist.");

  const questionTestCases = await Question.findById(question)
    .populate("testCases")
    .select("testCases")
    .lean();

  if (!questionTestCases || questionTestCases.testCases.length === 0) {
    throw ApiError.NotFound("Test cases not found for this question.");
  }

  const { testCases } = questionTestCases;

  const submissionTokens = await Promise.all(
    testCases.map(async (testCase) => {
      submitCode({
        languageId,
        sourceCode,
        input: testCase.input,
        output: testCase.output,
      });
    })
  );

  await new Promise((resolve) => setTimeout(resolve, 500));

  let allPassed = true;

  for (const token of submissionTokens) {
    const status = await verifyToken(token);

    if (status.id === 4 || status.description === "Wrong Answer") {
      allPassed = false;
      break;
    }
  }

  const submissionData = {
    sourceCode,
    language,
    languageId,
    status: allPassed ? "Accepted" : "Attempted",
    isSolved: allPassed,
    question,
    submittedBy: user,
  };

  await Promise.all([
    Submission.create(submissionData),
    Question.updateOne(
      { _id: question },
      { $inc: { [allPassed ? "noOfSuccess" : "noOfFails"]: 1 } }
    ),
    allPassed &&
      User.updateOne({ _id: user }, { $push: { questionsSolved: question } }),
  ]);

  return ApiResponse.Created("Submission processed.", {
    passStatus: allPassed,
    submission: submissionData,
  }).send(res);
});

export const testCasesRun = asyncHandler(async (req, res) => {
  const { sourceCode, language, languageId, user, question } = req.body;

  if (!sourceCode || !language || !languageId || !user || !question) {
    throw ApiError.BadRequest("All fields are mandatory.");
  }

  const [userExists, questionExists] = await Promise.all([
    User.exists({ _id: user }),
    Question.exists({ _id: question }),
  ]);

  if (!userExists) throw ApiError.NotFound("User does not exist.");
  if (!questionExists) throw ApiError.NotFound("Question does not exist.");

  const questionTestCases = await Question.findById(question)
    .populate({
      path: "testCases",
      match: { isHidden: false },
      options: { limit: 3 },
    })
    .select("testCases")
    .lean();

  if (!questionTestCases || questionTestCases.testCases.length === 0) {
    throw ApiError.NotFound("Test cases not found for this question.");
  }

  const { testCases } = questionTestCases;

  const results = await runTestCases({
    sourceCode,
    languageId,
    testCases,
  });

  return ApiResponse.Ok("Test cases run successfully.", { results }).send(res);
});

export const getAllSubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({}).lean();

  if (!submissions || submissions.length === 0) {
    throw ApiError.NotFound("No submissions found.");
  }

  return ApiResponse.Ok("Fetched all submissions", {
    count: submissions.length,
    submissions,
  }).send(res);
});

export const getSubmission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const submission = await Submission.findById(id);

  if (!submission) {
    throw ApiError.NotFound("No submission found.");
  }

  return ApiResponse.Ok("Fetched submission.", { submission }).send(res);
});

export const getUsersSubmissions = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const submissions = await Submission.find({ submittedBy: userId }).lean();

  if (!submissions || submissions.length === 0) {
    throw ApiError.NotFound("No submissions found.");
  }

  return ApiResponse.Ok("Fetched users submissions.", {
    count: submissions.length,
    submissions,
  }).send(res);
});

export const getUserHeatMapData = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw ApiError.BadRequest("User ID is required.");
  }

  const userCheck = await User.exists({ _id: userId });

  if (!userCheck) {
    throw ApiError.NotFound("User does not exist.");
  }

  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  const heatmapData = await Submission.aggregate([
    {
      $match: {
        submittedBy: new mongoose.Types.ObjectId(userId),
        submissionDate: { $gte: oneYearAgo, $lte: now },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$submissionDate" },
          month: { $month: "$submissionDate" },
          day: { $dayOfMonth: "$submissionDate" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
          },
        },
        count: 1,
        _id: 0,
      },
    },
    {
      $sort: { date: 1 },
    },
  ]);

  const sortedDates = heatmapData
    .map((entry) => new Date(entry.date))
    .sort((a, b) => a - b);

  let currentStreak = 0;
  let longestStreak = 0;
  let lastDate = null;

  for (const date of sortedDates) {
    const isConsecutive = lastDate
      ? date - lastDate === 24 * 60 * 60 * 1000
      : true;

    if (isConsecutive) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }

    lastDate = date;
  }

  return ApiResponse.Ok("Submissions heatmap data retrieved successfully.", {
    daysActive: heatmapData.length,
    heatmapData,
    streaks: {
      currentStreak,
      longestStreak,
    },
  }).send(res);
});
