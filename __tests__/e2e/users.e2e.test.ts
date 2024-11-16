import { MongoMemoryServer } from "mongodb-memory-server";
import { db } from "../../src/db/db";
import { usersManager } from "../helpers/usersManager";
import { createString, fakeId, newUser } from "../helpers/datasets";
import { usersQueryRepository } from "../../src/features/users/users.query-repository";
import { usersRepository } from "../../src/features/users/users.repository";

describe("/users", () => {
  let mongoServer: MongoMemoryServer;
  beforeAll(async () => {
    // запуск виртуального сервера с временной бд
    mongoServer = await MongoMemoryServer.create();

    const url = mongoServer.getUri();

    await db.connect(url);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoServer.stop();
    await db.disconnect();
  });

  afterEach(async () => {
    await db.drop();
  });

  it("should return empty array", async () => {
    const getUsersResponse = await usersManager.getUsersWithAuth();
    expect(getUsersResponse.body.items.length).toBe(0);
  });

  it("should return 401 error", async () => {
    const getUsersResponseWithoutAuth = await usersManager.getUsersWithoutAuth();
    expect(getUsersResponseWithoutAuth.status).toBe(401);

    const getUsersResponseWithInvalidAuthHeader = await usersManager.getUsersWithInvalidAuthHeader();
    expect(getUsersResponseWithInvalidAuthHeader.status).toBe(401);

    const getUsersResponseWithInvalidToken = await usersManager.getUsersWithInvalidToken();
    expect(getUsersResponseWithInvalidToken.status).toBe(401);
  });

  it("should create user and return not empty array", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    expect(Object.keys(createUserResponse.body).length).toBe(4);

    const getUsersResponse = await usersManager.getUsersWithAuth();

    expect(getUsersResponse.body.items.length).toBe(1);
    expect(getUsersResponse.body.items[0].login).toBe(newUser.login);
    expect(getUsersResponse.body.items[0].email).toBe(newUser.email);
  });

  it("shouldn't create user and return empty array", async () => {
    const newInvalidUser = {
      login: createString(12),
      password: createString(4),
      email: createString(10),
    };

    const createUserResponse = await usersManager.createUser(newInvalidUser);
    expect(createUserResponse.status).toBe(400);
    expect(createUserResponse.body.errorsMessages.length).toBe(3);

    const getUsersResponse = await usersManager.getUsersWithAuth();
    expect(getUsersResponse.body.items.length).toBe(0);
  });

  it("shouldn't create user with the same data", async () => {
    const createUserResponse2 = await usersManager.createUser(newUser);
    expect(createUserResponse2.status).toBe(201);
    const createUserResponse3 = await usersManager.createUser(newUser);
    expect(createUserResponse3.status).toBe(400);
    expect(createUserResponse3.body.errorsMessages.length).toBe(2);
  });

  it("should delete user", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    const deleteUserResponse = await usersManager.deleteUser(createUserResponse.body.id);
    expect(deleteUserResponse.status).toBe(204);

    const getUsersResponse2 = await usersManager.getUsersWithAuth();
    expect(getUsersResponse2.body.items.length).toBe(0);
  });

  it("shouldn't delete user", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    const deleteUserResponse = await usersManager.deleteUser(fakeId);
    expect(deleteUserResponse.status).toBe(404);

    const getUsersResponse2 = await usersManager.getUsersWithAuth();
    expect(getUsersResponse2.body.items.length).toBe(1);
  });

  it("shouldn't delete user with DB error", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    usersRepository.deleteUser = jest.fn().mockRejectedValue(new Error("DB Error"));

    const deleteUserResponse = await usersManager.deleteUser(createUserResponse.body.id);
    expect(deleteUserResponse.status).toBe(500);
  });
  it("shouldn't delete user with DB error in the second case", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    usersRepository.findUser = jest.fn().mockReturnValue(null);

    const deleteUserResponse = await usersManager.deleteUser(createUserResponse.body.id);
    expect(deleteUserResponse.status).toBe(404);
  });
  it("shouldn't get users with db error", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    usersQueryRepository.findAllUsers = jest.fn().mockRejectedValue(new Error("DB Error"));

    const getUsersResponse = await usersManager.getUsersWithAuth();
    expect(getUsersResponse.status).toBe(500);
  });

  it("shouldn't create user with db error", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    usersQueryRepository.findAllUsers = jest.fn().mockRejectedValue(new Error("DB Error"));

    const getUsersResponse = await usersManager.getUsersWithAuth();
    expect(getUsersResponse.status).toBe(500);
  });

  it("shouldn't create user with db error the second case", async () => {
    usersQueryRepository.findUser = jest.fn().mockRejectedValue(new Error("DB Error"));

    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(500);
  });

  it("shouldn't create user with db error the third case", async () => {
    usersQueryRepository.findUser = jest.fn().mockResolvedValue(null);

    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(404);
  });
});
