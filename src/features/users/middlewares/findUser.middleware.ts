import { NextFunction, Request, Response } from "express";
import { usersRepository } from "../users.repository";
import { ApiError } from "../../../exeptions/api-error";

export const findUserMiddleware = (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const isUserExist = usersRepository.findUser(req.params.id);
  if (!isUserExist) {
    return next(ApiError.NotFound("The requested user was not found"));
  }
  next();
};
