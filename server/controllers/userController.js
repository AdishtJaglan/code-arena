import mongoose from "mongoose";
import User from "../models/User.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import uploadImageToCloudinary from "../utils/cloudinary.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    throw ApiError.BadRequest("Invalid request");
  }

  const check = await User.findOne({ $or: [{ email }, { username }] });
  if (check) {
    throw new ApiError(409, "User already exists.");
  }

  let profilePictureUrl = null;
  if (
    req.files &&
    req.files.profilePicture &&
    req.files.profilePicture.length > 0
  ) {
    try {
      const imageUploadResult = await uploadImageToCloudinary(
        req.files.profilePicture[0].path
      );

      if (imageUploadResult && imageUploadResult.secure_url) {
        profilePictureUrl = imageUploadResult.secure_url;
      }
    } catch (uploadError) {
      console.error("Profile picture upload failed:", uploadError);
    }
  }

  const userData = {
    ...req.body,
    ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
  };

  const user = await User.create(userData);

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  return ApiResponse.Created("User created successfully.", {
    accessToken,
    refreshToken,
    user,
  }).send(res);
});

export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user || !(await user.isPasswordMatching(password))) {
    throw ApiError.Unauthorized("Invalid credentials");
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  return ApiResponse.Ok("Login successful", { accessToken, refreshToken }).send(
    res
  );
});

export const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find({});

  if (!users) {
    throw ApiError.NotFound("No users found.");
  }

  return ApiResponse.Ok("Users fetched.", { users }).send(res);
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    throw ApiError.NotFound("User not found.");
  }

  return ApiResponse.Ok("User fetched.", { user }).send(res);
});

export const getUserQuestionsSolved = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { difficulty } = req.query;

  const validDifficulties = ["Easy", "Medium", "Hard"];
  if (difficulty && !validDifficulties.includes(difficulty)) {
    throw ApiError.BadRequest("Invalid difficulty level");
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
    throw ApiError.NotFound("Error finding user.");
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
    throw ApiError.BadRequest("Invalid contribution type");
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
    throw ApiError.NotFound("No user found.");
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
    throw ApiError.NotFound("User does not exist.");
  }

  return ApiResponse.Ok("User fetched.", { user }).send(res);
});

export const getLeaderBoardRankings = asyncHandler(async (req, res) => {
  const page = parseInt(req?.query?.page) || 1;
  const limit = parseInt(req?.query?.limit) || 20;

  const skip = (page - 1) * limit;

  const [userCount, users] = await Promise.all([
    User.countDocuments(),
    User.find({})
      .select("rating username profilePicture questionsSolved bio user_id -_id")
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  if (!users) {
    throw ApiError.NotFound("Leaderboard ranking not found.");
  }

  return ApiResponse.Ok("Fetched leaderboard rankings.", {
    count: userCount,
    users,
  }).send(res);
});

export const getLoggedInUserData = asyncHandler(async (req, res) => {
  const { _id: id } = req.user;

  if (!id) {
    throw ApiError.Unauthorized("Unauthorized");
  }

  const user = await User.findById(id)
    .select("username email profilePicture rating")
    .lean();

  if (!user) {
    throw ApiError.NotFound("User not found.");
  }

  return ApiResponse.Ok("Fetched user data.", { user }).send(res);
});

export const getParnterData = asyncHandler(async (req, res) => {
  const { _id: id } = req?.user;

  if (!id) {
    throw ApiError.BadRequest("ID is mandatory.");
  }

  const userCheck = await User.exists({ _id: id });

  if (!userCheck) {
    throw ApiError.NotFound("User does not exist.");
  }

  const user = await User.findById(id)
    .populate("accountabilityPartner")
    .select("accountabilityPartner")
    .lean();

  if (!user) {
    throw ApiError.NotFound("No accountability partner found.");
  }

  return ApiResponse.Ok("Fetched partner data.", {
    partner: user.accountabilityPartner,
  }).send(res);
});

export const getUserQuestionsSolvedAll = asyncHandler(async (req, res) => {
  const { id: userId } = req?.params;

  if (!userId) {
    throw ApiError.BadRequest("User ID is mandatory.");
  }

  const userExists = await User.exists({ _id: userId });
  if (!userExists) {
    throw ApiError.NotFound("User not found.");
  }

  const questionCounts = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    { $unwind: "$questionsSolved" },
    {
      $lookup: {
        from: "questions",
        localField: "questionsSolved",
        foreignField: "_id",
        as: "questionDetails",
      },
    },
    { $unwind: "$questionDetails" },
    {
      $group: {
        _id: null,
        easy: {
          $sum: {
            $cond: [{ $eq: ["$questionDetails.difficulty", "Easy"] }, 1, 0],
          },
        },
        medium: {
          $sum: {
            $cond: [{ $eq: ["$questionDetails.difficulty", "Medium"] }, 1, 0],
          },
        },
        hard: {
          $sum: {
            $cond: [{ $eq: ["$questionDetails.difficulty", "Hard"] }, 1, 0],
          },
        },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        easy: 1,
        medium: 1,
        hard: 1,
        total: 1,
      },
    },
  ]);

  const result = questionCounts[0] || { easy: 0, medium: 0, hard: 0, total: 0 };

  return ApiResponse.Ok("Fetched user questions data.", result).send(res);
});

export const getUserByUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw ApiError.BadRequest("User ID mandatory.");
  }

  const user = await User.findOne({ user_id: id }).lean();

  if (!user) {
    throw ApiError.NotFound("User does not exist.");
  }

  return ApiResponse.Ok("User fetched successfully.", {
    totalComments: user.comments.length,
    totalSubmissions: user.submissions.length,
    contributedAnswers: user.answerContributions.length,
    contributedQuestions: user.questionContributions.length,
    solvedQuestions: user.questionsSolved.length,
    user,
  }).send(res);
});
