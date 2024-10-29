import { MongoMemoryServer } from "mongodb-memory-server";
import { db } from "../../src/db/db";
import { jwtRepository } from "../../src/adapters/jwt/jwt.repository";

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
});
