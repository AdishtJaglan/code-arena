import express from "express";
import mongoose from "mongoose";

mongoose
  .connect("mongodb://localhost:27017/codeIt")
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Error connected to DB:" + error.message);
  });

const app = express();

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
