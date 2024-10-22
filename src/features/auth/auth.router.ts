import { Router } from "express";
import { authController } from "./auth.controller";
import { authBodyValidators } from "./middlewares/auth-body.validator";
import { authTokenMiddleware } from "./middlewares/auth-token.middleware";

export const authRouter = Router();

authRouter.post("/login", authBodyValidators, authController.login);
authRouter.get("/me", authTokenMiddleware, authController.me);
