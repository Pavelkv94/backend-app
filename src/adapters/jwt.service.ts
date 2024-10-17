import jwt from "jsonwebtoken";
import { SETTINGS } from "../settings";

type JwtPayload = {
  user_id: string;
};
export const jwtService = {
  async createToken(payload: JwtPayload): Promise<string> {
    return jwt.sign(payload, SETTINGS.JWT_SECRET_KEY, {
      expiresIn: "10m",
    });
  },
  async decodeToken(token: string): Promise<any> {
    try {
      return jwt.decode(token);
    } catch (e: unknown) {
      console.error("Can't decode token", e);
      return null;
    }
  },
  async verifyToken(token: string): Promise<{ user_id: string } | null> {
    try {
      return jwt.verify(token, SETTINGS.JWT_SECRET_KEY) as { user_id: string };
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  },
};
