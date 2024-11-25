//! things you would like to implement
//TODO -> create custom libraries of questions
//TODO -> liked questions
//TODO -> security deposit thingy on achieving goals

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import passport from "./config/passport.js";
import morgan from "morgan";

import { ENV } from "./config/env-config.js";

import userRoutes from "./routes/userRoutes.js";
import accountabilityPartnerRequestRoutes from "./routes/accountabilityPartnerRequestRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import exampleRoutes from "./routes/exampleRoutes.js";
import testCaseRoutes from "./routes/testCaseRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";
import discussionRoutes from "./routes/discussionRoutes.js";

mongoose
  .connect(ENV.DB_URL || "mongodb://localhost:27017/codeIt")
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Error connected to DB:" + error.message);
  });

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use("/api/user", userRoutes);
app.use("/api/partner", accountabilityPartnerRequestRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/example", exampleRoutes);
app.use("/api/test-case", testCaseRoutes);
app.use("/api/answer", answerRoutes);
app.use("/api/discussion", discussionRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome" });
});

app.listen(ENV.PORT, () => {
  console.log(`Listening on port ${ENV.PORT}`);
});
