import mongoose from "mongoose";

const LANGUAGES = ["C++", "C", "JavaScript", "Java", "Python", "Go", "Rust"];

const CodeAnswerSchema = new mongoose.Schema(
  {
    solution: {
      type: mongoose.Types.ObjectId,
      ref: "Solution",
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: LANGUAGES,
      required: true,
    },
  },
  { timestamps: true }
);

const CodeAnswer = mongoose.model("CodeAnswer", CodeAnswerSchema);
export default CodeAnswer;
