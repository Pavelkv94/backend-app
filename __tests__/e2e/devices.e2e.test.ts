import { MongoMemoryServer } from "mongodb-memory-server";
import { db } from "../../src/db/db";
import { usersManager } from "../helpers/usersManager";
import { newUser, newUser2 } from "../helpers/datasets";
import { LoginInputModel } from "../../src/features/auth/models/auth.models";
import { authManager } from "../helpers/authManager";
import { devicesManager } from "../helpers/devicesManager";

describe("/security/devices", () => {
  let mongoServer: MongoMemoryServer;
  beforeAll(async () => {
    // запуск виртуального сервера с временной бд
    mongoServer = await MongoMemoryServer.create();

    const url = mongoServer.getUri();

    await db.connect(url);
  });

  let loginResponses: any = [];

  beforeEach(async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    const loginData: LoginInputModel = {
      loginOrEmail: newUser.login,
      password: newUser.password,
    };

    for (let i = 0; i < 4; i++) {
      const loginUserResponse = await authManager.loginUserWithAgent(loginData, `agent ${i}`);
      loginResponses.push(loginUserResponse);
      expect(loginUserResponse.status).toBe(200);
    }
  });
  afterAll(async () => {
    await mongoServer.stop();
    await db.disconnect();
  });

  afterEach(async () => {
    await db.drop();
    loginResponses = [];
  });

  it("shouldn't get devices, 401 without auth", async () => {
    const devicesResponse = await devicesManager.getDevicesWithoutAuth();
    expect(devicesResponse.status).toBe(401);
  });
  it("should get devices", async () => {
    const cookies = loginResponses[0].headers["set-cookie"];
    expect(cookies).toBeDefined();
    const refreshToken = cookies[0].split(" ")[0].split("=")[1];

    const devicesResponse = await devicesManager.getDevicesWithAuth(refreshToken);
    
    expect(devicesResponse.status).toBe(200);
    expect(devicesResponse.body.length).toBe(4);
  });
  it("should delete other devices except current 204", async () => {
    const cookies = loginResponses[0].headers["set-cookie"];
    expect(cookies).toBeDefined();
    const refreshToken = cookies[0].split(" ")[0].split("=")[1];

    const deleteDevicesResponse = await devicesManager.deleteOtherDevices(refreshToken);
    expect(deleteDevicesResponse.status).toBe(204);
    const devicesResponse = await devicesManager.getDevicesWithAuth(refreshToken);
    expect(devicesResponse.status).toBe(200);
    expect(devicesResponse.body.length).toBe(1);
  });
  it("shouldn't delete other devices except current 401", async () => {
    const deleteDevicesResponse = await devicesManager.deleteOtherDevices("invalid token");
    expect(deleteDevicesResponse.status).toBe(401);
  });
  it("should delete device 204", async () => {
    const cookies = loginResponses[0].headers["set-cookie"];
    expect(cookies).toBeDefined();
    const refreshToken = cookies[0].split(" ")[0].split("=")[1];
    const devicesResponse = await devicesManager.getDevicesWithAuth(refreshToken);
    expect(devicesResponse.body.length).toBe(4);
    const device = devicesResponse.body[3];

    const deleteDevicesResponse = await devicesManager.deleteDevice(refreshToken, device.deviceId);
    expect(deleteDevicesResponse.status).toBe(204);
    const devicesResponse2 = await devicesManager.getDevicesWithAuth(refreshToken);
    expect(devicesResponse2.body.length).toBe(3);
  });
  it("shouldn't delete device 404", async () => {
    const cookies = loginResponses[0].headers["set-cookie"];
    expect(cookies).toBeDefined();
    const refreshToken = cookies[0].split(" ")[0].split("=")[1];

    const deleteDevicesResponse = await devicesManager.deleteDevice(refreshToken, "fake id");
    expect(deleteDevicesResponse.status).toBe(404);
  });
  it("shouldn't delete another user device 403", async () => {
    const createUserResponse = await usersManager.createUser(newUser2);
    expect(createUserResponse.status).toBe(201);

    const loginData2: LoginInputModel = {
      loginOrEmail: newUser2.login,
      password: newUser2.password,
    };

    const secondUserResponse = await authManager.loginUserWithAgent(loginData2, `agent new`);
    expect(secondUserResponse.status).toBe(200);

    const secondUserCookies = secondUserResponse.headers["set-cookie"];
    expect(secondUserCookies).toBeDefined();
    const secondUserRefreshToken = secondUserCookies[0].split(" ")[0].split("=")[1];
    const secondUserDevices = await devicesManager.getDevicesWithAuth(secondUserRefreshToken);
    expect(secondUserDevices.body.length).toBe(1);
    const secindUserDevice = secondUserDevices.body[0];

    const cookies = loginResponses[0].headers["set-cookie"];
    expect(cookies).toBeDefined();
    const refreshToken = cookies[0].split(" ")[0].split("=")[1];

    const deleteDevicesResponse = await devicesManager.deleteDevice(refreshToken, secindUserDevice.deviceId);
    expect(deleteDevicesResponse.status).toBe(403);
  });

  it("should logout device", async () => {
    const cookies = loginResponses[0].headers["set-cookie"];
    expect(cookies).toBeDefined();
    const refreshToken = cookies[0].split(" ")[0].split("=")[1];

    const logoutResponse = await authManager.logoutUser(refreshToken);
    expect(logoutResponse.status).toBe(204);

    const cookies2 = loginResponses[2].headers["set-cookie"];
    expect(cookies2).toBeDefined();
    const refreshToken2 = cookies2[0].split(" ")[0].split("=")[1];

    const devicesResponse = await devicesManager.getDevicesWithAuth(refreshToken2);

    expect(devicesResponse.status).toBe(200);
    expect(devicesResponse.body.length).toBe(3);
  });
});
