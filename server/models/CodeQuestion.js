import mongoose from "mongoose";

const LANGUAGES = ["C++", "C", "JavaScript", "Java", "Python", "Go", "Rust"];

const CodeQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Types.ObjectId,
      ref: "Question",
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

const CodeQuestion = mongoose.model("CodeQuestion", CodeQuestionSchema);
export default CodeQuestion;
