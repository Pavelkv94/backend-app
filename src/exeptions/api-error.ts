import { Response } from "express";
import { OutputErrorsType } from "../types/output-errors-types";

export class ApiError extends Error {
  public statusCode: number;
  public errorsMessages?: Array<{ field: string; message: string }>;

  constructor(statusCode: number, message: string, errorsMessages?: Array<{ field: string; message: string }>) {
    super(message);
    this.statusCode = statusCode;
    this.errorsMessages = errorsMessages;
  }

  static UnexpectedError(error: Error) {
    return new ApiError(500, `An unexpected error occurred. Reason: ${error.message || "unknown"}`);
  }

  static Unauthorized(message = "Unauthorized access") {
    return new ApiError(401, message);
  }

  static Forbidden(message = "Forbidden access") {
    return new ApiError(403, message);
  }

  static NotFound(message = "Resource not found") {
    return new ApiError(404, message);
  }

  static ValidationError(errors: Array<{ field: string; message: string }>) {
    return new ApiError(400, "Validation failed", errors);
  }

  public send(res: Response) {
    const responseBody: OutputErrorsType = {
      errorsMessages: this.errorsMessages || [],
    };

    if (this.statusCode !== 400) {
      responseBody.message = this.message;
    }

    res.status(this.statusCode).json(responseBody);
  }
}
