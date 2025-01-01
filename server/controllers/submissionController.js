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
  const { _id: user } = req?.user;
  const { sourceCode, language, languageId, question } = req.body;

  if (!sourceCode || !language || !languageId || !user || !question) {
    throw ApiError.BadRequest("All fields are mandatory.");
  }

  const [userExists, questionExists] = await Promise.all([
    User.exists({ _id: user }),
    Question.findOne({ question_id: question })
      .populate("testCases")
      .select("testCases")
      .lean(),
  ]);

  if (!userExists) throw ApiError.NotFound("User does not exist.");
  if (!questionExists) throw ApiError.NotFound("Question does not exist.");

  const { testCases } = questionExists;

  if (!testCases || testCases.length === 0) {
    throw ApiError.NotFound("No test cases found for this question.");
  }

  const submissionTokens = await Promise.all(
    testCases.map(async (testCase) => {
      return submitCode({
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
    question: questionExists?._id,
    submittedBy: user,
  };

  await Promise.all([
    Submission.create(submissionData),
    Question.updateOne(
      { question_id: question },
      { $inc: { [allPassed ? "noOfSuccess" : "noOfFails"]: 1 } }
    ),
    allPassed &&
      User.updateOne(
        { _id: user },
        { $push: { questionsSolved: questionExists?._id } }
      ),
  ]);

  return ApiResponse.Created("Submission processed.", {
    passStatus: allPassed,
    submission: submissionData,
  }).send(res);
});

export const testCasesRun = asyncHandler(async (req, res) => {
  const { _id: user } = req?.user;
  const { sourceCode, language, languageId, testCases } = req.body;

  if (!sourceCode || !language || !languageId || !user || !testCases) {
    throw ApiError.BadRequest("All fields are mandatory.");
  }

  for (const testCase of testCases) {
    if (!testCase.input || !testCase.output) {
      throw ApiError.BadRequest("Each test case must have an input, output");
    }
  }

  const userExists = await User.exists({ _id: user });

  if (!userExists) throw ApiError.NotFound("User does not exist.");

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

  const userCheck = await User.findOne({ user_id: userId })
    .select("_id")
    .lean();

  if (!userCheck) {
    throw ApiError.NotFound("User does not exist.");
  }

  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  const heatmapData = await Submission.aggregate([
    {
      $match: {
        submittedBy: new mongoose.Types.ObjectId(userCheck?._id),
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

export const getPreferredLanguage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.exists({ user_id: id }).lean();
  if (!user) {
    throw ApiError.NotFound("User not found.");
  }

  const languageCounts = await Submission.aggregate([
    { $match: { submittedBy: user._id } },
    {
      $group: {
        _id: "$language",
        count: { $sum: 1 },
      },
    },
  ]);

  if (!languageCounts.length) {
    return ApiResponse.NoContent("No submissions by this user.");
  }

  const counts = languageCounts.reduce((acc, { _id, count }) => {
    acc[_id] = count;
    return acc;
  }, {});

  const supportedLanguages = [
    "C++",
    "C",
    "JavaScript",
    "Rust",
    "Go",
    "Java",
    "Python",
  ];

  const languageStats = supportedLanguages.reduce((acc, lang) => {
    acc[lang] = counts[lang] || 0;
    return acc;
  }, {});

  return ApiResponse.Ok("Fetched user language usages.", {
    totalCount: languageCounts.reduce((sum, { count }) => sum + count, 0),
    ...languageStats,
  }).send(res);
});

export const getRecentlySolvedQues = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ user_id: id }).select("_id").lean();
  if (!user) {
    throw ApiError.NotFound("User does not exist.");
  }

  const [acceptedSubmissions, allSubmissions] = await Promise.all([
    Submission.aggregate([
      {
        $match: {
          submittedBy: user._id,
          isSolved: true,
        },
      },
      { $sort: { submissionDate: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "questionDetails",
        },
      },
      { $unwind: "$questionDetails" },
      {
        $lookup: {
          from: "users",
          localField: "questionDetails.submittedBy",
          foreignField: "_id",
          as: "questionAuthor",
        },
      },
      { $unwind: "$questionAuthor" },
      {
        $project: {
          _id: 0,
          question: {
            title: "$questionDetails.title",
            tags: "$questionDetails.tags",
            likes: "$questionDetails.likes",
            dislikes: "$questionDetails.dislikes",
            difficulty: "$questionDetails.difficulty",
            question_id: "$questionDetails.question_id",
            acceptanceRate: "$questionDetails.acceptanceRate",
            submittedBy: {
              username: "$questionAuthor.username",
              profilePicture: "$questionAuthor.profilePicture",
              rating: "$questionAuthor.rating",
              user_id: "$questionAuthor.user_id",
            },
          },
        },
      },
    ]),
    Submission.aggregate([
      { $match: { submittedBy: user._id } },
      { $sort: { submissionDate: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "questionDetails",
        },
      },
      { $unwind: "$questionDetails" },
      {
        $lookup: {
          from: "users",
          localField: "questionDetails.submittedBy",
          foreignField: "_id",
          as: "questionAuthor",
        },
      },
      { $unwind: "$questionAuthor" },
      {
        $project: {
          _id: 0,
          isSolved: 1,
          language: 1,
          question: {
            title: "$questionDetails.title",
            tags: "$questionDetails.tags",
            likes: "$questionDetails.likes",
            dislikes: "$questionDetails.dislikes",
            difficulty: "$questionDetails.difficulty",
            question_id: "$questionDetails.question_id",
            acceptanceRate: "$questionDetails.acceptanceRate",
            submittedBy: {
              username: "$questionAuthor.username",
              profilePicture: "$questionAuthor.profilePicture",
              rating: "$questionAuthor.rating",
              user_id: "$questionAuthor.user_id",
            },
          },
        },
      },
    ]),
  ]);

  if (acceptedSubmissions.length === 0 && allSubmissions.length === 0) {
    throw ApiError.NotFound("No submissions found for this user.");
  }

  return ApiResponse.Ok("Fetched submissions.", {
    acceptedSubmissions: {
      count: acceptedSubmissions.length,
      submissions: acceptedSubmissions,
    },
    allSubmissions: {
      count: allSubmissions.length,
      submissions: allSubmissions,
    },
  }).send(res);
});
