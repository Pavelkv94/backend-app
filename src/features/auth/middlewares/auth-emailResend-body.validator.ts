import { body } from "express-validator";
import { usersQueryRepository } from "../../users/users.query-repository";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrors.middleware";

const userEmailInputValidator = body("email")
  .isString()
  .withMessage("not string")
  .trim()
  .isEmail()
  .withMessage("Invalid email")
  .custom(async (email) => {
    const user = await usersQueryRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("User not exist");
    }
    if (user.emailConfirmation.isConfirmed) {
      throw new Error("Email is already confirmed");
    }
    return true;
  });

export const authEmailResendBodyValidators = [userEmailInputValidator, inputCheckErrorsMiddleware];
