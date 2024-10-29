import { db } from "../../src/db/db";
import { createString, fakeId, newBlog, newBlogPost } from "../helpers/datasets";
import { MongoMemoryServer } from "mongodb-memory-server";
import { blogsManager } from "../helpers/blogsManager";
import { postsManager } from "../helpers/postsManager";
import { BlogInputModel } from "../../src/features/blogs/models/blogs.models";
import { blogsQueryRepository } from "../../src/features/blogs/blogs.query-repository";
import { blogsService } from "../../src/features/blogs/blogs.service";

describe("/blogs", () => {
  let mongoServer: MongoMemoryServer;
  beforeAll(async () => {
    // запуск виртуального сервера с временной бд
    mongoServer = await MongoMemoryServer.create();

    const url = mongoServer.getUri();

    await db.run(url);
    await db.drop();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await db.dropCollection("blogs");
  });

  afterAll(async () => {
    await mongoServer.stop();
    await db.stop();
  });

  it("should create and shouldn't get empty array", async () => {
    const res = await blogsManager.createBlogWithAuth(newBlog);

    expect(res.status).toBe(201);
    expect(res.body.name).toEqual(newBlog.name);
    expect(res.body.description).toEqual(newBlog.description);
    expect(res.body.websiteUrl).toEqual(newBlog.websiteUrl);

    const getBlogsResponse = await blogsManager.getBlogs();

    expect(getBlogsResponse.body.items.length).toBe(1);
  });

  it("should create a lot of blogs", async () => {
    for (let i = 0; i < 10; i++) {
      const res = await blogsManager.createBlogWithAuth(newBlog);
      expect(res.status).toBe(201);
    }

    const getBlogsResponse = await blogsManager.getBlogs();

    expect(getBlogsResponse.body.items.length).toBe(10);
  });

  it("shouldn't create 401 without auth", async () => {
    const res = await blogsManager.createBlogWithoutAuth(newBlog);
    expect(res.status).toBe(401);
  });
  it("shouldn't create 401 with invalid token", async () => {
    const res = await blogsManager.createBlogWithInvalidToken(newBlog);
    expect(res.status).toBe(401);
  });
  it("shouldn't create 401 with auth", async () => {
    const res = await blogsManager.createBlogWithInvalidAuth(newBlog);
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

    expect(getBlogsResponse.body.items.length).toBe(0);
  });

  it("shouldn't find", async () => {
    const getResponse = await blogsManager.getBlog(fakeId);
    expect(getResponse.status).toBe(404);
  });

  it("should find", async () => {
    const createResponse = await blogsManager.createBlogWithAuth(newBlog);

    expect(createResponse.status).toBe(201);

    const getResponse = await blogsManager.getBlog(createResponse.body.id);
    expect(getResponse.status).toBe(200);

    expect(getResponse.body.name).toBe(newBlog.name);
    expect(getResponse.body.description).toBe(newBlog.description);
    expect(getResponse.body.websiteUrl).toBe(newBlog.websiteUrl);
  });

  it("should del", async () => {
    const createResponse = await blogsManager.createBlogWithAuth(newBlog);

    expect(createResponse.status).toBe(201);

    const res = await blogsManager.deleteBlogWithAuth(createResponse.body.id);

    expect(res.status).toBe(204);

    const getResponse = await blogsManager.getBlog(createResponse.body.id);
    expect(getResponse.status).toBe(404);
  });

  it("shouldn't del", async () => {
    const res = await blogsManager.deleteBlogWithAuth(fakeId);

    expect(res.status).toBe(404);
  });

  it("shouldn't del", async () => {
    blogsService.deleteBlog = jest.fn().mockReturnValue(false);
    const res = await blogsManager.deleteBlogWithAuth(fakeId);

    expect(res.status).toBe(404);
  });

  it("shouldn't del 401", async () => {
    const createResponse = await blogsManager.createBlogWithAuth(newBlog);

    expect(createResponse.status).toBe(201);

    const res = await blogsManager.deleteBlogWithoutAuth(createResponse.body.id);

    expect(res.status).toBe(401);
  });

  it("should update", async () => {
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

    const res = await blogsManager.updateBlogWithAuth(blog, fakeId);
    expect(res.status).toBe(404);
  });

  it("shouldn't update  400", async () => {
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

  it("should get pagination", async () => {
    const createResponse = await blogsManager.createBlogWithAuth(newBlog);

    expect(createResponse.status).toBe(201);

    const getResponse = await blogsManager.getBlogs("?pageNumber=1&sortDirection=asc&pageSize=5&searchNameTerm=n&sortBy='createdAt'");
    expect(getResponse.status).toBe(200);

    expect(getResponse.body.pagesCount).toBe(1);
    expect(getResponse.body.page).toBe(1);
    expect(getResponse.body.pageSize).toBe(5);
    expect(getResponse.body.totalCount).toBe(1);
    expect(getResponse.body.items.length).toBe(1);
  });

  it("shouldn't get objects with incorrect search", async () => {
    const createResponse = await blogsManager.createBlogWithAuth(newBlog);

    expect(createResponse.status).toBe(201);

    const getResponse2 = await blogsManager.getBlogs("?searchNameTerm=n2");
    expect(getResponse2.status).toBe(200);
    expect(getResponse2.body.items.length).toBe(0);
  });

  it("should create post for blog", async () => {
    const createBlogResponse = await blogsManager.createBlogWithAuth(newBlog);
    expect(createBlogResponse.status).toBe(201);

    const createPostResponse = await postsManager.createPostForBlog(newBlogPost, createBlogResponse.body.id);
    expect(createPostResponse.status).toBe(201);

    const getPostResponse = await postsManager.getPost(createPostResponse.body.id);
    expect(getPostResponse.status).toBe(200);
  });
  it("shouldn't get blog's posts", async () => {
    const getBlogPosts = await blogsManager.getBlogsPosts(fakeId);
    expect(getBlogPosts.status).toBe(404);
  });

  it("shouldn get blog's posts", async () => {
    const createBlogResponse = await blogsManager.createBlogWithAuth(newBlog);
    expect(createBlogResponse.status).toBe(201);

    const createPostResponse = await postsManager.createPostForBlog(newBlogPost, createBlogResponse.body.id);

    expect(createPostResponse.status).toBe(201);

    const getBlogPosts = await blogsManager.getBlogsPosts(createBlogResponse.body.id, "?pageNumber=1");
    expect(getBlogPosts.status).toBe(200);

    expect(getBlogPosts.body.page).toBe(1);
  });
  it("shouldn't get blogs with invalid query", async () => {
    const createBlogResponse = await blogsManager.createBlogWithAuth(newBlog);
    expect(createBlogResponse.status).toBe(201);

    const getBlogPosts = await blogsManager.getBlogs("?pageNumber=0");
    expect(getBlogPosts.status).toBe(400);

    const getBlogPosts2 = await blogsManager.getBlogs("?pageNumber=test");
    expect(getBlogPosts2.status).toBe(400);

    const getBlogPosts3 = await blogsManager.getBlogs("?pageSize=test");
    expect(getBlogPosts3.status).toBe(400);

    const getBlogPosts4 = await blogsManager.getBlogs("?pageSize=0");
    expect(getBlogPosts4.status).toBe(400);

    const getBlogPosts5 = await blogsManager.getBlogs("?sortDirection=0");
    expect(getBlogPosts5.status).toBe(400);
  });

  it("shouldn't update blogs with db error", async () => {
    const createResponse = await blogsManager.createBlogWithAuth(newBlog);
    expect(createResponse.status).toBe(201);

    const updatedBlog: BlogInputModel = {
      name: "n2",
      description: "d2",
      websiteUrl: "http://some2.com",
    };
    blogsService.updateBlog = jest.fn().mockReturnValue(false);

    const updateRes = await blogsManager.updateBlogWithAuth(updatedBlog, createResponse.body.id);

    expect(updateRes.status).toBe(404);

    blogsService.updateBlog = jest.fn().mockRejectedValue(new Error("Database error"));

    const updateRes2 = await blogsManager.updateBlogWithAuth(updatedBlog, createResponse.body.id);

    expect(updateRes2.status).toBe(500);
  });

  it("shouldn't get blogs with db error", async () => {
    const createBlogResponse = await blogsManager.createBlogWithAuth(newBlog);
    expect(createBlogResponse.status).toBe(201);

    blogsQueryRepository.findAllBlogs = jest.fn().mockRejectedValue(new Error("Database error"));
    const getBlogs = await blogsManager.getBlogs();
    expect(getBlogs.status).toBe(500);
  });

  it("shouldn't get blog with db error", async () => {
    const createBlogResponse = await blogsManager.createBlogWithAuth(newBlog);
    expect(createBlogResponse.status).toBe(201);

    blogsQueryRepository.findBlog = jest.fn().mockReturnValue(null);
    const getBlogs = await blogsManager.getBlog(createBlogResponse.body.id);
    expect(getBlogs.status).toBe(404);
  });

  it("shouldn't get blog with db error", async () => {
    blogsQueryRepository.findBlog = jest.fn().mockRejectedValue(new Error("Database error"));

    const createBlogResponse = await blogsManager.createBlogWithAuth(newBlog);
    expect(createBlogResponse.status).toBe(500);
  });
  it("shouldn't create blogs with db error", async () => {
    blogsQueryRepository.findBlog = jest.fn().mockReturnValue(null);

    const res = await blogsManager.createBlogWithAuth(newBlog);
    expect(res.status).toBe(404);

    blogsQueryRepository.findBlog = jest.fn().mockRejectedValue(new Error("Database error"));

    const res2 = await blogsManager.createBlogWithAuth(newBlog);
    expect(res2.status).toBe(500);
  });
});
