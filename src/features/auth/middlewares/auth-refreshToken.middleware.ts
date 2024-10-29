import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../../adapters/jwt/jwt.service";
import { usersQueryRepository } from "../../users/users.query-repository";
import { ApiError } from "../../../exeptions/api-error";
import { jwtRepository } from "../../../adapters/jwt/jwt.repository";

export const authRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  const isInvalidToken = await jwtRepository.findInBlackList(token);

  if (isInvalidToken) {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  const payload = await jwtService.verifyRefreshToken(token);

  if (!payload) {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  const user = await usersQueryRepository.findUser(payload.user_id);

  if (!user) {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  req.user = { id: payload.user_id };

  next();
};
