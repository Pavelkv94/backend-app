import { Router } from "express";
import { authRefreshTokenMiddleware } from "../auth/middlewares/auth-refreshToken.middleware";
import { findDeviceByParamIdMiddleware } from "./middlewares/findDeviceByParamId.middleware";
import { container } from "../../composition.root";
import { SecurityDeviceController } from "./securityDevices.controller";

export const securityDevicesRouter = Router();

const securityDeviceController = container.resolve(SecurityDeviceController);

securityDevicesRouter.get("/devices", authRefreshTokenMiddleware, securityDeviceController.getSecurityDevices.bind(securityDeviceController));
securityDevicesRouter.delete("/devices", authRefreshTokenMiddleware, securityDeviceController.deleteOtherDevices.bind(securityDeviceController));
securityDevicesRouter.delete(
  "/devices/:id",
  authRefreshTokenMiddleware,
  findDeviceByParamIdMiddleware,
  securityDeviceController.deleteDevice.bind(securityDeviceController)
);
