import { clearDB, clearPosts, db, runDB } from "../src/db/db";
import { createString } from "./helpers/datasets";
import { PostInputModel } from "../src/input-output-types/posts-types";
import { BlogInputModel, BlogOutputModel } from "../src/input-output-types/blogs-types";
import { MongoMemoryServer } from "mongodb-memory-server";
import { blogsManager } from "./helpers/blogsManager";
import { postsManager } from "./helpers/postsManager";

describe("/posts", () => {
  let client: MongoMemoryServer;
  let blogFromDb: BlogOutputModel;
  beforeAll(async () => {
    // запуск виртуального сервера с временной бд
    client = await MongoMemoryServer.create();

    const uri = client.getUri();

    await runDB(uri);

    const newBlog: BlogInputModel = {
      name: "n1",
      description: "d1",
      websiteUrl: "http://some.com",
    };

    const createBlogResponse = await blogsManager.createBlogWithAuth(newBlog);
    blogFromDb = createBlogResponse.body;
    expect(createBlogResponse.status).toBe(201);
  });

  beforeEach(async () => {
    await clearPosts();
  });

  afterAll(async () => {
    await clearDB();
    await client.stop();
  });

  it("should create and shouldn't get empty array", async () => {
    const newPost: PostInputModel = {
      title: "t1",
      shortDescription: "s1",
      content: "c1",
      blogId: blogFromDb.id,
    };

    const createPostResponse = await postsManager.createPostWithAuth(newPost);
    expect(createPostResponse.status).toBe(201);

    expect(createPostResponse.body.title).toEqual(newPost.title);
    expect(createPostResponse.body.shortDescription).toEqual(newPost.shortDescription);
    expect(createPostResponse.body.content).toEqual(newPost.content);
    expect(createPostResponse.body.blogId).toEqual(newPost.blogId);
    expect(createPostResponse.body.blogName).toEqual(blogFromDb.name);

    const getPostsResponse = await postsManager.getPosts();
    expect(getPostsResponse.status).toBe(200);
    expect(getPostsResponse.body.length).toBe(1);
  });

  it("shouldn't create 401", async () => {
    const newPost: PostInputModel = {
      title: "t1",
      shortDescription: "s1",
      content: "c1",
      blogId: "1",
    };

    const res = await postsManager.createPostWithoutAuth(newPost);
    expect(res.status).toBe(401);

    const getPostsResponse = await postsManager.getPosts();
    expect(getPostsResponse.status).toBe(200);
    expect(getPostsResponse.body.length).toBe(0);
  });

  it("shouldn't create and should get empty array", async () => {
    const newPost: PostInputModel = {
      title: createString(31),
      content: createString(1001),
      shortDescription: createString(101),
      blogId: "1",
    };

    const createPostResponse = await postsManager.createPostWithAuth(newPost);
    expect(createPostResponse.status).toBe(400);

    expect(createPostResponse.body.errorsMessages.length).toEqual(4);
    expect(createPostResponse.body.errorsMessages[0].field).toEqual("title");
    expect(createPostResponse.body.errorsMessages[1].field).toEqual("shortDescription");
    expect(createPostResponse.body.errorsMessages[2].field).toEqual("content");
    expect(createPostResponse.body.errorsMessages[3].field).toEqual("blogId");

    const getPostsResponse = await postsManager.getPosts();
    expect(getPostsResponse.status).toBe(200);
    expect(getPostsResponse.body.length).toBe(0);
  });

  it("shouldn't find", async () => {
    const res = await postsManager.getPost("1");
    expect(res.status).toBe(404);
  });

  it("should find", async () => {
    const newPost: PostInputModel = {
      title: "t1",
      shortDescription: "s1",
      content: "c1",
      blogId: blogFromDb.id,
    };

    const createPostResponse = await postsManager.createPostWithAuth(newPost);
    expect(createPostResponse.status).toBe(201);

    const res = await postsManager.getPost(createPostResponse.body.id);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(newPost.title);
    expect(res.body.shortDescription).toBe(newPost.shortDescription);
    expect(res.body.content).toBe(newPost.content);
    expect(res.body.blogId).toBe(newPost.blogId);
  });

  it("should del", async () => {
    const newPost: PostInputModel = {
      title: "t1",
      shortDescription: "s1",
      content: "c1",
      blogId: blogFromDb.id,
    };

    const createPostResponse = await postsManager.createPostWithAuth(newPost);
    expect(createPostResponse.status).toBe(201);

    const res = await postsManager.deletePostWithAuth(createPostResponse.body.id);
    expect(res.status).toBe(204);

    const getPostsResponse = await postsManager.getPosts();
    expect(getPostsResponse.status).toBe(200);
    expect(getPostsResponse.body.length).toBe(0);
  });

  it("shouldn't del", async () => {
    const res = await postsManager.deletePostWithAuth("1");
    expect(res.status).toBe(404);
  });

  it("shouldn't del 401", async () => {
    const newPost: PostInputModel = {
      title: "t1",
      shortDescription: "s1",
      content: "c1",
      blogId: blogFromDb.id,
    };

    const createPostResponse = await postsManager.createPostWithAuth(newPost);
    expect(createPostResponse.status).toBe(201);

    const res = await postsManager.deletePostWithoutAuth(createPostResponse.body.id);
    expect(res.status).toBe(401);

    const getPostsResponse = await postsManager.getPosts();
    expect(getPostsResponse.status).toBe(200);
    expect(getPostsResponse.body.length).toBe(1);
  });

  it("should update", async () => {
    const newPost: PostInputModel = {
      title: "t1",
      shortDescription: "s1",
      content: "c1",
      blogId: blogFromDb.id,
    };

    const createPostResponse = await postsManager.createPostWithAuth(newPost);
    expect(createPostResponse.status).toBe(201);

    const post: PostInputModel = {
      title: "t2",
      shortDescription: "s2",
      content: "c2",
      blogId: blogFromDb.id,
    };

    const updatePostResponse = await postsManager.updatePostWithAuth(post, createPostResponse.body.id);

    expect(updatePostResponse.status).toBe(204);

    const getPostResponse = await postsManager.getPost(createPostResponse.body.id);
    expect(getPostResponse.status).toBe(200);
    expect(getPostResponse.body.title).toBe(post.title);
    expect(getPostResponse.body.shortDescription).toBe(post.shortDescription);
    expect(getPostResponse.body.content).toBe(post.content);
    expect(getPostResponse.body.blogId).toBe(post.blogId);
  });

  it("shouldn't update 404", async () => {
    const post: PostInputModel = {
      title: "t1",
      shortDescription: "s1",
      content: "c1",
      blogId: blogFromDb.id,
    };

    const res = await postsManager.updatePostWithAuth(post, "1");
    expect(res.status).toBe(404);
  });

  it("shouldn't update 400", async () => {
    const newPost: PostInputModel = {
      title: "t1",
      shortDescription: "s1",
      content: "c1",
      blogId: blogFromDb.id,
    };

    const createPostResponse = await postsManager.createPostWithAuth(newPost);
    expect(createPostResponse.status).toBe(201);

    const post: PostInputModel = {
      title: createString(31),
      content: createString(1001),
      shortDescription: createString(101),
      blogId: "1",
    };

    const res = await postsManager.updatePostWithAuth(post, createPostResponse.body.id);
    expect(res.status).toBe(400);

    expect(res.body.errorsMessages.length).toEqual(4);
    expect(res.body.errorsMessages[0].field).toEqual("title");
    expect(res.body.errorsMessages[1].field).toEqual("shortDescription");
    expect(res.body.errorsMessages[2].field).toEqual("content");
    expect(res.body.errorsMessages[3].field).toEqual("blogId");
  });
  it("shouldn't update 401", async () => {
    const newPost: PostInputModel = {
      title: "t1",
      shortDescription: "s1",
      content: "c1",
      blogId: blogFromDb.id,
    };

    const createPostResponse = await postsManager.createPostWithAuth(newPost);
    expect(createPostResponse.status).toBe(201);

    const updatedPost: PostInputModel = {
      title: "t2",
      shortDescription: "s2",
      content: "c2",
      blogId: blogFromDb.id,
    };

    const updatedPostResponse = await postsManager.updatePostWithoutAuth(updatedPost, createPostResponse.body.id);

    expect(updatedPostResponse.status).toBe(401);

    const getPostResponse = await postsManager.getPost(createPostResponse.body.id);
    expect(getPostResponse.status).toBe(200);
    expect(getPostResponse.body.title).toBe(newPost.title);
    expect(getPostResponse.body.shortDescription).toBe(newPost.shortDescription);
    expect(getPostResponse.body.content).toBe(newPost.content);
    expect(getPostResponse.body.blogId).toBe(newPost.blogId);
  });
});