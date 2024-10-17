import { body } from "express-validator";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrors.middleware";

const loginOrEmail = body("loginOrEmail").notEmpty().withMessage("loginOrEmail is required").isString().withMessage("not string");
const password = body("password").notEmpty().withMessage("password is required").isString().withMessage("not string");

export const authBodyValidators = [loginOrEmail, password, inputCheckErrorsMiddleware];
