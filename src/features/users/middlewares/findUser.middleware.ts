import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { userRepository } from "../infrastructure/users.repository";

export const findUserMiddleware = (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const user = userRepository.findUserById(req.params.id);
  if (!user) {
    return next(ApiError.NotFound("The requested user was not found"));
  }
  next();
};
