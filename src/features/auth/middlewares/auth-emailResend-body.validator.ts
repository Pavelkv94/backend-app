import { body } from "express-validator";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrors.middleware";
import { userQueryRepository } from "../../users/infrastructure/users.query-repository";

const userEmailInputValidator = body("email")
  .isString()
  .withMessage("not string")
  .trim()
  .isEmail()
  .withMessage("Invalid email")
  .custom(async (email) => {
    const emailConfirmation = await userQueryRepository.findEmailConfirmationByEmail(email);

    if (!emailConfirmation) {
      throw new Error("User not exist");
    }

    if (emailConfirmation.isConfirmed) {
      throw new Error("Email is already confirmed");
    }
    return true;
  });

export const authEmailResendBodyValidators = [userEmailInputValidator, inputCheckErrorsMiddleware];
