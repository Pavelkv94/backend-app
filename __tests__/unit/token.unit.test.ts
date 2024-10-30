import { MongoMemoryServer } from "mongodb-memory-server";
import { db } from "../../src/db/db";
import { jwtRepository } from "../../src/adapters/jwt/jwt.repository";
import { jwtService } from "../../src/adapters/jwt/jwt.service";
import jwt from "jsonwebtoken";

//! db not used should
describe("/test", () => {
  let mongoServer: MongoMemoryServer;
  beforeAll(async () => {
    // запуск виртуального сервера с временной бд
    mongoServer = await MongoMemoryServer.create();

    const url = mongoServer.getUri();

    await db.run(url);
  });

  afterAll(async () => {
    await mongoServer.stop();
    await db.stop();
  });

  afterEach(async () => {
    await db.drop();
  });

  it("should add token to black list", async () => {
    const token = "token";

    await jwtRepository.addToBlackList(token);

    const tokenFromBlackList = await jwtRepository.findInBlackList(token);

    expect(token).toEqual(tokenFromBlackList!.token);
  });

  it("should generate tokens", async () => {
    const payload = { user_id: "1" };
    const { refreshToken, accessToken } = await jwtService.generateTokens(payload);
    const decodedAccessToken = await jwtService.decodeToken(accessToken);
    const decodedRefreshToken = await jwtService.decodeToken(refreshToken);

    expect(decodedAccessToken.user_id).toBe(payload.user_id);
    expect(decodedRefreshToken.user_id).toBe(payload.user_id);
  });

  it("shouldn't decode tokens", async () => {
    const payload = { user_id: "1" };
    const { refreshToken, accessToken } = await jwtService.generateTokens(payload);
    jwt.decode = jest.fn().mockReturnValue(null);

    const decodedAccessToken = await jwtService.decodeToken(accessToken);
    const decodedRefreshToken = await jwtService.decodeToken(refreshToken);

    expect(decodedAccessToken).toEqual(null);
    expect(decodedRefreshToken).toEqual(null);
  });
});
