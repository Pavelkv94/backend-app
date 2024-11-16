import { jwtService } from "../../src/adapters/jwt/jwt.service";
import jwt from "jsonwebtoken";

describe("/test", () => {
  // it("should add token to black list", async () => {
  //   const token = "token";

  //   await jwtRepository.addToBlackList(token);

  //   const tokenFromBlackList = await jwtRepository.findInBlackList(token);

  //   expect(token).toEqual(tokenFromBlackList!.token);
  // });

  it("should generate tokens", async () => {
    const payload = { user_id: "1", deviceId: "12" };
    const { refreshToken, accessToken } = await jwtService.generateTokens(payload);
    const decodedAccessToken = await jwtService.decodeToken(accessToken);
    const decodedRefreshToken = await jwtService.decodeToken(refreshToken);

    expect(decodedAccessToken.user_id).toBe(payload.user_id);
    expect(decodedRefreshToken.user_id).toBe(payload.user_id);
  });

  it("shouldn't decode tokens", async () => {
    const payload = { user_id: "1", deviceId: "12" };
    const { refreshToken, accessToken } = await jwtService.generateTokens(payload);
    jwt.decode = jest.fn().mockReturnValue(null);

    const decodedAccessToken = await jwtService.decodeToken(accessToken);
    const decodedRefreshToken = await jwtService.decodeToken(refreshToken);

    expect(decodedAccessToken).toEqual(null);
    expect(decodedRefreshToken).toEqual(null);
  });
});
