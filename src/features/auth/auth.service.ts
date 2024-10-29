import { JwtTokensType, LoginInputModel } from "./models/auth.models";
import { bcryptService } from "../../adapters/bcrypt.service";
import { jwtService } from "../../adapters/jwt/jwt.service";
import { usersRepository } from "../users/users.repository";
import { randomUUID } from "crypto";
import { getExpirationDate } from "../../utils/date/getExpirationDate";
import { ApiError } from "../../exeptions/api-error";

export const authService = {
  async login(user_id: string): Promise<JwtTokensType> {
    const tokens = jwtService.generateTokens({ user_id });

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
