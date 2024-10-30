import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { authService } from "../auth.service";
import { jwtService } from "../../../adapters/jwt/jwt.service";

export const authLoginMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.refreshToken;

  if (token) {
    await jwtService.addTokenToBlackList(token);
  }

  const user_id = await authService.checkUserCredentials(req.body);

  if (!user_id) {
    return next(ApiError.Unauthorized());
  }

  req.user = { id: user_id };

  next();
};
