class ApiResponse {
  constructor(statusCode, message = "Success", data = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = true;
  }

  static Ok(message = "Success", data = null) {
    return new ApiResponse(200, message, data);
  }

  static Created(message = "Resource created successfully", data = null) {
    return new ApiResponse(201, message, data);
  }

  static Accepted(message = "Request accepted", data = null) {
    return new ApiResponse(202, message, data);
  }

  static NoContent(message = "No content", data = null) {
    return new ApiResponse(204, message, data);
  }

  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      ...(this.data && { data: this.data }),
    });
  }
}

export default ApiResponse;
