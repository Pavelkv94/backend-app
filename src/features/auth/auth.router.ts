import { Router } from "express";
import { authController } from "./auth.controller";
import { authLoginBodyValidators } from "./middlewares/auth-login-body.validator";
import { authAccessTokenMiddleware } from "./middlewares/auth-accessToken.middleware";
import { authRegistrationBodyValidators } from "./middlewares/auth-registration-body.validator";
import { authConfirmBodyValidators } from "./middlewares/auth-confirmation-body.validator";
import { authEmailResendBodyValidators } from "./middlewares/auth-emailResend-body.validator";
import { authRefreshTokenMiddleware } from "./middlewares/auth-refreshToken.middleware";
import { authLoginMiddleware } from "./middlewares/auth-login.middleware";

export const authRouter = Router();

authRouter.post("/login", authLoginBodyValidators, authLoginMiddleware, authController.login);
authRouter.post("/refresh-token", authRefreshTokenMiddleware, authController.refresh);
authRouter.get("/me", authAccessTokenMiddleware, authController.me);
authRouter.post("/registration", authRegistrationBodyValidators, authController.registration);
authRouter.post("/registration-confirmation", authConfirmBodyValidators, authController.registrationConfirmation);
authRouter.post("/registration-email-resending", authEmailResendBodyValidators, authController.registrationEmailResending);
authRouter.post("/logout", authRefreshTokenMiddleware, authController.logout);
