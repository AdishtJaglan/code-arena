import mongoose from "mongoose";

const ReactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["like", "dislike"],
    required: true,
  },
});

const DiscussionSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    question: {
      type: mongoose.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reactions: [ReactionSchema],
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

DiscussionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Discussion = mongoose.model("Discussion", DiscussionSchema);
export default Discussion;
