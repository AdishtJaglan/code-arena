import ApiError from "./apiError.js";

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error.",
    });
  }
};

export default asyncHandler;
