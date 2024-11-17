import mongoose from "mongoose";

const ExampleSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      default: "No explanation provided",
    },
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

ExampleSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Example = mongoose.model("Example", ExampleSchema);
export default Example;
