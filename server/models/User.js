import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env-config.js";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    // TODO -> add this when you create approval system
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      // default: "user",
    },
    profilePicture: {
      type: String,
      default: null,
    },
    questionsSolved: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Question",
      },
    ],
    submissions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Submission",
      },
    ],
    accountabilityPartner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
    accountabilityPartnerRequest: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Partner",
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
    },
    answerContributions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Answer",
      },
    ],
    questionContributions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Question",
      },
    ],
    bio: {
      type: String,
      maxlength: 500,
    },
    //TODO -> get data from other CP platforms?
    socialLinks: {
      github: {
        type: String,
        match: [
          /https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-_]+/,
          "Enter a valid GitHub URL",
        ],
      },
      leetcode: {
        type: String,
        match: [
          /https?:\/\/(www\.)?leetcode\.com\/[a-zA-Z0-9-_]+/,
          "Enter a valid LeetCode URL",
        ],
      },
      codeforces: {
        type: String,
        match: [
          /https?:\/\/(www\.)?codeforces\.com\/profile\/[a-zA-Z0-9-_]+/,
          "Enter a valid Codeforces URL",
        ],
      },
    },
    //TODO -> think of logic
    achievements: [
      {
        type: {
          type: String,
          enum: [
            "FirstSolve",
            "Streak7Days",
            "Streak30Days",
            "Streak100Days",
            "ContributorBronze",
            "ContributorSilver",
            "ContributorGold",
          ],
        },
        earnedAt: { type: Date, default: Date.now },
      },
    ],
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Discussion",
      },
    ],
    user_id: {
      type: String,
      immutable: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

UserSchema.methods.isPasswordMatching = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      profilePicture: this.profilePicture,
    },
    ENV.ACCESS_TOKEN_SECRET,
    {
      expiresIn: ENV.ACCESS_TOKEN_EXPIRY,
    }
  );
};

UserSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    ENV.REFRESH_TOKEN_SECRET,
    {
      expiresIn: ENV.REFRESH_TOKEN_EXPIRY,
    }
  );
};

UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    let isUnique = false;

    while (!isUnique) {
      const randomId = Math.random().toString(36).substr(2, 9).toUpperCase();
      const userId = `Q-${randomId}`;

      const existingUser = await mongoose.models.User.findOne({
        user_id: userId,
      });

      if (!existingUser) {
        this.user_id = userId;
        isUnique = true;
      }
    }
  }

  next();
});

const User = mongoose.model("User", UserSchema);
export default User;
