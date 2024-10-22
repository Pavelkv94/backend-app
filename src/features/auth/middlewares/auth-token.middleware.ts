import { NextFunction, Request, Response } from "express";
import { jwtService } from "../../../adapters/jwt.service";
import { usersQueryRepository } from "../../users/users.query-repository";
import { ApiError } from "../../../exeptions/api-error";

export const authTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  const [authType, token] = req.headers.authorization.split(" ");

  if (authType !== "Bearer") {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  const payload = await jwtService.verifyToken(token);

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
