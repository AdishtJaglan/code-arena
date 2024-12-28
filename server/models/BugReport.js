import mongoose from "mongoose";

const BugReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const BugReport = mongoose.model("BugReport", BugReportSchema);
export default BugReport;
