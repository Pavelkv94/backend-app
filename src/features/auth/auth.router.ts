import { Router } from "express";
import { authLoginBodyValidators } from "./middlewares/auth-login-body.validator";
import { authAccessTokenMiddleware } from "./middlewares/auth-accessToken.middleware";
import { authRegistrationBodyValidators } from "./middlewares/auth-registration-body.validator";
import { authConfirmBodyValidators } from "./middlewares/auth-confirmation-body.validator";
import { authEmailResendBodyValidators } from "./middlewares/auth-emailResend-body.validator";
import { authRefreshTokenMiddleware } from "./middlewares/auth-refreshToken.middleware";
import { authLoginMiddleware } from "./middlewares/auth-login.middleware";
import { rateLimiterMiddleware } from "./middlewares/auth-rateLimiter.middleware";
import { authEmailValidators } from "./middlewares/auth-email.validator";
import { authRecoveryBodyValidators } from "./middlewares/auth-recovery.validator";
import { container } from "../../composition.root";
import { AuthController } from "./auth.controller";

export const authRouter = Router();

const authController = container.resolve(AuthController)

authRouter.post("/login", rateLimiterMiddleware, authLoginBodyValidators, authLoginMiddleware, authController.login.bind(authController));
authRouter.post("/refresh-token", authRefreshTokenMiddleware, authController.refresh.bind(authController));
authRouter.get("/me", authAccessTokenMiddleware, authController.me.bind(authController));
authRouter.post("/registration", authRegistrationBodyValidators, rateLimiterMiddleware, authController.registration.bind(authController));
authRouter.post("/registration-confirmation", rateLimiterMiddleware, authConfirmBodyValidators, authController.registrationConfirmation.bind(authController));
authRouter.post("/registration-email-resending", authEmailResendBodyValidators, rateLimiterMiddleware, authController.registrationEmailResending.bind(authController));
authRouter.post("/logout", authRefreshTokenMiddleware, authController.logout.bind(authController));
authRouter.post("/password-recovery", rateLimiterMiddleware, authEmailValidators, authController.passwordRecovery.bind(authController));
authRouter.post("/new-password", rateLimiterMiddleware, authRecoveryBodyValidators, authController.setNewPassword.bind(authController));
