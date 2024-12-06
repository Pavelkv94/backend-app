import { NextFunction, Request, Response } from "express";
import {
  ConfirmationInputModel,
  EmailResendInputModel,
  LoginInputModel,
  LoginOutputModel,
  AdditionalQueryInputModel,
  MeViewModel,
  RecoveryPasswordInputModel,
} from "./models/auth.models";
import { AuthService } from "./auth.service";
import { ApiError } from "../../exeptions/api-error";
import { NodemailerService } from "../../adapters/mail.service";
import { HTTP_STATUSES } from "../../types/common-types";
import { SecurityDeviceService } from "../securityDevices/securityDevices.service";
import { UserQueryRepository } from "../users/infrastructure/users.query-repository";
import { UserInputModel } from "../users/domain/users.models";
import { injectable } from "inversify";

@injectable()
export class AuthController {
  constructor(
    private userQueryRepository: UserQueryRepository,
    public authService: AuthService,
    public securityDevicesService: SecurityDeviceService,
    private nodemailerService: NodemailerService
  ) {}

  async login(req: Request<{}, {}, LoginInputModel, AdditionalQueryInputModel>, res: Response<LoginOutputModel>, next: NextFunction) {
    try {
      const { accessToken, refreshToken } = await this.authService.login(req.user.id, req.ip, req.headers["user-agent"]);

      res.cookie("refreshToken", refreshToken, { secure: true, httpOnly: true });
      res.status(HTTP_STATUSES.SUCCESS).send({ accessToken });
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
  async refresh(req: Request, res: Response<LoginOutputModel>, next: NextFunction) {
    try {
      const { accessToken, refreshToken } = await this.authService.refresh(req.ip, req.headers["user-agent"], req.user.id, req.user.deviceId);

      res.cookie("refreshToken", refreshToken, { secure: true, httpOnly: true });
      res.status(HTTP_STATUSES.SUCCESS).send({ accessToken });
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
  async me(req: Request, res: Response<MeViewModel>, next: NextFunction) {
    const user = await this.userQueryRepository.findMe(req.user.id);

    if (!user) {
      return next(ApiError.NotFound("The requested user was not found"));
    }

    res.status(HTTP_STATUSES.SUCCESS).send(user);
  }
  async registration(req: Request<{}, {}, UserInputModel>, res: Response, next: NextFunction) {
    try {
      const confirmationCode = await this.authService.registration(req.body);

      if (!confirmationCode) {
        return next(ApiError.NotFound("The requested user was not found"));
      }
      if (confirmationCode) {
        this.nodemailerService.sendLetter(req.body.email, confirmationCode, "activationAcc").catch((e) => console.log(e)); //долгий запрос с await
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
  async registrationConfirmation(req: Request<{}, {}, ConfirmationInputModel>, res: Response, next: NextFunction) {
    try {
      const user = await this.userQueryRepository.findUserByConfirmationCode(req.body.code);

      if (!user) {
        return next(ApiError.NotFound("The requested user was not found or code invalid"));
      }

      await this.authService.setConfirmEmailStatus(user.id, true);
      res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
  async registrationEmailResending(req: Request<{}, {}, EmailResendInputModel>, res: Response, next: NextFunction) {
    try {
      const user = await this.userQueryRepository.findUserByEmail(req.body.email);
      if (!user) {
        return next(ApiError.NotFound("The requested user was not found or email invalid"));
      }

      const newConfirmationCode = await this.authService.setNewConfirmCode(user.id);

      this.nodemailerService.sendLetter(req.body.email, newConfirmationCode, "activationAcc").catch((e) => console.log(e)); //долгий запрос с await

      res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
  async logout(req: Request<{}, {}, LoginInputModel>, res: Response<LoginOutputModel>, next: NextFunction) {
    try {
      await this.securityDevicesService.deleteSecurityDevice(req.user.deviceId, req.user.id);

      res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
  async passwordRecovery(req: Request<{}, {}, EmailResendInputModel>, res: Response, next: NextFunction) {
    try {
      const user = await this.userQueryRepository.findUserByEmail(req.body.email);

      if (!user) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
        return;
      }

      const newConfirmationCode = await this.authService.setNewRecoveryCode(user.id);

      this.nodemailerService.sendLetter(req.body.email, newConfirmationCode, "recoveryPass").catch((e) => console.log(e)); //долгий запрос с await

      res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
  async setNewPassword(req: Request<{}, {}, RecoveryPasswordInputModel>, res: Response<LoginOutputModel>, next: NextFunction) {
    try {
      const isUpdated = await this.authService.setNewPassword(req.body.recoveryCode, req.body.newPassword);

      if (!isUpdated) {
        throw new Error("Update User password Failed");
      }
      res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
}
