import { JwtTokensType, LoginInputModel } from "./models/auth.models";
import { bcryptService } from "../../adapters/bcrypt.service";
import { jwtService } from "../../adapters/jwt/jwt.service";
import { usersRepository } from "../users/users.repository";
import { randomUUID } from "crypto";
import { getExpirationDate } from "../../utils/date/getExpirationDate";
import { ApiError } from "../../exeptions/api-error";

export const authService = {
  async login(payload: LoginInputModel): Promise<JwtTokensType> {
    const user = await usersRepository.findUserByLoginOrEmail(payload.loginOrEmail);

    if (!user) {
      throw ApiError.NotFound("User not found");
    }

    const isPasswordValid = await bcryptService.checkPassword(payload.password, user.password);

    if (!isPasswordValid) {
      throw ApiError.BadRequest("Password is incorrect");
    }

    const tokens = jwtService.generateTokens({ user_id: user._id.toString() });

    return tokens;
  },
  async setConfirmEmailStatus(user_id: string, status: boolean): Promise<boolean> {
    const isChanged = await usersRepository.setConfirmEmailStatus(user_id, true);

    return isChanged;
  },
  async setNewConfirmCode(user_id: string): Promise<string> {
    const newConfirmationCode = randomUUID();
    const newExpirationDate = getExpirationDate(30);

    const isUpdatedUserConfirmation = await usersRepository.setConfirmCode(user_id, newConfirmationCode, newExpirationDate);

    if (!isUpdatedUserConfirmation) {
      throw new Error("Update User confirmation Failed");
    }
    return newConfirmationCode;
  },
};
