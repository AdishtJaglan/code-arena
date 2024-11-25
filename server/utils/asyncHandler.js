const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    return res.status(error?.code || 500).json({
      success: false,
      message: error?.message || "Internal server error.",
    });
  }
};

export default asyncHandler;
