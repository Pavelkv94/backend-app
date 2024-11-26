import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { authService } from "../auth.service";

export const authLoginMiddleware = async (req: Request, res: Response, next: NextFunction) => {

  const user_id = await authService.checkUserCredentials(req.body);

  if (!user_id) {
    return next(ApiError.Unauthorized());
  }

  req.user = { id: user_id, deviceId: "" };

  next();
};
