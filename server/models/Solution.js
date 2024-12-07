import mongoose from "mongoose";

const SolutionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Brute Force", "Better", "Optimal", "NA"],
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    codeAnswer: [
      {
        type: mongoose.Types.ObjectId,
        ref: "CodeAnswer",
      },
    ],
    explanation: {
      type: String,
      required: true,
    },
    contributedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Solution = mongoose.model("Solution", SolutionSchema);
export default Solution;
