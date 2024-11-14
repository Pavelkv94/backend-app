import { JwtTokensType, LoginInputModel } from "./models/auth.models";
import { jwtService } from "../../adapters/jwt/jwt.service";
import { usersRepository } from "../users/users.repository";
import { randomUUID } from "crypto";
import { getExpirationDate } from "../../utils/date/getExpirationDate";
import { usersService } from "../users/users.service";
import { bcryptService } from "../../adapters/bcrypt.service";
import { securityDevicesService } from "../securityDevices/securityDevices.service";
import { JWTPayloadModel } from "../../adapters/jwt/models/jwt.models";
import { securityDevicesRepository } from "../securityDevices/securityDevices.repository";

export const authService = {
  async login(user_id: string, ip: string = "", userAgent: string = ""): Promise<JwtTokensType> {
    const tokens = await jwtService.generateTokens({ user_id, deviceId: randomUUID() });
    const refreshToken: JWTPayloadModel = await jwtService.decodeToken(tokens.refreshToken);
    await securityDevicesService.addDevice(refreshToken, ip, userAgent);

    return tokens;
  },
  async refresh(ip: string = "", userAgent: string = "", user_id: string, deviceId: string): Promise<JwtTokensType> {
    const tokens = await jwtService.generateTokens({ user_id, deviceId });
    const refreshToken: JWTPayloadModel = await jwtService.decodeToken(tokens.refreshToken);
    await securityDevicesService.updateDevice(refreshToken, ip, userAgent);

    return tokens;
  },
  async checkRefreshToken(token: string): Promise<{ user_id: string; deviceId: string } | null> {
    const payload = await jwtService.verifyRefreshToken(token);

    if (!payload) {
      return null;
    }

    const user = await usersService.findUser(payload.user_id);

    if (!user) {
      return null;
    }

    const isSessionExists = await this.checkSessionVersion(payload);

    if (!isSessionExists) {
      return null;
    }

    return { user_id: payload.user_id, deviceId: payload.deviceId };
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
  async checkSessionVersion(payload: JWTPayloadModel) {
    const isSessionExists = await securityDevicesRepository.checkSession(payload);

    return isSessionExists;
  },
};
