import { body } from "express-validator";
import { usersQueryRepository } from "../../users/users.query-repository";
import { hasDateExpired } from "../../../utils/date/hasDateExpired";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrors.middleware";

const code = body("code").custom(async (code) => {
  const user = await usersQueryRepository.findUserByEmailConfirmation(code);

  if (!user) {
    throw new Error("The requested user was not found or code invalid");
  }

  if (user.emailConfirmation.isConfirmed) {
    throw new Error("Email is already confirmed");
  }

  if (hasDateExpired(user.emailConfirmation.expirationDate)) {
    throw new Error("Your activation link is expired. Resend activation email.");
  }
  return true;
});

export const authConfirmBodyValidators = [code, inputCheckErrorsMiddleware];
