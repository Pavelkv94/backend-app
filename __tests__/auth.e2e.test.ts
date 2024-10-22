import { MongoMemoryServer } from "mongodb-memory-server";
import { db } from "../src/db/db";
import { blogsManager } from "./helpers/blogsManager";
import { postsManager } from "./helpers/postsManager";
import { req } from "./helpers/test-helpers";
import { BlogInputModel } from "../src/features/blogs/models/blogs.models";
import { PostInputModel } from "../src/features/posts/models/posts.models";
import { usersManager } from "./helpers/usersManager";
import { createString, newUser } from "./helpers/datasets";
import { LoginInputModel } from "../src/features/auth/models/auth.models";

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

  it("User should login", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    const loginData: LoginInputModel = {
      loginOrEmail: newUser.login,
      password: newUser.password,
    };

    const loginUserResponse = await usersManager.loginUser(loginData);
    expect(loginUserResponse.status).toBe(200);
    expect(loginUserResponse.body).toHaveProperty("accessToken");

    const loginData2: LoginInputModel = {
      loginOrEmail: newUser.email,
      password: newUser.password,
    };
    const loginUserResponse2 = await usersManager.loginUser(loginData2);
    expect(loginUserResponse2.status).toBe(200);
  });

  it("User shouldn't login", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    const loginData: LoginInputModel = {
      loginOrEmail: "Invalid",
      password: newUser.password,
    };
    const loginUserResponse = await usersManager.loginUser(loginData);
    expect(loginUserResponse.status).toBe(401);

    const loginData2: LoginInputModel = {
      loginOrEmail: newUser.email,
      password: "1234",
    };
    const loginUserResponse2 = await usersManager.loginUser(loginData2);
    expect(loginUserResponse2.status).toBe(401);
  });

  it("User shouldn't login with incorrect data", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    const loginData = {
      loginOrEmail: newUser.login,
    };
    const loginUserResponse = await usersManager.loginUser(loginData);
    expect(loginUserResponse.status).toBe(400);
    expect(loginUserResponse.body.errorsMessages.length).toBe(1);

    const loginData2 = {
      password: newUser.password,
    };
    const loginUserResponse2 = await usersManager.loginUser(loginData2);
    expect(loginUserResponse2.status).toBe(400);
    expect(loginUserResponse2.body.errorsMessages.length).toBe(1);
  });

  it("/ME should return me user", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    const loginData: LoginInputModel = {
      loginOrEmail: newUser.login,
      password: newUser.password,
    };

    const loginUserResponse = await usersManager.loginUser(loginData);
    expect(loginUserResponse.status).toBe(200);
    expect(loginUserResponse.body).toHaveProperty("accessToken");

    const meResponse = await usersManager.getMe(loginUserResponse.body.accessToken);
    expect(meResponse.status).toBe(200);
    expect(meResponse.body.login).toBe(newUser.login);
  });

  it("should register user", async () => {
    const registerUserResponse = await usersManager.registerUser(newUser);
    expect(registerUserResponse.status).toBe(204);
  });

  it("should register user if he exist", async () => {
    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    const registerUserResponse = await usersManager.registerUser(newUser);
    expect(registerUserResponse.status).toBe(400);
  });

  it("should register user with incorrect data", async () => {
    const newInvalidUser = {
      login: createString(12),
      password: createString(4),
      email: createString(10),
    };

    const registerUserResponse = await usersManager.registerUser(newInvalidUser);
    expect(registerUserResponse.status).toBe(400);
    expect(registerUserResponse.body.errorsMessages.length).toBe(3);
  });
});
