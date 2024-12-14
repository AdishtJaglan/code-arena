import CodeQuestion from "../models/CodeQuestion.js";
import Question from "../models/Question.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const createMultipleCodeQuestions = asyncHandler(async (req, res) => {
  const { codeQuestion, questionId } = req.body;

  if (!Array.isArray(codeQuestion) || codeQuestion.length === 0) {
    throw ApiError.BadRequest(
      "Code questions array is mandatory and cannot be empty."
    );
  }

  if (!questionId) {
    throw ApiError.BadRequest("Question ID is mandatory.");
  }

  const question = await Question.findById(questionId).select("codeQuestion");

  if (!question) {
    throw ApiError.NotFound("No question found for given question ID.");
  }

  for (const codeQues of codeQuestion) {
    if (!codeQues.code || !codeQues.language) {
      throw ApiError.BadRequest(
        "Each code question must have language and source code."
      );
    }
    codeQues.question = questionId;
  }

  const codeQuestions = await CodeQuestion.insertMany(codeQuestion);
  const codeQuestionIds = codeQuestions.map((cq) => cq._id);

  question.codeQuestion.push(...codeQuestionIds);
  await question.save();

  return ApiResponse.Created("Created multiple code questions.", {
    codeQuestions,
    question,
  }).send(res);
});

export const createCodeQuestion = asyncHandler(async (req, res) => {
  const { question, code, language } = req.body;

  if (!question || !code || !language) {
    throw ApiError.BadRequest("All fields mandartory.");
  }

  const questionCheck = await Question.findOne({ _id: question }).select(
    "codeQuestion"
  );

  if (!questionCheck) {
    throw ApiError.NotFound("Question does not exist.");
  }

  const codeQuestion = await CodeQuestion.create({ question, code, language });

  questionCheck.codeQuestion.push(codeQuestion._id);
  await questionCheck.save();

  return ApiResponse.Created("Created code question.", {
    codeQuestion,
    questionCheck,
  }).send(res);
});

export const getAllCodeQuestions = asyncHandler(async (req, res) => {
  const codeQuestions = await CodeQuestion.find({}).lean();

  if (!codeQuestions) {
    throw ApiError.NotFound("No code questions found.");
  }

  return ApiResponse.Ok("Fetched code questions", codeQuestions).send(res);
});

export const getCodeQuestionsForQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;

  if (!questionId) {
    throw ApiError.BadRequest("Question ID is mandatory.");
  }

  const questionCheck = await Question.exists({ _id: questionId });

  if (!questionCheck) {
    throw ApiError.NotFound("Question not found.");
  }

  const codeQuestion = await CodeQuestion.find({ question: questionId }).lean();

  return ApiResponse.Ok("Fetched all code questions.", {
    count: codeQuestion.length,
    codeQuestion,
  }).send(res);
});
