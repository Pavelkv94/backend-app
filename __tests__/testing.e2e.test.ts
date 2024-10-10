import { MongoMemoryServer } from "mongodb-memory-server";
import { db } from "../src/db/db";
import { BlogInputModel } from "../src/input-output-types/blogs-types";
import { blogsManager } from "./helpers/blogsManager";
import { PostInputModel } from "../src/input-output-types/posts-types";
import { postsManager } from "./helpers/postsManager";
import { req } from "./helpers/test-helpers";

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

  it("should return empty array", async () => {
    const newBlog: BlogInputModel = {
      name: "n1",
      description: "d1",
      websiteUrl: "http://some.com",
    };

    const createBlogResponse = await blogsManager.createBlogWithAuth(newBlog);

    expect(createBlogResponse.status).toBe(201);

    const getBlogsResponse = await blogsManager.getBlogs();

    expect(getBlogsResponse.body.items.length).toBe(1);

    const newPost: PostInputModel = {
      title: "t1",
      shortDescription: "s1",
      content: "c1",
      blogId: createBlogResponse.body.id,
    };

    const createPostResponse = await postsManager.createPostWithAuth(newPost);
    expect(createPostResponse.status).toBe(201);

    const getPostsResponse = await postsManager.getPosts();
    expect(getPostsResponse.status).toBe(200);
    expect(getPostsResponse.body.items.length).toBe(1);

    const cleanupResponse = await req.delete("/testing/all-data");

    expect(cleanupResponse.status).toBe(204);

    const getPostsResponseAgain = await postsManager.getPosts();
    expect(getPostsResponseAgain.status).toBe(200);
    expect(getPostsResponseAgain.body.items.length).toBe(0);

    const getBlogsResponseAgain = await blogsManager.getBlogs();
    expect(getBlogsResponseAgain.body.items.length).toBe(0);
  });

  it("should return version", async () => {
    const res = await req.get("/");
    expect(res.status).toBe(200);
  });
});
