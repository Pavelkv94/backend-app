import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { apiLogsService } from "../../apiLogs/apiLogs.service";
import { ApiLogInputModel } from "../../apiLogs/models/apiLog.model";

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const newAPiLog: ApiLogInputModel = {
    ip: req.ip || "",
    URL: req.originalUrl || req.baseUrl,
    date: new Date(),
  };

  const logId = await apiLogsService.saveLog(newAPiLog);
  if (!logId) {
    console.log("Something wrong with api log saving.");
  }

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
