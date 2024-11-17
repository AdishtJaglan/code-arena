import mongoose from "mongoose";

const SolutionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Brute Force", "Better", "Optimal", "NA"],
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  contributedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const AnswerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  solutions: [SolutionSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

AnswerSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Answer = mongoose.model("Answer", AnswerSchema);
export default Answer;
