import Example from "../models/Example.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const createManyExample = asyncHandler(async (req, res) => {
  const { _id: contributedBy } = req?.user;
  const { examples, question } = req.body;

  if (!question) {
    throw ApiError.BadRequest("Question ID is mandatory.");
  }

  if (!contributedBy) {
    throw ApiError.BadRequest("User ID is mandatory.");
  }

  if (!Array.isArray(examples) || examples.length === 0) {
    throw ApiError.BadRequest(
      "Example must be an array of length greater than 0."
    );
  }

  const [questionCheck, userCheck] = await Promise.all([
    Question.findById(question).select("examples"),
    User.findById(contributedBy),
  ]);

  if (!questionCheck) {
    throw ApiError.NotFound("Question does not exist.");
  }

  if (!userCheck) {
    throw ApiError.NotFound("User does not exist.");
  }

  for (const example of examples) {
    const { input, output, explanation } = example || {};

    if (!input || !output || !explanation) {
      throw ApiError.BadRequest(
        "Each example object must contain: input, output and explanation."
      );
    }

    example.contributedBy = contributedBy;
    example.question = question;
  }

  const newExamples = await Example.insertMany(examples);
  const newExampleIds = newExamples.map((ex) => ex._id);

  questionCheck.examples.push(...newExampleIds);
  await questionCheck.save();

  return ApiResponse.Created("Created examples successfully.", {
    count: newExamples.length,
    examples: newExamples,
    question: questionCheck,
  }).send(res);
});

export const createExample = asyncHandler(async (req, res) => {
  const { input, output, contributedBy, question } = req.body;

  if (!input || !output || !contributedBy || !question) {
    throw ApiError.BadRequest("All fields mandatory.");
  }

  const [userCheck, questionCheck] = await Promise.all([
    User.exists({ _id: contributedBy }),
    Question.findById(question).select("examples"),
  ]);

  if (questionCheck.examples.length >= 3) {
    throw ApiError.BadRequest("Maximum three examples allowed per question.");
  }

  if (!userCheck) {
    throw ApiError.NotFound("User does not exist.");
  }

  if (!questionCheck) {
    throw ApiError.NotFound("Question does not exist.");
  }

  const example = await Example.create(req.body);

  await Question.updateOne(
    { _id: question },
    { $push: { examples: example._id } }
  );

  return ApiResponse.Created("Created example successfully.", { example }).send(
    res
  );
});

export const getAllExamples = asyncHandler(async (req, res) => {
  const examples = await Example.find({});

  if (!examples) {
    throw ApiError.NotFound("No examples found.");
  }

  return ApiResponse.Ok("Fetched examples.", {
    exampleCount: examples.length,
    examples,
  }).send(res);
});

export const getExamplesByQuestions = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const question = await Question.exists({ _id: questionId });

  if (!question) {
    throw ApiError.NotFound("Question does not exist.");
  }

  const examples = await Example.find({ question: questionId });

  if (!examples) {
    throw ApiError.NotFound("No examples for this question.");
  }

  return ApiResponse.Ok("Fetched examples for the question.", {
    count: examples.length,
    examples,
  }).send(res);
});
