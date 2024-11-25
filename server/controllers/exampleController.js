import Example from "../models/Example.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

export const createExample = asyncHandler(async (req, res) => {
  const { input, output, contributedBy, question } = req.body;

  if (!input || !output || !contributedBy || !question) {
    throw new ApiError.BadRequest("All fields mandatory.");
  }

  const [userCheck, questionCheck] = await Promise.all([
    User.exists({ _id: contributedBy }),
    Question.findById(question).select("examples"),
  ]);

  if (questionCheck.examples.length >= 3) {
    throw new ApiError.BadRequest(
      "Maximum three examples allowed per question."
    );
  }

  if (!userCheck) {
    throw new ApiError.NotFound("User does not exist.");
  }

  if (!questionCheck) {
    throw new ApiError.NotFound("Question does not exist.");
  }

  const example = await Example.create(req.body);

  await Question.updateOne(
    { _id: question },
    { $push: { examples: example._id } }
  );

  return res
    .status(201)
    .json({ message: "Created example successfully.", example });
});

export const getAllExamples = asyncHandler(async (req, res) => {
  const examples = await Example.find({});

  if (!examples) {
    throw new ApiError.NotFound("No examples found.");
  }

  return res.status(200).json({
    message: "Fetched examples.",
    exampleCount: examples.length,
    examples,
  });
});

export const getExamplesByQuestions = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const question = await Question.exists({ _id: questionId });

  if (!question) {
    throw new ApiError.NotFound("Question does not exist.");
  }

  const examples = await Example.find({ question: questionId });

  if (!examples) {
    throw new ApiError.NotFound("No examples for this question.");
  }

  return res
    .status(200)
    .json({ message: "Fetched examples for the question.", examples });
});
