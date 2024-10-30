import jwt from "jsonwebtoken";
import { SETTINGS } from "../../settings";
import { JwtTokensType } from "../../features/auth/models/auth.models";
import { jwtRepository } from "./jwt.repository";

type JwtPayload = {
  user_id: string;
};

export const jwtService = {
  async generateTokens(payload: JwtPayload): Promise<JwtTokensType> {
    const accessToken = jwt.sign(payload, SETTINGS.JWT_ACCESS_SECRET, { expiresIn: "10s" });
    const refreshToken = jwt.sign(payload, SETTINGS.JWT_REFRESH_SECRET, { expiresIn: "20s" });
    return {
      accessToken,
      refreshToken,
    };
  },
  async decodeToken(token: string): Promise<any> {
    try {
      return jwt.decode(token);
    } catch (e: unknown) {
      console.error("Can't decode token", e);
      return null;
    }
  },
  async verifyAccessToken(token: string): Promise<{ user_id: string } | null> {
    try {
      return jwt.verify(token, SETTINGS.JWT_ACCESS_SECRET) as { user_id: string };
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  },
  async verifyRefreshToken(token: string): Promise<{ user_id: string } | null> {
    try {
      return jwt.verify(token, SETTINGS.JWT_REFRESH_SECRET) as { user_id: string };
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  },
  async addTokenToBlackList(token: string): Promise<boolean> {
    const invalidTokenId = await jwtRepository.addToBlackList(token);

    return !!invalidTokenId;
  },
  async findTokenInBlackList(token: string): Promise<boolean> {
    const invalidTokenId = await jwtRepository.findInBlackList(token);

    return !!invalidTokenId;
  },
};
