import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { container } from "../../../composition.root";
import { UserQueryRepository } from "../../users/infrastructure/users.query-repository";
import { JwtService } from "../../../adapters/jwt/jwt.service";

export const authAccessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const jwtService = container.resolve(JwtService);
  const userQueryRepository = container.resolve(UserQueryRepository);

  if (!req.headers.authorization) {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  const [authType, token] = req.headers.authorization.split(" ");

  if (authType !== "Bearer") {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  const payload = await jwtService.verifyAccessToken(token);

  if (!payload) {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  const user = await userQueryRepository.findUserById(payload.user_id);

  if (!user) {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  req.user = { id: payload.user_id, deviceId: payload.deviceId };

  next();
};
