import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import AccountabilityPartnerRequest from "../models/AccountabilityPartnerRequest.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    throw new ApiError.BadRequest("Invalid request");
  }

  const check = await User.findOne({ email });

  if (check) {
    throw new ApiError(409, "User already exists.");
  }

  const user = await User.create(req.body);

  const JWT_SECRET = process.env.JWT_SECRET;

  const payload = { id: user.id, username: user.username };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });

  return ApiResponse.Created("User created successfully.", {
    token,
    user,
  }).send(res);
});

export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user || user.password !== password) {
    throw new ApiError.Unauthorized("Invalid credentials");
  }

  const JWT_SECRET = process.env.JWT_SECRET;

  const payload = { id: user.id, username: user.username };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });

  return ApiResponse.Ok("Login successful", { token }).send(res);
});

export const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find({});

  if (!users) {
    throw new ApiError.NotFound("No users found.");
  }

  return ApiResponse.Ok("Users fetched.", { users }).send(res);
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError.NotFound("User not found.");
  }

  return ApiResponse.Ok("User fetched.", { user }).send(res);
});

export const getUserQuestionsSolved = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { difficulty } = req.query;

  const validDifficulties = ["Easy", "Medium", "Hard"];
  if (difficulty && !validDifficulties.includes(difficulty)) {
    throw new ApiError.BadRequest("Invalid difficulty level");
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
    throw new ApiError.NotFound("Error finding user.");
  }

  const filteredQuestions = user.questionsSolved.filter((q) => q !== null);

  return ApiResponse.Ok(
    `Fetched ${difficulty || "all"} difficulty solved questions.`,
    {
      totalQuestions: filteredQuestions.length,
      difficulty: difficulty || "all",
      questions: filteredQuestions,
    }
  ).send(res);
});

export const getContributions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  const validTypes = ["questions", "answers"];
  if (type && !validTypes.includes(type)) {
    throw new ApiError.BadRequest("Invalid contribution type");
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
    throw new ApiError.NotFound("No user found.");
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

  return ApiResponse.Ok(`Fetched ${type || "all"} contributions`, {
    data: responseData,
  }).send(res);
});

export const getUserByEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email })
    .select("username profilePicture rating bio _id achievements statistics")
    .lean();

  if (!user) {
    throw new ApiError.NotFound("User does not exist.");
  }

  return ApiResponse.Ok("User fetched.", { user }).send(res);
});

export const sendAccountabilityPartnerRequest = asyncHandler(
  async (req, res) => {
    const { senderId } = req.params;
    const { receiverId } = req.body;

    if (!receiverId) {
      throw new ApiError.BadRequest("Receiver ID mandatory.");
    }

    const sender = await User.findById(senderId).select(
      "accountabilityPartnerRequest"
    );
    if (!sender) {
      throw new ApiError.NotFound("Sender does not exist.");
    }

    const receiver = await User.findById(receiverId).select(
      "accountabilityPartnerRequest"
    );
    if (!receiver) {
      throw new ApiError.NotFound("Receiver does not exist.");
    }

    const existingRequest = await AccountabilityPartnerRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "Pending",
    });

    if (existingRequest) {
      throw new ApiError.BadRequest("A pending request already exists.");
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

    return ApiResponse.Ok("Request sent successfully.", {
      sender,
      receiver,
      sentRequest: accountabilityPartnerRequestObject,
    }).send(res);
  }
);
