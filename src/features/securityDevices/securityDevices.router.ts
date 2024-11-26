import { Router } from "express";
import { securityDeviceController } from "./securityDevices.controller";
import { authRefreshTokenMiddleware } from "../auth/middlewares/auth-refreshToken.middleware";
import { findDeviceByParamIdMiddleware } from "./middlewares/findDeviceByParamId.middleware";

export const securityDevicesRouter = Router();

securityDevicesRouter.get("/devices", authRefreshTokenMiddleware, securityDeviceController.getSecurityDevices.bind(securityDeviceController));
securityDevicesRouter.delete("/devices", authRefreshTokenMiddleware, securityDeviceController.deleteOtherDevices.bind(securityDeviceController));
securityDevicesRouter.delete(
  "/devices/:id",
  authRefreshTokenMiddleware,
  findDeviceByParamIdMiddleware,
  securityDeviceController.deleteDevice.bind(securityDeviceController)
);
