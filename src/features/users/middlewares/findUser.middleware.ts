import { NextFunction, Request, Response } from "express";
import { userRepository } from "../repositories/users.repository";
import { ApiError } from "../../../exeptions/api-error";

export const findUserMiddleware = (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const userId = userRepository.findUserById(req.params.id);
  if (!userId) {
    return next(ApiError.NotFound("The requested user was not found"));
  }
  next();
};
