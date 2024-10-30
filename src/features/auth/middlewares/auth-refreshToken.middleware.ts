import { NextFunction, Request, Response } from "express";
import { usersQueryRepository } from "../../users/users.query-repository";
import { ApiError } from "../../../exeptions/api-error";
import { authService } from "../auth.service";

export const authRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  const user_id = await authService.checkRefreshToken(token);

  if (!user_id) {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  req.user = { id: user_id };

  next();
};
