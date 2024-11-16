import { body } from "express-validator";
import { usersQueryRepository } from "../../users/users.query-repository";
import { hasDateExpired } from "../../../utils/date/hasDateExpired";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrors.middleware";

const code = body("recoveryCode").custom(async (code) => {
  const user = await usersQueryRepository.findUserByRecoveryCode(code);

  if (!user) {
    throw new Error("The requested user was not found or code invalid");
  }

  if (hasDateExpired(user.recoveryConfirmation.expirationDate)) {
    throw new Error("Your recovery link is expired. Resend recovery email.");
  }
  return true;
});

const password = body("newPassword")
  .notEmpty()
  .withMessage("password is required")
  .isString()
  .withMessage("not string")
  .isLength({ min: 6, max: 20 })
  .withMessage("must be from 6 to 20 symbols");

export const authRecoveryBodyValidators = [password, code, inputCheckErrorsMiddleware];
