import express from "express";
import mongoose from "mongoose";
import passport from "./config/passport.js";
import morgan from "morgan";

import userRoutes from "./routes/userRoutes.js";

mongoose
  .connect("mongodb://localhost:27017/codeIt")
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Error connected to DB:" + error.message);
  });

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use("/auth", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome" });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
