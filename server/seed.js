import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import User from "./models/User.js";
import Question from "./models/Question.js";
import Example from "./models/Example.js";
import Discussion from "./models/Discussion.js";
import Answer from "./models/Answer.js";
import Partner from "./models/Partner.js";
import TestCase from "./models/TestCase.js";
import Submission from "./models/Submission.js";
import Solution from "./models/Solution.js";
import CodeAnswer from "./models/CodeAnswers.js";
import CodeQuestion from "./models/CodeQuestion.js";
import BugReport from "./models/BugReport.js";

const MONGODB_URI = "mongodb://localhost:27017/code-arena";
const NUM_USERS = 100;
const NUM_QUESTIONS = 200;
const LANGUAGES = ["C++", "C", "JavaScript", "Java", "Python", "Go", "Rust"];
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

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomElements = (arr, min, max) => {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

function generateAchievements() {
  const possibleAchievements = [
    "FirstSolve",
    "Streak7Days",
    "Streak30Days",
    "Streak100Days",
    "ContributorBronze",
    "ContributorSilver",
    "ContributorGold",
  ];

  const numAchievements = faker.number.int({ min: 0, max: 4 });
  return getRandomElements(possibleAchievements, 0, numAchievements).map(
    (type) => ({
      type,
      earnedAt: faker.date.recent(),
    })
  );
}

async function seedUsers() {
  const users = [];
  const usedIds = new Set();

  for (let i = 0; i < NUM_USERS; i++) {
    let user_id;

    do {
      const randomId = Math.random().toString(36).substr(2, 9).toUpperCase();
      user_id = `U-${randomId}`;
    } while (usedIds.has(user_id));

    usedIds.add(user_id);

    const user = new User({
      username: faker.internet.username(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(["user", "moderator", "admin"]),
      profilePicture: faker.image.avatar(),
      bio: faker.lorem.paragraph(),
      rating: faker.number.int({ min: 0, max: 3000 }),
      socialLinks: {
        github: `https://github.com/${faker.internet.username()}`,
        leetcode: `https://leetcode.com/${faker.internet.username()}`,
        codeforces: `https://codeforces.com/profile/${faker.internet.username()}`,
      },
      achievements: generateAchievements(),
      user_id: user_id,
    });
    users.push(user);
  }

  await User.insertMany(users);
  return users;
}

async function seedQuestions(users) {
  const questions = [];
  const difficulties = ["Easy", "Medium", "Hard"];
  const generateConstraints = () => [
    "0 <= nums.length <= 105",
    "-109 <= nums[i] <= 109",
    "nums is a non-decreasing array.",
    "-109 <= target <= 109",
  ];
  const usedIds = new Set();

  for (let i = 0; i < NUM_QUESTIONS; i++) {
    const difficulty = getRandomElement(difficulties);

    let questionId;

    do {
      const randomId = Math.random().toString(36).substring(3, 8).toUpperCase();
      questionId = `Q-${randomId}`;
    } while (usedIds.has(questionId));

    usedIds.add(questionId);

    const noOfSuccess = faker.number.int({ min: 0, max: 1000 });
    const noOfFails = faker.number.int({ min: 0, max: 1000 });

    const question = new Question({
      title: `Consider the following ${getRandomElement(
        TAGS
      )} problem: ${faker.lorem.sentence()} `,
      explanation: faker.lorem.paragraphs(3),
      constraints: generateConstraints(),
      tags: getRandomElements(TAGS, 1, 4),
      submittedBy: getRandomElement(users)._id,
      difficulty,
      noOfSuccess,
      noOfFails,
      likes: faker.number.int({ min: 0, max: 500 }),
      dislikes: faker.number.int({ min: 0, max: 100 }),
      question_id: questionId,
      examples: [],
      testCases: [],
      discussion: [],
    });
    questions.push(question);
  }

  await Question.insertMany(questions);
  return questions;
}

async function seedExamples(questions, users) {
  const examples = [];
  const exampleIds = [];

  for (const question of questions) {
    const numExamples = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < numExamples; i++) {
      const example = new Example({
        input: `Input: [${faker.number.int()}, ${faker.number.int()}, ${faker.number.int()}]`,
        output: faker.number.int().toString(),
        explanation: faker.lorem.paragraph(),
        question: question._id,
        contributedBy: getRandomElement(users)._id,
      });
      examples.push(example);
      exampleIds.push(example._id);
    }
  }

  await Example.insertMany(examples);

  await Question.updateMany({}, { $set: { examples: exampleIds.slice(0, 3) } });

  return examples;
}

async function seedDiscussions(questions, users) {
  const discussions = [];
  const discussionIds = [];

  for (const question of questions) {
    const numParentDiscussions = faker.number.int({ min: 0, max: 5 });

    for (let i = 0; i < numParentDiscussions; i++) {
      const numLikes = faker.number.int({ min: 0, max: 7 });
      const numDislikes = faker.number.int({ min: 0, max: 3 });

      const likeUsers = getRandomElements(users, 0, numLikes).map((u) => u._id);
      const remainingUsers = users.filter((u) => !likeUsers.includes(u._id));
      const dislikeUsers = getRandomElements(
        remainingUsers,
        0,
        numDislikes
      ).map((u) => u._id);

      const parentDiscussion = new Discussion({
        comment: faker.lorem.paragraph(),
        question: question._id,
        user: getRandomElement(users)._id,
        reactions: {
          likes: likeUsers,
          dislikes: dislikeUsers,
        },
        parentDiscussion: null,
        isEdited: faker.datatype.boolean(0.1),
      });

      discussions.push(parentDiscussion);
      discussionIds.push(parentDiscussion._id);

      const numReplies = faker.number.int({ min: 0, max: 3 });

      for (let j = 0; j < numReplies; j++) {
        const numReplyLikes = faker.number.int({ min: 0, max: 5 });
        const numReplyDislikes = faker.number.int({ min: 0, max: 2 });

        const replyLikeUsers = getRandomElements(users, 0, numReplyLikes).map(
          (u) => u._id
        );
        const remainingUsersForReply = users.filter(
          (u) => !replyLikeUsers.includes(u._id)
        );
        const replyDislikeUsers = getRandomElements(
          remainingUsersForReply,
          0,
          numReplyDislikes
        ).map((u) => u._id);

        const reply = new Discussion({
          comment: faker.lorem.paragraph(),
          question: question._id,
          user: getRandomElement(users)._id,
          reactions: {
            likes: replyLikeUsers,
            dislikes: replyDislikeUsers,
          },
          reactionCounts: {
            likes: replyLikeUsers.length,
            dislikes: replyDislikeUsers.length,
          },
          parentDiscussion: parentDiscussion._id,
          isEdited: faker.datatype.boolean(0.1),
        });

        discussions.push(reply);
        discussionIds.push(reply._id);
      }
    }
  }

  await Discussion.insertMany(discussions);

  await Question.updateMany({}, { $set: { discussion: discussionIds } });

  return discussions;
}

async function seedTestCases(questions) {
  const testCases = [];
  const testCaseIds = [];

  for (const question of questions) {
    const numTestCases = faker.number.int({ min: 5, max: 30 });

    for (let i = 0; i < numTestCases; i++) {
      const testCase = new TestCase({
        input: `[${faker.number.int()}, ${faker.number.int()}, ${faker.number.int()}]`,
        output: faker.number.int().toString(),
        isHidden: faker.datatype.boolean(),
        question: question._id,
      });
      testCases.push(testCase);
      testCaseIds.push(testCase._id);
    }
  }

  await TestCase.insertMany(testCases);

  await Question.updateMany(
    {},
    { $set: { testCases: testCaseIds.slice(0, 30) } }
  );

  return testCases;
}

async function updateUserReferences(
  users,
  questions,
  solutions,
  discussions,
  submissions
) {
  for (const user of users) {
    const userQuestions = questions.filter(
      (q) => q.submittedBy.toString() === user._id.toString()
    );

    const userSolutions = solutions.filter(
      (solution) => solution.contributedBy.toString() === user._id.toString()
    );

    const userDiscussions = discussions.filter(
      (d) => d.user.toString() === user._id.toString()
    );

    user.questionContributions = userQuestions.map((q) => q._id);

    user.solutionContributions = userSolutions.map((s) => s._id);

    user.questionsSolved = getRandomElements(questions, 0, 50).map(
      (q) => q._id
    );
    user.comments = userDiscussions.map((d) => d._id);

    if (faker.number.int({ min: 1, max: 10 }) <= 3) {
      const potentialReceivers = users.filter(
        (u) => u._id.toString() !== user._id.toString()
      );

      const selectedReceivers = getRandomElements(
        potentialReceivers,
        1,
        Math.min(3, potentialReceivers.length)
      );

      for (const receiver of selectedReceivers) {
        const request = new Partner({
          sender: user._id,
          receiver: receiver._id,
          status: faker.helpers.arrayElement([
            "Pending",
            "Accepted",
            "Rejected",
          ]),
        });

        if (request.status === "Accepted") {
          user.accountabilityPartner = receiver._id;
          receiver.accountabilityPartner = user._id;
          await receiver.save();
        }

        await request.save();

        user.accountabilityPartnerRequest.push(request._id);
      }
    }

    user.submissions = submissions
      .filter((s) => s.submittedBy.toString() === user._id.toString())
      .map((s) => s._id);

    await user.save();
  }
}

async function seedAccountabilityPartnerRequests(users) {
  const requests = [];
  const numRequests = Math.floor(NUM_USERS * 1);

  for (let i = 0; i < numRequests; i++) {
    const sender = getRandomElement(users);
    const receiver = getRandomElement(
      users.filter((u) => u._id.toString() !== sender._id.toString())
    );

    const existingRequest = await Partner.findOne({
      receiver: receiver._id,
    });

    if (!existingRequest) {
      const request = new Partner({
        sender: sender._id,
        receiver: receiver._id,
        status: faker.helpers.arrayElement(["Pending", "Accepted", "Rejected"]),
      });
      requests.push(request);

      if (request.status === "Accepted") {
        sender.accountabilityPartner = receiver._id;
        receiver.accountabilityPartner = sender._id;
        await sender.save();
        await receiver.save();
      }
    }
  }

  await Partner.insertMany(requests);
  return requests;
}

async function seedSubmissions(questions, users) {
  const submissions = [];
  const submissionIds = [];

  const submissionStatuses = ["Accepted", "Attempted", "Partially Solved"];
  const programmingLanguages = [
    { id: 71, name: "Python" },
    { id: 63, name: "JavaScript" },
    { id: 62, name: "Java" },
    { id: 54, name: "C++" },
    { id: 50, name: "C" },
    { id: 74, name: "Rust" },
    { id: 60, name: "Go" },
  ];

  const generateSubmissionDistribution = (questions) => {
    const distributedSubmissions = [];

    questions.forEach((question) => {
      const baseSubmissions = 30;

      const generateDatePattern = (baseDate) => {
        const patterns = [
          (i) => new Date(baseDate.getTime() + i * 7 * 24 * 60 * 60 * 1000),
          (i) =>
            new Date(
              baseDate.getTime() + Math.pow(i, 2) * 10 * 24 * 60 * 60 * 1000
            ),
          (i) =>
            new Date(
              baseDate.getTime() + Math.random() * 365 * 24 * 60 * 60 * 1000
            ),
        ];

        return patterns[Math.floor(Math.random() * patterns.length)];
      };

      const baseDate = new Date();
      baseDate.setFullYear(baseDate.getFullYear() - 1);
      const datePatter = generateDatePattern(baseDate);

      for (let i = 0; i < baseSubmissions; i++) {
        const language = getRandomElement(programmingLanguages);

        distributedSubmissions.push({
          sourceCode: `
# Sample ${language.name} submission for ${question.title}
def solution(arr):
    ${faker.lorem.lines(5)}
    return result
`,
          language: language.name,
          languageId: language.id,
          submissionDate: datePatter(i),
          status: getRandomElement(submissionStatuses),
          isSolved: faker.datatype.boolean(0.3),
          question: question._id,
          submittedBy: getRandomElement(users)._id,
        });
      }
    });

    return distributedSubmissions;
  };

  const distributedSubmissions = generateSubmissionDistribution(questions);

  const submissionsDocuments = distributedSubmissions.map(
    (submission) => new Submission(submission)
  );

  await Submission.insertMany(submissionsDocuments);

  return submissionsDocuments;
}

async function seedSolutions(questions, users) {
  const solutions = [];
  const codeAnswers = [];

  const languageSpecificCode = {
    "C++": `
#include <iostream>
using namespace std;

int solve(vector<int> &arr) {
    // Solution logic here
    int result = 0;
    for (int i = 0; i < arr.size(); i++) {
        result += arr[i];
    }
    return result;
}
    `,
    C: `
#include <stdio.h>

int solve(int arr[], int size) {
    // Solution logic here
    int result = 0;
    for (int i = 0; i < size; i++) {
        result += arr[i];
    }
    return result;
}
    `,
    JavaScript: `
function solve(arr) {
    // Solution logic here
    let result = 0;
    for (let i = 0; i < arr.length; i++) {
        result += arr[i];
    }
    return result;
}
    `,
    Java: `
import java.util.*;

public class Solution {
    public static int solve(int[] arr) {
        // Solution logic here
        int result = 0;
        for (int i = 0; i < arr.length; i++) {
            result += arr[i];
        }
        return result;
    }
}
    `,
    Python: `
def solve(arr):
    # Solution logic here
    result = sum(arr)
    return result
    `,
    Go: `
package main

func solve(arr []int) int {
    // Solution logic here
    result := 0
    for _, val := range arr {
        result += val
    }
    return result
}
    `,
    Rust: `
fn solve(arr: &[i32]) -> i32 {
    // Solution logic here
    arr.iter().sum()
}
    `,
  };

  for (const question of questions) {
    const numSolutions = 3;

    for (let i = 0; i < numSolutions; i++) {
      const solution = new Solution({
        type: i === 0 ? "Brute Force" : i === 1 ? "Better" : "Optimal",
        heading: `${
          i === 0 ? "Brute Force" : i === 1 ? "Better" : "Optimal"
        } Solution - ${faker.helpers.arrayElement([
          "Time: O(n)",
          "Time: O(n²)",
          "Time: O(log n)",
        ])}`,
        intuition: faker.lorem.paragraph(4),
        approach: faker.lorem.paragraphs(6),
        complexityAnalysis: faker.lorem.paragraph(2),
        contributedBy: getRandomElement(users)._id,
        codeAnswer: [],
      });

      const solutionCodeAnswers = [];
      for (const language of LANGUAGES) {
        const codeAnswer = new CodeAnswer({
          solution: solution._id,
          code: languageSpecificCode[language],
          language: language,
        });

        await codeAnswer.save();
        solutionCodeAnswers.push(codeAnswer._id);
        codeAnswers.push(codeAnswer);
      }

      solution.codeAnswer = solutionCodeAnswers;
      await solution.save();
      solutions.push(solution);
    }

    const solutionIds = solutions.map((sol) => sol._id);
    const selectedIds = solutionIds.slice(0, 3);

    const answer = new Answer({
      question: question._id,
      solutions: selectedIds,
    });

    await Question.findByIdAndUpdate(question._id, {
      answer: answer._id,
    });

    await answer.save();
  }

  return { solutions, codeAnswers };
}

async function seedCodeQuestions(questions) {
  const codeQuestions = [];
  const languageSpecificCode = {
    "C++": `
#include <iostream>
using namespace std;

int solve(vector<int> &arr) {
    // Solution logic here
    int result = 0;
    for (int i = 0; i < arr.size(); i++) {
        result += arr[i];
    }
    return result;
}
    `,
    C: `
#include <stdio.h>

int solve(int arr[], int size) {
    // Solution logic here
    int result = 0;
    for (int i = 0; i < size; i++) {
        result += arr[i];
    }
    return result;
}
    `,
    JavaScript: `
function solve(arr) {
    // Solution logic here
    let result = 0;
    for (let i = 0; i < arr.length; i++) {
        result += arr[i];
    }
    return result;
}
    `,
    Java: `
import java.util.*;

public class Solution {
    public static int solve(int[] arr) {
        // Solution logic here
        int result = 0;
        for (int i = 0; i < arr.length; i++) {
            result += arr[i];
        }
        return result;
    }
}
    `,
    Python: `
def solve(arr):
    # Solution logic here
    result = sum(arr)
    return result
    `,
    Go: `
package main

func solve(arr []int) int {
    // Solution logic here
    result := 0
    for _, val := range arr {
        result += val
    }
    return result
}
    `,
    Rust: `
fn solve(arr: &[i32]) -> i32 {
    // Solution logic here
    arr.iter().sum()
}
    `,
  };

  for (const question of questions) {
    for (const language of LANGUAGES) {
      const codeQuestion = new CodeQuestion({
        question: question._id,
        code: languageSpecificCode[language],
        language: language,
      });
      codeQuestions.push(codeQuestion);
    }
  }

  await CodeQuestion.insertMany(codeQuestions);

  const codeQuestionIds = codeQuestions.map((q) => q._id);
  const randomQuestionIds = codeQuestionIds.slice(0, 6);

  await Question.updateMany(
    {},
    {
      $set: {
        codeQuestion: randomQuestionIds,
      },
    }
  );

  return codeQuestions;
}

async function seedBugReports() {
  const NUM_REPORTS = 50;

  for (let i = 0; i < NUM_REPORTS; i++) {
    const report = new BugReport({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
    });

    await report.save();
  }

  return NUM_REPORTS;
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await Promise.all([
      User.deleteMany({}),
      Question.deleteMany({}),
      Example.deleteMany({}),
      Answer.deleteMany({}),
      Discussion.deleteMany({}),
      Partner.deleteMany({}),
      Solution.deleteMany({}),
      CodeAnswer.deleteMany({}),
      CodeQuestion.deleteMany({}),
      BugReport.deleteMany({}),
    ]);
    console.log("Cleared existing data");

    const users = await seedUsers();
    console.log(`Seeded ${users.length} users`);

    const questions = await seedQuestions(users);
    console.log(`Seeded ${questions.length} questions`);

    const examples = await seedExamples(questions, users);
    console.log(`Seeded ${examples.length} examples`);

    const { solutions, codeAnswers } = await seedSolutions(questions, users);
    console.log(
      `Seeded ${solutions.length} solutions and ${codeAnswers.length} code answers`
    );

    const codeQuestions = await seedCodeQuestions(questions);
    console.log(`Seeded ${codeQuestions.length} code questions`);

    const discussions = await seedDiscussions(questions, users);
    console.log(`Seeded ${discussions.length} discussions`);

    const testCases = await seedTestCases(questions);
    console.log(`Seeded ${testCases.length} test cases`);

    const submissions = await seedSubmissions(questions, users);
    console.log(`Seeded ${submissions.length} submissions`);

    const requests = await seedAccountabilityPartnerRequests(users);
    console.log(`Seeded ${requests.length} accountability partner requests`);

    const bugReports = await seedBugReports();
    console.log(`Seeded ${bugReports.length} bug reports`);

    console.log("Updating user references...");
    await updateUserReferences(
      users,
      questions,
      solutions,
      discussions,
      submissions
    );

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seedDatabase();
