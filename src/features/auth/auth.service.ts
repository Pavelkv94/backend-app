import { JwtTokensType, LoginInputModel } from "./models/auth.models";
import { jwtService } from "../../adapters/jwt/jwt.service";
import { usersRepository } from "../users/users.repository";
import { randomUUID } from "crypto";
import { getExpirationDate } from "../../utils/date/getExpirationDate";
import { usersService } from "../users/users.service";
import { bcryptService } from "../../adapters/bcrypt.service";

export const authService = {
  async login(user_id: string): Promise<JwtTokensType> {
    const tokens = jwtService.generateTokens({ user_id });

    return tokens;
  },
  async refresh(oldRefreshToken: string, user_id: string): Promise<JwtTokensType> {
    await jwtService.addTokenToBlackList(oldRefreshToken);

    const tokens = await jwtService.generateTokens({ user_id });

    return tokens;
  },
  async checkRefreshToken(token: string): Promise<string | null> {
    const payload = await jwtService.verifyRefreshToken(token);

    if (!payload) {
      return null;
    }

    const user = await usersService.findUser(payload.user_id);

    if (!user) {
      return null;
    }

    const isInvalidToken = await jwtService.findTokenInBlackList(token);

    if (!isInvalidToken) {
      return null;
    }
    return user.id;
  },
  async checkUserCredentials(payload: LoginInputModel): Promise<string | null> {
    const user = await usersRepository.findUserByLoginOrEmail(payload.loginOrEmail);

    if (!user) {
      return null;
    }
    const isPasswordValid = await bcryptService.checkPassword(payload.password, user.password);

    if (!isPasswordValid) {
      return null;
    }
    return user._id.toString();
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
