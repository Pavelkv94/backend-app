import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { SecurityDeviceQueryRepository } from "../repositories/securityDevices.query-repository";
import { container } from "../../../composition.root";

export const findDeviceByParamIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const securityDeviceQueryRepository = container.resolve(SecurityDeviceQueryRepository);
  const isDeviceExist = await securityDeviceQueryRepository.findDevice(req.params.id);

  if (!isDeviceExist) {
    return next(ApiError.NotFound("The requested resource was not found"));
  }
  next();
};
