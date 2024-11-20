import mongoose from "mongoose";

const TestCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
    isHidden: {
      type: Boolean,
      required: true,
      default: false,
    },
    question: {
      type: mongoose.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  },
  {
    validate: {
      validator: function (v) {
        return this.question.testCases.length <= 30;
      },
      message: "Maximum 30 test cases allowed per question",
    },
  }
);

const TestCase = mongoose.model("TestCase", TestCaseSchema);
export default TestCase;
