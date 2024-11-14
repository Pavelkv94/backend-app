import { NextFunction, Request, Response } from "express";
import { ConfirmationInputModel, EmailResendInputModel, LoginInputModel, LoginOutputModel, AdditionalQueryInputModel, MeViewModel } from "./models/auth.models";
import { authService } from "./auth.service";
import { usersQueryRepository } from "../users/users.query-repository";
import { ApiError } from "../../exeptions/api-error";
import { nodemailerService } from "../../adapters/mail.service";
import { UserInputModel } from "../users/models/users.models";
import { usersService } from "../users/users.service";
import { HTTP_STATUSES } from "../../types/common-types";
import { jwtService } from "../../adapters/jwt/jwt.service";
import { securityDevicesService } from "../securityDevices/securityDevices.service";

export const authController = {
  async login(req: Request<{}, {}, LoginInputModel, AdditionalQueryInputModel>, res: Response<LoginOutputModel>, next: NextFunction) {
    try {
      const { accessToken, refreshToken } = await authService.login(req.user.id, req.ip, req.headers["user-agent"]);

      res.cookie("refreshToken", refreshToken, { secure: true, httpOnly: true });
      res.status(HTTP_STATUSES.SUCCESS).send({ accessToken });
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async refresh(req: Request, res: Response<LoginOutputModel>, next: NextFunction) {
    try {
      const { accessToken, refreshToken } = await authService.refresh(req.ip, req.headers["user-agent"], req.user.id, req.user.deviceId);

      res.cookie("refreshToken", refreshToken, { secure: true, httpOnly: true });
      res.status(HTTP_STATUSES.SUCCESS).send({ accessToken });
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async me(req: Request, res: Response<MeViewModel>, next: NextFunction) {
    const user = await usersQueryRepository.findMe(req.user.id);

    if (!user) {
      return next(ApiError.NotFound("The requested user was not found"));
    }

    res.status(HTTP_STATUSES.SUCCESS).send(user);
  },
  async registration(req: Request<{}, {}, UserInputModel>, res: Response, next: NextFunction) {
    try {
      const userId = await usersService.create(req.body);
      const emailConfirmation = await usersQueryRepository.findEmailConfirmationByUser(userId);

      if (!userId || !emailConfirmation) {
        return next(ApiError.NotFound("The requested user was not found"));
      }
      if (userId) {
        nodemailerService.sendLetter(req.body.email, emailConfirmation.confirmationCode).catch((e) => console.log(e)); //долгий запрос с await
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async registrationConfirmation(req: Request<{}, {}, ConfirmationInputModel>, res: Response, next: NextFunction) {
    try {
      const user = await usersQueryRepository.findUserByEmailConfirmation(req.body.code);

      if (!user) {
        return next(ApiError.NotFound("The requested user was not found or code invalid"));
      }

      await authService.setConfirmEmailStatus(user._id.toString(), true);
      res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async registrationEmailResending(req: Request<{}, {}, EmailResendInputModel>, res: Response, next: NextFunction) {
    try {
      const user = await usersQueryRepository.findUserByEmail(req.body.email);
      if (!user) {
        return next(ApiError.NotFound("The requested user was not found or email invalid"));
      }

      const newConfirmationCode = await authService.setNewConfirmCode(user._id.toString());

      nodemailerService.sendLetter(req.body.email, newConfirmationCode).catch((e) => console.log(e)); //долгий запрос с await

      res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async logout(req: Request<{}, {}, LoginInputModel>, res: Response<LoginOutputModel>, next: NextFunction) {
    try {
      await securityDevicesService.deleteSecurityDevice(req.user.deviceId, req.user.id);

      res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
};
