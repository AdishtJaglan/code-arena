import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    contributedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    solutions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Solution",
      },
    ],
  },
  { timestamps: true }
);

const Answer = mongoose.model("Answer", AnswerSchema);
export default Answer;
