import Example from "../models/Example.js";
import Question from "../models/Question.js";
import User from "../models/User.js";

export const createExample = async (req, res) => {
  try {
    const { input, output, contributedBy, question } = req.body;

    if (!input || !output || !contributedBy || !question) {
      return res.status(400).json({ message: "All fields mandatory." });
    }

    const [userCheck, questionCheck] = await Promise.all([
      User.exists({ _id: contributedBy }),
      Question.findById(question).select("examples"),
    ]);

    if (questionCheck.examples.length >= 3) {
      return res
        .status(400)
        .json({ message: "Maximum three examples allowed per question." });
    }

    if (!userCheck) {
      return res.status(404).json({ message: "User does not exist." });
    }

    if (!questionCheck) {
      return res.status(404).json({ message: "Question does not exist." });
    }

    const example = await Example.create(req.body);

    await Question.updateOne(
      { _id: question },
      { $push: { examples: example._id } }
    );

    if (!example) {
      return res.status(500).json({ message: "Error createing example." });
    }

    return res
      .status(201)
      .json({ message: "Created example successfully.", example });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to create example.", error });
  }
};

export const getAllExamples = async (req, res) => {
  try {
    const examples = await Example.find({});

    if (!examples) {
      return res.status(404).json({ message: "No examples found." });
    }

    return res.status(200).json({
      message: "Fetched examples.",
      exampleCount: examples.length,
      examples,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to get examples.", error });
  }
};

export const getExamplesByQuestions = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await Question.exists({ _id: questionId });

    if (!question) {
      return res.status(404).json({ message: "Question does not exist." });
    }

    const examples = await Example.find({ question: questionId });

    if (!examples) {
      return res
        .status(404)
        .json({ message: "No examples for this question." });
    }

    return res
      .status(200)
      .json({ message: "Fetched examples for the question.", examples });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to examples for this question.", error });
  }
};
