import { Response, Request, NextFunction } from "express";
import { ApiLogModel } from "../features/apiLogs/models/apiLog.model";
import { apiLogsService } from "../features/apiLogs/apiLogs.service";

export const apiSaveLogsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const newAPiLog: ApiLogModel = {
    ip: req.ip || "",
    URL: req.originalUrl || req.baseUrl,
    date: new Date(),
  };

  const logId = await apiLogsService.saveLog(newAPiLog);
  if(!logId) {
    console.log("Something wrong with api log saving.")
  }

  next();
};
