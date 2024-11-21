import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import User from "../models/User.js";

export const createAnswer = async (req, res) => {
  try {
    const { solutions, question } = req.body;

    if (!solutions || !Array.isArray(solutions) || solutions.length === 0) {
      return res.status(400).json({ message: "Solution must be an array." });
    }

    if (!question) {
      return res.status(400).json({ message: "Question ID is mandatory." });
    }

    const questionCheck = await Question.findById(question).select("answer");

    if (!questionCheck) {
      return res.status(404).json({ message: "Question not found." });
    }

    for (const solution of solutions) {
      const { type, heading, answer, contributedBy } = solution;

      if (!type || !heading || !answer || !contributedBy) {
        return res.status(400).json({
          message:
            "Each solution must include type, heading, answer, and contributedBy.",
        });
      }

      if (!["Brute Force", "Better", "Optimal", "NA"].includes(type)) {
        return res.status(400).json({
          message: `Invalid solution type '${type}'. Allowed types are: 'Brute Force', 'Better', 'Optimal', 'NA'.`,
        });
      }

      const userExists = await User.exists({ _id: contributedBy });
      if (!userExists) {
        return res.status(404).json({
          message: `User with ID ${contributedBy} not found.`,
        });
      }
    }

    const answer = await Answer.create(req.body);

    questionCheck.answer = answer._id;
    await questionCheck.save();

    return res
      .status(201)
      .json({ message: "Successfully created answer.", answer });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create answer.", error });
  }
};

export const getAllAnswers = async (req, res) => {
  try {
    const answers = await Answer.find({}).lean();

    if (!answers) {
      return res.status(404).json({ message: "Unable to find any answers." });
    }

    return res.status(200).json({
      message: "Fetched all answers.",
      count: answers.length,
      answers,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching answers.", error });
  }
};

export const getAnswersForAQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    if (!questionId) {
      return res.status(400).json({ message: "Question ID is mandatory." });
    }

    const question = await Question.exists({ _id: questionId });

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    const answer = await Answer.find({ question: questionId });

    if (!answer) {
      return res.status(404).json({ message: "No answers for this question." });
    }

    return res
      .status(200)
      .json({ message: "Fetched answer for this question.", answer });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting this questions' asnwer", error });
  }
};
