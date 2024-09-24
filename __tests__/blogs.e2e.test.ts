import { clearBlogs, runDB } from "../src/db/db";
import { BlogInputModel } from "../src/input-output-types/blogs-types";
import { createString } from "./helpers/datasets";
import { MongoMemoryServer } from "mongodb-memory-server";
import { blogsManager } from "./helpers/blogsManager";

describe("/blogs", () => {
  let client: MongoMemoryServer;
  beforeAll(async () => {
    // запуск виртуального сервера с временной бд
    client = await MongoMemoryServer.create();

    const uri = client.getUri();

    await runDB(uri);
  });

  beforeEach(async () => {
    await clearBlogs();
  });

  afterAll(async () => {
    await client.stop();
  });

  it("should create and shouldn't get empty array", async () => {
    const newBlog: BlogInputModel = {
      name: "n1",
      description: "d1",
      websiteUrl: "http://some.com",
    };

    const res = await blogsManager.createBlogWithAuth(newBlog);

    expect(res.status).toBe(201);
    expect(res.body.name).toEqual(newBlog.name);
    expect(res.body.description).toEqual(newBlog.description);
    expect(res.body.websiteUrl).toEqual(newBlog.websiteUrl);

    const getBlogsResponse = await blogsManager.getBlogs();

    expect(getBlogsResponse.body.length).toBe(1);
  });

  it("shouldn't create 401", async () => {
    const newBlog: BlogInputModel = {
      name: "n1",
      description: "d1",
      websiteUrl: "http://some.com",
    };

    const res = await blogsManager.createBlogWithoutAuth(newBlog);
    expect(res.status).toBe(401);
  });

  it("shouldn't create and should get empty array ", async () => {
    const newBlog: BlogInputModel = {
      name: createString(16),
      description: createString(501),
      websiteUrl: createString(101),
    };

    const res = await blogsManager.createBlogWithAuth(newBlog);

    expect(res.status).toBe(400);

    expect(res.body.errorsMessages.length).toEqual(3);
    expect(res.body.errorsMessages[0].field).toEqual("name");
    expect(res.body.errorsMessages[1].field).toEqual("description");
    expect(res.body.errorsMessages[2].field).toEqual("websiteUrl");

    const getBlogsResponse = await blogsManager.getBlogs();

    expect(getBlogsResponse.body.length).toBe(0);
  });

  // it("should get empty array", async () => {
  //   const res = await blogsManager.getBlogs();

  //   expect(res.status).toBe(200);
  //   expect(res.body.length).toBe(0);
  // });

  // it("should get not empty array", async () => {

  //   const res = await req.get(SETTINGS.PATH.BLOGS).expect(200);

  //   expect(res.body.length).toEqual(1);
  //   expect(res.body[0]).toEqual(dataset1.blogs[0]);
  // });

  it("shouldn't find", async () => {
    const getResponse = await blogsManager.getBlog("1");
    expect(getResponse.status).toBe(404);
  });

  it("should find", async () => {
    const newBlog: BlogInputModel = {
      name: "n1",
      description: "d1",
      websiteUrl: "http://some.com",
    };

    const createResponse = await blogsManager.createBlogWithAuth(newBlog);

    expect(createResponse.status).toBe(201);

    const getResponse = await blogsManager.getBlog(createResponse.body.id);
    expect(getResponse.status).toBe(200);

    expect(getResponse.body.name).toBe(newBlog.name);
    expect(getResponse.body.description).toBe(newBlog.description);
    expect(getResponse.body.websiteUrl).toBe(newBlog.websiteUrl);
  });

  it("should del", async () => {
    const newBlog: BlogInputModel = {
      name: "n1",
      description: "d1",
      websiteUrl: "http://some.com",
    };

    const createResponse = await blogsManager.createBlogWithAuth(newBlog);

    expect(createResponse.status).toBe(201);

    const res = await blogsManager.deleteBlogWithAuth(createResponse.body.id);

    expect(res.status).toBe(204);

    const getResponse = await blogsManager.getBlog(createResponse.body.id);
    expect(getResponse.status).toBe(404);
  });

  it("shouldn't del", async () => {
    const res = await blogsManager.deleteBlogWithAuth("1");

    expect(res.status).toBe(404);
  });

  it("shouldn't del 401", async () => {
    const newBlog: BlogInputModel = {
      name: "n1",
      description: "d1",
      websiteUrl: "http://some.com",
    };

    const createResponse = await blogsManager.createBlogWithAuth(newBlog);

    expect(createResponse.status).toBe(201);

    const res = await blogsManager.deleteBlogWithoutAuth(createResponse.body.id);

    expect(res.status).toBe(401);
  });

  it("should update", async () => {
    const newBlog: BlogInputModel = {
      name: "n1",
      description: "d1",
      websiteUrl: "http://some.com",
    };

    const createResponse = await blogsManager.createBlogWithAuth(newBlog);

    expect(createResponse.status).toBe(201);

    const updatedBlog: BlogInputModel = {
      name: "n2",
      description: "d2",
      websiteUrl: "http://some2.com",
    };

    const updateRes = await blogsManager.updateBlogWithAuth(updatedBlog, createResponse.body.id);

    expect(updateRes.status).toBe(204);

    const getResponse = await blogsManager.getBlog(createResponse.body.id);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.name).toBe(updatedBlog.name);
    expect(getResponse.body.description).toBe(updatedBlog.description);
    expect(getResponse.body.websiteUrl).toBe(updatedBlog.websiteUrl);
  });

  it("shouldn't update 404", async () => {
    const blog: BlogInputModel = {
      name: "n2",
      description: "d2",
      websiteUrl: "http://some2.com",
    };

    const res = await blogsManager.updateBlogWithAuth(blog, "1");
    expect(res.status).toBe(404);
  });

  it("shouldn't update  400", async () => {
    const newBlog: BlogInputModel = {
      name: "n1",
      description: "d1",
      websiteUrl: "http://some.com",
    };

    const createResponse = await blogsManager.createBlogWithAuth(newBlog);

    expect(createResponse.status).toBe(201);

    const blog: BlogInputModel = {
      name: createString(16),
      description: createString(501),
      websiteUrl: createString(101),
    };

    const res = await blogsManager.updateBlogWithAuth(blog, createResponse.body.id);

    expect(res.status).toBe(400);
    expect(res.body.errorsMessages.length).toEqual(3);
    expect(res.body.errorsMessages[0].field).toEqual("name");
    expect(res.body.errorsMessages[1].field).toEqual("description");
    expect(res.body.errorsMessages[2].field).toEqual("websiteUrl");
  });
  it("shouldn't update 401", async () => {
    const newBlog: BlogInputModel = {
      name: "n1",
      description: "d1",
      websiteUrl: "http://some.com",
    };

    const createResponse = await blogsManager.createBlogWithAuth(newBlog);

    expect(createResponse.status).toBe(201);

    const blog: BlogInputModel = {
      name: createString(16),
      description: createString(501),
      websiteUrl: createString(101),
    };

    const updateResponse = await blogsManager.updateBlogWithoutAuth(blog, createResponse.body.id);
    expect(updateResponse.status).toBe(401);

    const getResponse = await blogsManager.getBlog(createResponse.body.id);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.name).toBe(newBlog.name);
    expect(getResponse.body.description).toBe(newBlog.description);
    expect(getResponse.body.websiteUrl).toBe(newBlog.websiteUrl);
  });
});
