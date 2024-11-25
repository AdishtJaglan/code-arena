class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong.",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.errors = errors;
    this.stack = stack;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static BadRequest(message = "Bad Request", errors = []) {
    return new ApiError({
      statusCode: 400,
      message,
      errors,
    });
  }

  static Unauthorized(message = "Unauthorized", errors = []) {
    return new ApiError({
      statusCode: 401,
      message,
      errors,
    });
  }

  static Forbidden(message = "Forbidden", errors = []) {
    return new ApiError({
      statusCode: 403,
      message,
      errors,
    });
  }

  static NotFound(message = "Resource not found", errors = []) {
    return new ApiError({
      statusCode: 404,
      message,
      errors,
    });
  }

  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors,
    };
  }
}

export default ApiError;
