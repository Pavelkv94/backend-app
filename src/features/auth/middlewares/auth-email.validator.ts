import { body } from "express-validator";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrors.middleware";

const userEmailInputValidator = body("email").isString().withMessage("not string").trim().isEmail().withMessage("Invalid email");

export const authEmailValidators = [userEmailInputValidator, inputCheckErrorsMiddleware];
