import { Response } from "express";
import { OutputErrorsType } from "../types/output-errors-types";
import { HTTP_STATUSES } from "../types/common-types";

export class ApiError extends Error {
  public statusCode: number;
  public errorsMessages?: Array<{ field: string; message: string }>;

  constructor(statusCode: number, message: string, errorsMessages?: Array<{ field: string; message: string }>) {
    super(message);
    this.statusCode = statusCode;
    this.errorsMessages = errorsMessages;
  }

  static UnexpectedError(error: Error) {
    return new ApiError(HTTP_STATUSES.INTERNAL_ERROR, `An unexpected error occurred. Reason: ${error.message || "unknown"}`);
  }

  static Unauthorized(message = "Unauthorized access") {
    return new ApiError(HTTP_STATUSES.UNAUTHORIZED, message);
  }

  static Forbidden(message = "Forbidden access") {
    return new ApiError(HTTP_STATUSES.FORBIDDEN, message);
  }

  static NotFound(message = "Resource not found") {
    return new ApiError(HTTP_STATUSES.NOT_FOUND, message);
  }

  static BadRequest(message = "Bad Request") {
    return new ApiError(HTTP_STATUSES.BAD_REQUEST, message);
  }
  static TooManyRequests(message = "Too many requests") {
    return new ApiError(HTTP_STATUSES.TOO_MANY_REQUESTS, message);
  }
  static ValidationError(errors: Array<{ field: string; message: string }>) {
    return new ApiError(HTTP_STATUSES.BAD_REQUEST, "Validation failed", errors);
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
