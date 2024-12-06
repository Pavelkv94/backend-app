import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { UserRepository } from "../infrastructure/users.repository";
import { container } from "../../../composition.root";

export const findUserMiddleware = (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const userRepository = container.resolve(UserRepository)
  const user = userRepository.findUserById(req.params.id);
  if (!user) {
    return next(ApiError.NotFound("The requested user was not found"));
  }
  next();
};
