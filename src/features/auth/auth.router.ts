import { Router } from "express";
import { authController } from "./auth.controller";
import { authLoginBodyValidators } from "./middlewares/auth-login-body.validator";
import { authTokenMiddleware } from "./middlewares/auth-token.middleware";
import { authRegistrationBodyValidators } from "./middlewares/auth-registration-body.validator";
import { authConfirmBodyValidators } from "./middlewares/auth-confirmation-body.validator";
import { authEmailResendBodyValidators } from "./middlewares/auth-emailResend-body.validator";

export const authRouter = Router();

authRouter.post("/login", authLoginBodyValidators, authController.login);
authRouter.get("/me", authTokenMiddleware, authController.me);
authRouter.post("/registration", authRegistrationBodyValidators, authController.registration);
authRouter.post("/registration-confirmation", authConfirmBodyValidators, authController.registrationConfirmation);
authRouter.post("/registration-email-resending", authEmailResendBodyValidators, authController.registrationEmailResending);
