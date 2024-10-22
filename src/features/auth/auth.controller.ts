import { NextFunction, Request, Response } from "express";
import { LoginInputModel, LoginOutputModel, MeViewModel } from "./models/auth.models";
import { authService } from "./auth.service";
import { usersQueryRepository } from "../users/users.query-repository";
import { ApiError } from "../../exeptions/api-error";

export const authController = {
  async login(req: Request<{}, {}, LoginInputModel>, res: Response<LoginOutputModel>, next: NextFunction) {
    const accessToken = await authService.checkCredentials(req.body);

    if (!accessToken) {
      return next(ApiError.Unauthorized("Unauthorized access"));
    }

    res.status(200).send({ accessToken });
  },
  async me(req: Request, res: Response<MeViewModel>, next: NextFunction) {
    const user = await usersQueryRepository.findMe(req.user.id);

    if (!user) {
      return next(ApiError.NotFound("The requested user was not found"));
    }

    res.status(200).send(user);
  },
};
