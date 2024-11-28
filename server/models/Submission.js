import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    sourceCode: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    languageId: {
      type: Number,
      required: true,
    },
    submissionDate: {
      type: Date,
      immutable: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Accepted", "Attempted", "Partially Solved"],
      required: true,
    },
    isSolved: {
      type: Boolean,
      default: false,
    },
    question: {
      type: mongoose.Types.ObjectId,
      ref: "Question",
    },
    submittedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", SubmissionSchema);
export default Submission;
