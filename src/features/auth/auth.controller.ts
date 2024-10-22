import { NextFunction, Request, Response } from "express";
import { LoginInputModel, LoginOutputModel, MeViewModel } from "./models/auth.models";
import { authService } from "./auth.service";
import { usersQueryRepository } from "../users/users.query-repository";
import { ApiError } from "../../exeptions/api-error";
import { nodemailerService } from "../../adapters/mail.service";
import { UserInputModel } from "../users/models/users.models";
import { usersService } from "../users/users.service";

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
  async registration(req: Request<{}, {}, UserInputModel>, res: Response, next: NextFunction) {
    try {
      const userId = await usersService.create(req.body);

      if (userId) {
        await nodemailerService.sendLetter(req.body);
      }

      res.sendStatus(204);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
};
