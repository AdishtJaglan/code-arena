import Question from "../models/Question.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createQuestion = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { title, constraints, tags, difficulty } = req.body;

  if (!title || !constraints || !tags || !difficulty) {
    return res.status(400).json({ message: "All fields mandatory." });
  }

  const user = await User.exists({ _id: userId });

  if (!user) {
    return res.status(404).json({ message: "User does not exist." });
  }

  const body = {
    title,
    constraints,
    tags,
    difficulty,
    submittedBy: user._id,
  };

  const question = await Question.create(body);

  if (!question) {
    return res.status(500).json({ message: "Not able to create question." });
  }

  return res
    .status(201)
    .json({ message: "Created question successfully.", question });
});

export const getAllQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find({});

  if (!questions) {
    return res.status(404).json({ message: "No questions were found." });
  }

  return res.status(200).json({ message: "Fetched questions.", questions });
});

export const getQuestionsByUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const questions = await Question.find({ submittedBy: id });

  if (!questions) {
    return res
      .status(404)
      .json({ message: "No questions created by the user." });
  }

  return res
    .status(200)
    .json({ message: "Fetched contributed questions.", questions });
});

export const getQuestionsByTag = asyncHandler(async (req, res) => {
  const { tag } = req.query;
  const questions = await Question.find({ tags: { $in: tag } });

  if (!questions) {
    return res
      .status(404)
      .json({ message: "No questions found for given tag." });
  }

  return res
    .status(200)
    .json({ message: "Fetched question with given tag.", questions });
});

export const getNoOfQuestionForEachTag = asyncHandler(async (req, res) => {
  const result = await Question.aggregate([
    {
      $unwind: "$tags",
    },
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);

  if (!result) {
    return res
      .status(404)
      .json({ message: "Question with tags were not found." });
  }

  return res.status(200).json({
    message: "Tag count found.",
    noOfTags: result.length,
    counts: result,
  });
});

export const getQuestionbyId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const question = await Question.findById(id);

  if (!question) {
    return res.status(404).json({ message: "Question not found." });
  }

  return res.status(200).json({ message: "Fetched question.", question });
});

export const getCompleteQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find({
    testCases: { $exists: true, $ne: [] },
    examples: { $exists: true, $ne: [] },
    answer: { $exists: true, $ne: null },
  }).lean();

  if (!questions || questions.length === 0) {
    return res
      .status(404)
      .json({ message: "Not able to find any complete questions." });
  }

  return res.status(200).json({
    message: "Fetched complete questions successfully.",
    count: questions.length,
    questions: questions,
  });
});
