import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import AccountabilityPartnerRequest from "../models/AccountabilityPartnerRequest.js";
import asyncHandler from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const check = await User.findOne({ email });

  if (check) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = await User.create(req.body);

  const JWT_SECRET = process.env.JWT_SECRET;

  const payload = { id: user.id, username: user.username };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });

  return res
    .status(201)
    .json({ message: "User created successfully.", token, user });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const JWT_SECRET = process.env.JWT_SECRET;

  const payload = { id: user.id, username: user.username };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ message: "Login successful", token });
});

export const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find({});

  if (!users) {
    return res.status(404).json({ message: "No users found." });
  }

  return res.status(200).json({ message: "Users fetched.", users });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.status(200).json({ message: "User fetched.", user });
});

export const getUserQuestionsSolved = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { difficulty } = req.query;

  const validDifficulties = ["Easy", "Medium", "Hard"];
  if (difficulty && !validDifficulties.includes(difficulty)) {
    return res.status(400).json({
      message: "Invalid difficulty level",
      error: { details: "Difficulty must be one of: Easy, Medium, Hard" },
    });
  }

  const populateOptions = {
    path: "questionsSolved",
    select: "title difficulty tags acceptanceRate likes dislikes",
    ...(difficulty && { match: { difficulty } }),
  };

  const user = await User.findById(id)
    .populate(populateOptions)
    .select("questionsSolved")
    .lean();

  if (!user) {
    return res.status(404).json({ message: "Error finding user." });
  }

  const filteredQuestions = user.questionsSolved.filter((q) => q !== null);

  return res.status(200).json({
    message: `Fetched ${difficulty || "all"} difficulty solved questions.`,
    data: {
      totalQuestions: filteredQuestions.length,
      difficulty: difficulty || "all",
      questions: filteredQuestions,
    },
  });
});

export const getContributions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  const validTypes = ["questions", "answers"];
  if (type && !validTypes.includes(type)) {
    return res.status(400).json({
      message: "Invalid contribution type",
      error: { details: "Type must be either 'questions' or 'answers'" },
    });
  }

  let selectFields = [];
  let populateFields = [];

  if (!type || type === "questions") {
    selectFields.push("questionContributions");
    populateFields.push("questionContributions");
  }

  if (!type || type === "answers") {
    selectFields.push("answerContributions");
    populateFields.push("answerContributions");
  }

  const user = await User.findById(id)
    .populate(populateFields)
    .select(selectFields.join(" "))
    .lean();

  if (!user) {
    return res.status(404).json({
      message: "No user found.",
    });
  }

  const responseData = {};

  if (!type || type === "questions") {
    responseData.questionContributions = {
      count: user.questionContributions?.length || 0,
      items: user.questionContributions || [],
    };
  }

  if (!type || type === "answers") {
    responseData.answerContributions = {
      count: user.answerContributions?.length || 0,
      items: user.answerContributions || [],
    };
  }

  return res.status(200).json({
    message: `Fetched ${type || "all"} contributions`,
    data: responseData,
  });
});

export const getUserByEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email })
    .select("username profilePicture rating bio _id achievements statistics")
    .lean();

  if (!user) {
    return res.status(404).json({ message: "User does not exist" });
  }

  return res.status(200).json({ message: "User fetched.", user });
});

export const sendAccountabilityPartnerRequest = asyncHandler(
  async (req, res) => {
    const { senderId } = req.params;
    const { receiverId } = req.body;

    const sender = await User.findById(senderId).select(
      "accountabilityPartnerRequest"
    );
    if (!sender) {
      return res.status(404).json({ message: "Sender does not exist" });
    }

    const receiver = await User.findById(receiverId).select(
      "accountabilityPartnerRequest"
    );
    if (!receiver) {
      return res.status(404).json({ message: "Receiver does not exist." });
    }

    const existingRequest = await AccountabilityPartnerRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "Pending",
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A pending request already exists." });
    }

    const accountabilityPartnerRequestObject =
      await AccountabilityPartnerRequest.create({
        sender: senderId,
        receiver: receiverId,
      });

    sender.accountabilityPartnerRequest.push(
      accountabilityPartnerRequestObject._id
    );
    receiver.accountabilityPartnerRequest.push(
      accountabilityPartnerRequestObject._id
    );

    await Promise.all([sender.save(), receiver.save()]);

    return res.status(200).json({
      message: "Request sent successfully.",
      sender,
      receiver,
      sentRequest: accountabilityPartnerRequestObject,
    });
  }
);
