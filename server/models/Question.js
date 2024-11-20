import mongoose from "mongoose";

const TAGS = [
  "Arrays",
  "Linked List",
  "Stack",
  "Queue",
  "Hashing",
  "Heap",
  "Binary Search",
  "Sorting",
  "Dynamic Programming",
  "Backtracking",
  "Recursion",
  "Graph Theory",
  "Tree",
  "Binary Tree",
  "Binary Search Tree",
  "Greedy",
  "Divide and Conquer",
  "Sliding Window",
  "Bit Manipulation",
  "Math",
  "Two Pointers",
  "Strings",
  "Trie",
  "Union Find",
  "Geometry",
  "Game Theory",
  "Segment Tree",
  "Fenwick Tree",
  "Memoization",
  "Combinatorics",
  "Breadth First Search",
  "Depth First Search",
  "Shortest Path",
  "Topological Sort",
  "Network Flow",
  "Knapsack",
  "Matrix",
  "Prefix Sum",
  "Kadane's Algorithm",
  "Hash Map",
  "Set",
  "Probability",
  "Modular Arithmetic",
  "Bitmasking",
  "Number Theory",
  "Intervals",
  "Monotonic Stack",
  "Monotonic Queue",
  "Z-Algorithm",
  "KMP Algorithm",
  "Minimum Spanning Tree",
  "Maximum Flow",
  "Eulerian Path",
  "Cycle Detection",
  "Strongly Connected Components",
  "Disjoint Set",
  "Probability and Statistics",
  "String Matching",
  "Pattern Searching",
];

const QuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    constraints: {
      type: String,
      required: true,
    },
    // TODO -> think of logic
    timeLimit: {
      type: Number,
      default: 1000,
    },
    // TODO -> think of logic
    memoryLimit: {
      type: Number,
      default: 256,
    },
    // TODO -> add this when you create approval system
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      //   default: "draft",
    },
    testCases: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "TestCase",
        },
      ],
      validate: {
        validator: function (v) {
          return v.length >= 5;
        },
        message: "A question must have minimum of 5 test cases",
      },
    },
    examples: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Example",
      },
    ],
    answer: {
      type: mongoose.Types.ObjectId,
      ref: "Answer",
    },
    discussion: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Discussion",
      },
    ],
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: {
      type: [String],
      required: true,
      enum: TAGS,
      validate: {
        validator: (v) => v.length > 0,
        message: "At least one tag must be selected.",
      },
    },
    submittedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    noOfSuccess: {
      type: Number,
      default: 0,
      min: 0,
    },
    noOfFails: {
      type: Number,
      default: 0,
      min: 0,
    },
    acceptanceRate: {
      type: Number,
      default: function () {
        return this.noOfSuccess + this.noOfFails > 0
          ? (this.noOfSuccess / (this.noOfSuccess + this.noOfFails)) * 100
          : 0;
      },
    },
    question_id: {
      type: String,
      immutable: true,
    },
  },
  { timestamps: true }
);

//! Middleware to Recalculate Acceptance Rate
QuestionSchema.pre("save", function (next) {
  if (this.noOfSuccess + this.noOfFails > 0) {
    this.acceptanceRate =
      (this.noOfSuccess / (this.noOfSuccess + this.noOfFails)) * 100;
  } else {
    this.acceptanceRate = 0;
  }
  next();
});

//! Middleware to generate unique question ids
QuestionSchema.pre("save", async function (next) {
  if (this.isNew) {
    let isUnique = false;

    while (!isUnique) {
      const randomId = Math.random().toString(36).substr(2, 9).toUpperCase();
      const questionId = `Q-${randomId}`;

      const existingQuestion = await mongoose.models.Question.findOne({
        question_id: questionId,
      });

      if (!existingQuestion) {
        this.question_id = questionId;
        isUnique = true;
      }
    }
  }

  next();
});

const Question = mongoose.model("Question", QuestionSchema);
export default Question;
