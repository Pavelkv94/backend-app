import { Router } from "express";
import { securityDevicesController } from "./securityDevices.controller";
import { authRefreshTokenMiddleware } from "../auth/middlewares/auth-refreshToken.middleware";
import { findDeviceByParamIdMiddleware } from "./middlewares/findDeviceByParamId.middleware";

export const securityDevicesRouter = Router();

securityDevicesRouter.get("/devices", authRefreshTokenMiddleware, securityDevicesController.getSecurityDevices);
securityDevicesRouter.delete("/devices", authRefreshTokenMiddleware, securityDevicesController.deleteOtherDevices);
securityDevicesRouter.delete("/devices/:id", authRefreshTokenMiddleware, findDeviceByParamIdMiddleware, securityDevicesController.deleteDevice);
