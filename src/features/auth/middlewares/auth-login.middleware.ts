import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { container } from "../../../composition.root";
import { AuthService } from "../auth.service";

export const authLoginMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authService = container.resolve(AuthService)

  const user_id = await authService.checkUserCredentials(req.body);

  if (!user_id) {
    return next(ApiError.Unauthorized());
  }

  req.user = { id: user_id, deviceId: "" };

  next();
};
