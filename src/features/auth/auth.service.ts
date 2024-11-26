import { JwtTokensType, LoginInputModel } from "./models/auth.models";
import { JwtService, jwtService } from "../../adapters/jwt/jwt.service";
import { randomUUID } from "crypto";
import { getExpirationDate } from "../../utils/date/getExpirationDate";
import { bcryptService } from "../../adapters/bcrypt.service";
import { securityDeviceService } from "../securityDevices/securityDevices.service";
import { JWTPayloadModel } from "../../adapters/jwt/models/jwt.models";
import { UserService, userService } from "../users/users.service";
import { UserRepository, userRepository } from "../users/repositories/users.repository";
import { UserInputModel } from "../users/models/users.models";
import { SecurityDeviceModel } from "../../db/models/SecurityDevice.model";

export class AuthService {
  constructor(private userService: UserService, private userRepository: UserRepository, private jwtService: JwtService) {}

  async registration(payload: UserInputModel): Promise<string | null> {
    const newUserId = await this.userService.create(payload);
    const confirmationCode = await this.userRepository.findConfirmationCodeByUserId(newUserId);

    return confirmationCode;
  }

  async login(user_id: string, ip: string = "", userAgent: string = ""): Promise<JwtTokensType> {
    const tokens = await this.jwtService.generateTokens({ user_id, deviceId: randomUUID() });
    const refreshToken: JWTPayloadModel = await this.jwtService.decodeToken(tokens.refreshToken);
    await securityDeviceService.addDevice(refreshToken, ip, userAgent);

    return tokens;
  }
  async refresh(ip: string = "", userAgent: string = "", user_id: string, deviceId: string): Promise<JwtTokensType> {
    const tokens = await this.jwtService.generateTokens({ user_id, deviceId });
    const refreshToken: JWTPayloadModel = await this.jwtService.decodeToken(tokens.refreshToken);
    await securityDeviceService.updateDevice(refreshToken, ip, userAgent);

    return tokens;
  }
  async checkRefreshToken(token: string): Promise<{ user_id: string; deviceId: string } | null> {
    const payload = await this.jwtService.verifyRefreshToken(token);

    if (!payload) {
      return null;
    }

    const user = await this.userService.findUser(payload.user_id);

    if (!user) {
      return null;
    }

    const isSessionExists = await this.checkSessionVersion(payload);

    if (!isSessionExists) {
      return null;
    }

    return { user_id: payload.user_id, deviceId: payload.deviceId };
  }
  async checkUserCredentials(payload: LoginInputModel): Promise<string | null> {
    const user = await this.userRepository.findUserPassByLoginOrEmail(payload.loginOrEmail);

    if (!user) {
      return null;
    }
    const isPasswordValid = await bcryptService.checkPassword(payload.password, user.password);

    if (!isPasswordValid) {
      return null;
    }
    return user.id;
  }
  async setConfirmEmailStatus(user_id: string, status: boolean): Promise<boolean> {
    const isChanged = await this.userRepository.setConfirmEmailStatus(user_id, status);

    return isChanged;
  }
  async setNewConfirmCode(user_id: string): Promise<string> {
    const newConfirmationCode = randomUUID();
    const newExpirationDate = getExpirationDate(30);

    const isUpdatedUserConfirmation = await this.userRepository.setConfirmCode(user_id, newConfirmationCode, newExpirationDate);

    if (!isUpdatedUserConfirmation) {
      throw new Error("Update User confirmation Failed");
    }
    return newConfirmationCode;
  }
  async setNewRecoveryCode(user_id: string): Promise<string> {
    const newRecoveryCode = randomUUID();
    const newExpirationDate = getExpirationDate(30);

    const isUpdatedUserRecovery = await this.userRepository.setRecoveryCode(user_id, newRecoveryCode, newExpirationDate);

    if (!isUpdatedUserRecovery) {
      throw new Error("Update User recovery Failed");
    }
    return newRecoveryCode;
  }
  async checkSessionVersion(payload: JWTPayloadModel): Promise<boolean> {
    const lastActiveDate = new Date(payload.iat * 1000).toISOString();

    const result = await SecurityDeviceModel.findOne({ user_id: payload.user_id, deviceId: payload.deviceId, lastActiveDate: lastActiveDate });

    return !!result;
  }
  async setNewPassword(recoveryCode: string, newPassword: string): Promise<boolean> {
    const userId = await this.userRepository.findUserByRecoveryCode(recoveryCode);

    if (!userId) {
      return false;
    }

    const isUpdated = await this.userService.updateUserPass(userId, newPassword);

    return isUpdated;
  }
}
export const authService = new AuthService(userService, userRepository, jwtService);
