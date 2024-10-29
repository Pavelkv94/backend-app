import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { usersRepository } from "../../users/users.repository";
import { bcryptService } from "../../../adapters/bcrypt.service";

export const authLoginMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const user = await usersRepository.findUserByLoginOrEmail(req.body.loginOrEmail);

  if (!user) {
    return next(ApiError.Unauthorized());
  }

  const isPasswordValid = await bcryptService.checkPassword(req.body.password, user.password);

  if (!isPasswordValid) {
    return next(ApiError.Unauthorized());
  }

  next();
};
