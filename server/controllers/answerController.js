import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import Solution from "../models/Solution.js";
import CodeAnswer from "../models/CodeAnswers.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const createAnswer = asyncHandler(async (req, res) => {
  const { _id: contributedBy } = req.user;
  const { question } = req.body;

  if (!question) {
    throw ApiError.BadRequest("Question ID is mandatory.");
  }

  if (!contributedBy) {
    throw ApiError.BadRequest("Contributor ID is mandatory.");
  }

  const [userCheck, questionCheck] = await Promise.all([
    User.findById(contributedBy),
    Question.findById(question),
  ]);

  if (!userCheck) {
    throw ApiError.NotFound("User not found.");
  }

  if (!questionCheck) {
    throw ApiError.NotFound("Question not found.");
  }

  const answer = await Answer.create({ question, contributedBy });

  userCheck.answerContributions.push(answer._id);
  questionCheck.answer = answer._id;

  await Promise.all([userCheck.save(), questionCheck.save()]);

  return ApiResponse.Created("Created answer.", answer).send(res);
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

export const getCompleteAnswer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw ApiError.BadRequest("Question ID is mandatory");
  }

  const answer = await Question.aggregate([
    { $match: { question_id: id } },
    {
      $lookup: {
        from: "answers",
        localField: "answer",
        foreignField: "_id",
        as: "answer",
      },
    },
    { $unwind: "$answer" },
    {
      $lookup: {
        from: "solutions",
        let: { solutionIds: "$answer.solutions" },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$solutionIds"] } } },
          {
            $lookup: {
              from: "codeanswers",
              let: { codeAnswerIds: "$codeAnswer" },
              pipeline: [
                { $match: { $expr: { $in: ["$_id", "$$codeAnswerIds"] } } },
                {
                  $project: {
                    _id: 0,
                    code: 1,
                    language: 1,
                    explanation: 1,
                  },
                },
              ],
              as: "codeAnswer",
            },
          },
          {
            $lookup: {
              from: "users",
              let: { userId: "$contributedBy" },
              pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                {
                  $project: {
                    _id: 0,
                    username: 1,
                    profilePicture: 1,
                    bio: 1,
                    rating: 1,
                  },
                },
              ],
              as: "contributedBy",
            },
          },
          { $unwind: "$contributedBy" },
          {
            $project: {
              _id: 0,
              type: 1,
              heading: 1,
              explanation: 1,
              codeAnswer: 1,
              contributedBy: 1,
              intuition: 1,
              approach: 1,
              complexityAnalysis: 1,
            },
          },
        ],
        as: "solutions",
      },
    },
    {
      $project: {
        _id: 0,
        solutions: 1,
      },
    },
  ]).exec();

  if (!answer?.[0]) {
    throw ApiError.NotFound("No answer found for the given question.");
  }

  return ApiResponse.Ok("Fetched complete answer.", {
    answer: answer[0].solutions,
  }).send(res);
});
