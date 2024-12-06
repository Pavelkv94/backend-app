import jwt from "jsonwebtoken";
import { JwtService } from "../../src/adapters/jwt/jwt.service";
import { container } from "../../src/composition.root";

const jwtService = container.get(JwtService);

describe("/test", () => {
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
