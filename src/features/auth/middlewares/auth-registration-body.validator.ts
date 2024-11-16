import { body } from "express-validator";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrors.middleware";
import { isUserUniqueField } from "../../users/middlewares/user-body.validator";

const login = body("login")
  .notEmpty()
  .withMessage("login is required")
  .isString()
  .withMessage("not string")
  .isLength({ min: 3, max: 10 })
  .withMessage("must be from 3 to 10 symbols")
  .custom(async (login) => {
    const isUnique = await isUserUniqueField({ login });
    if (!isUnique) {
      throw new Error("Login must be unique");
    }
    return true;
  });
  
const password = body("password")
  .notEmpty()
  .withMessage("password is required")
  .isString()
  .withMessage("not string")
  .isLength({ min: 6, max: 20 })
  .withMessage("must be from 6 to 20 symbols");

const userEmailInputValidator = body("email")
  .isString()
  .withMessage("not string")
  .trim()
  .isEmail()
  .withMessage("Invalid email")
  .custom(async (email) => {
    const isUnique = await isUserUniqueField({ email });
    if (!isUnique) {
      throw new Error("Email must be unique");
    }
    return true;
  });

export const authRegistrationBodyValidators = [login, password, userEmailInputValidator, inputCheckErrorsMiddleware];
