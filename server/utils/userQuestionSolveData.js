import mongoose from "mongoose";
import User from "../models/User.js";
import ApiError from "./apiError.js";

const getUserQuestionsSolvedData = async (userId) => {
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

  return questionCounts[0] || { easy: 0, medium: 0, hard: 0, total: 0 };
};

export default getUserQuestionsSolvedData;
