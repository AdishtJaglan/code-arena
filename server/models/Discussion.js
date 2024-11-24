import mongoose from "mongoose";

const DiscussionSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
      minLength: [1, "Comment cannot be empty"],
      maxLength: [2000, "Comment is too long"],
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
    reactions: {
      likes: [
        {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
      ],
      dislikes: [
        {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    parentDiscussion: {
      type: mongoose.Types.ObjectId,
      ref: "Discussion",
      default: null,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Discussion = mongoose.model("Discussion", DiscussionSchema);
export default Discussion;
