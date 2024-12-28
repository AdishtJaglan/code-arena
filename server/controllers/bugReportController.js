import BugReport from "../models/BugReport.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const getAllBugReports = asyncHandler(async (req, res) => {
  const bugReports = await BugReport.find().lean();

  if (!bugReports) {
    throw ApiError.NotFound("No bug reports found.");
  }

  return ApiResponse.Ok("Fetched all bug reports.", {
    count: bugReports.length,
    bugReports,
  }).send(res);
});

export const createBugReport = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw ApiError.BadRequest("Title and description are required.");
  }

  const bugReport = await BugReport.create({ title, description });

  return ApiResponse.Created("Bug report created.", bugReport).send(res);
});
