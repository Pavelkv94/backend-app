import { JwtTokensType, LoginInputModel } from "./models/auth.models";
import { JwtService } from "../../adapters/jwt/jwt.service";
import { randomUUID } from "crypto";
import { getExpirationDate } from "../../utils/date/getExpirationDate";
import { BcryptService } from "../../adapters/bcrypt.service";
import { JWTPayloadModel } from "../../adapters/jwt/models/jwt.models";
import { UserService } from "../users/application/users.service";
import { SecurityDeviceModel } from "../../db/models/SecurityDevice.model";
import { UserInputModel } from "../users/domain/users.models";
import { UserRepository } from "../users/infrastructure/users.repository";
import { injectable } from "inversify";
import { SecurityDeviceService } from "../securityDevices/securityDevices.service";

@injectable()
export class AuthService {
  constructor(private userService: UserService, private userRepository: UserRepository, private jwtService: JwtService, private bcryptService: BcryptService, private securityDeviceService: SecurityDeviceService) {}

  async registration(payload: UserInputModel): Promise<string | null> {
    const newUserId = await this.userService.create(payload);
    const confirmationCode = await this.userRepository.findConfirmationCodeByUserId(newUserId);

    return confirmationCode;
  }

  async login(user_id: string, ip: string = "", userAgent: string = ""): Promise<JwtTokensType> {
    const tokens = await this.jwtService.generateTokens({ user_id, deviceId: randomUUID() });
    const refreshToken: JWTPayloadModel = await this.jwtService.decodeToken(tokens.refreshToken);
    await this.securityDeviceService.addDevice(refreshToken, ip, userAgent);

    return tokens;
  }
  async refresh(ip: string = "", userAgent: string = "", user_id: string, deviceId: string): Promise<JwtTokensType> {
    const tokens = await this.jwtService.generateTokens({ user_id, deviceId });
    const refreshToken: JWTPayloadModel = await this.jwtService.decodeToken(tokens.refreshToken);
    await this.securityDeviceService.updateDevice(refreshToken, ip, userAgent);

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
    const isPasswordValid = await this.bcryptService.checkPassword(payload.password, user.password);

    if (!isPasswordValid) {
      return null;
    }
    return user.id;
  }
  async setConfirmEmailStatus(user_id: string, status: boolean): Promise<boolean> {
    const user = await this.userRepository.findUserById(user_id);
    if (!user) {
      return false;
    }
    user.setConfirmEmailStatus(status);
    await this.userRepository.save(user);

    return true;
  }
  async setNewConfirmCode(user_id: string): Promise<string> {
    const newConfirmationCode = randomUUID();
    const newExpirationDate = getExpirationDate(30);

    const user = await this.userRepository.findUserById(user_id);

    if (!user) {
      throw new Error("Something was wrong");
    }

    user.setConfirmCode(newConfirmationCode, newExpirationDate);
    await this.userRepository.save(user);

    return newConfirmationCode;
  }
  async setNewRecoveryCode(user_id: string): Promise<string> {
    const newRecoveryCode = randomUUID();
    const newExpirationDate = getExpirationDate(30);

    const user = await this.userRepository.findUserById(user_id);

    if (!user) {
      throw new Error("Something was wrong");
    }

    user.setRecoveryCode(newRecoveryCode, newExpirationDate);

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
