import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { securityDeviceQueryRepository } from "../repositories/securityDevices.query-repository";

export const findDeviceByParamIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const isDeviceExist = await securityDeviceQueryRepository.findDevice(req.params.id);

  if (!isDeviceExist) {
    return next(ApiError.NotFound("The requested resource was not found"));
  }
  next();
};
