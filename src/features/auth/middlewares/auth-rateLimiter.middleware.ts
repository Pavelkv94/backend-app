import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { apiLogsService } from "../../apiLogs/apiLogs.service";

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const rateLimitOptions = {
    ip: req.ip || "",
    baseUrl: req.originalUrl || req.baseUrl,
    limit: 5, //attempts
    rate: 10, //time interval
  };

  const isAllowedRequest = await apiLogsService.checkRateLimit(rateLimitOptions);

  if (!isAllowedRequest) {
    return next(ApiError.TooManyRequests());
  }
  next();
};
