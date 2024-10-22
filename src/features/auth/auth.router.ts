import { Router } from "express";
import { authController } from "./auth.controller";
import { authLoginBodyValidators } from "./middlewares/auth-login-body.validator";
import { authTokenMiddleware } from "./middlewares/auth-token.middleware";
import { authRegistrationBodyValidators } from "./middlewares/auth-registration-body.validator";

export const authRouter = Router();

authRouter.post("/login", ...authLoginBodyValidators, authController.login);
authRouter.get("/me", authTokenMiddleware, authController.me);
authRouter.post("/registration", ...authRegistrationBodyValidators, authController.registration);
// authRouter.post("/registration-confirmation", authController.registrationConfirmation);
// authRouter.post("/registration-email-resending", authController.registrationEmailResending);
