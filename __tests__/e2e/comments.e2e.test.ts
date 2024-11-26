import { fakeId, initLikesInfo, newBlog, newBlogPost, newComment, newUser, newUser2 } from "../helpers/datasets";
import { MongoMemoryServer } from "mongodb-memory-server";
import { blogsManager } from "../helpers/blogsManager";
import { postsManager } from "../helpers/postsManager";
import { db } from "../../src/db/db";
import { BlogViewModel } from "../../src/features/blogs/models/blogs.models";
import { PostViewModel } from "../../src/features/posts/models/posts.models";
import { commentsManager } from "../helpers/commentsManager";
import { usersManager } from "../helpers/usersManager";
import { LoginInputModel } from "../../src/features/auth/models/auth.models";
import { authManager } from "../helpers/authManager";
import { commentQueryRepository } from "../../src/features/comments/repositories/comments.query-repository";
import { CommentModel } from "../../src/db/models/Comment.model";

describe("/posts", () => {
  let mongoServer: MongoMemoryServer;
  let blogFromDb: BlogViewModel;
  let postFromDb: PostViewModel;
  let userToken: string;
  let userToken2: string;

  beforeAll(async () => {
    // запуск виртуального сервера с временной бд
    mongoServer = await MongoMemoryServer.create();

    const url = mongoServer.getUri();

    await db.connect(url);
    await db.drop();

    const createUserResponse = await usersManager.createUser(newUser);
    expect(createUserResponse.status).toBe(201);

    const createUserResponse2 = await usersManager.createUser(newUser2);
    expect(createUserResponse2.status).toBe(201);

    const loginData: LoginInputModel = {
      loginOrEmail: newUser.login,
      password: newUser.password,
    };

    const loginData2: LoginInputModel = {
      loginOrEmail: newUser2.login,
      password: newUser2.password,
    };

    const loginUserResponse = await authManager.loginUser(loginData);
    const loginUserResponse2 = await authManager.loginUser(loginData2);

    userToken = loginUserResponse.body.accessToken;
    userToken2 = loginUserResponse2.body.accessToken;

    const createBlogResponse = await blogsManager.createBlogWithAuth(newBlog);
    blogFromDb = createBlogResponse.body;
    expect(createBlogResponse.status).toBe(201);

    const createPostResponse = await postsManager.createPostForBlog(newBlogPost, createBlogResponse.body.id);
    postFromDb = createPostResponse.body;
    expect(createPostResponse.status).toBe(201);
  });
  401;
  beforeEach(async () => {
    jest.clearAllMocks();
    await CommentModel.deleteMany({});
  });

  afterAll(async () => {
    await db.drop();
    await mongoServer.stop();
    await db.disconnect();
  });

  it("should create and shouldn't get empty array", async () => {
    const createCommentResponse = await commentsManager.createCommentWithAuthJWT(postFromDb.id, userToken, newComment);
    expect(createCommentResponse.status).toBe(201);

    expect(createCommentResponse.body.content).toEqual(newComment.content);
    expect(createCommentResponse.body.commentatorInfo.userLogin).toEqual(newUser.login);

    const getCommentsResponse = await commentsManager.getComments(postFromDb.id);
    expect(getCommentsResponse.status).toBe(200);

    expect(getCommentsResponse.body.items.length).toBe(1);
    expect(getCommentsResponse.body.items[0].content).toBe(newComment.content);
    expect(getCommentsResponse.body.items[0].id).toBe(createCommentResponse.body.id);
  });

  it("check auth jwt validations on comment creating", async () => {
    const createCommentResponse = await commentsManager.createCommentWithInvalidJwtHeader(postFromDb.id, userToken, newComment);
    expect(createCommentResponse.status).toBe(401);

    const createCommentResponse2 = await commentsManager.createCommentWithInvalidJwt(postFromDb.id, userToken, newComment);
    expect(createCommentResponse2.status).toBe(401);

    const createCommentResponse3 = await commentsManager.createCommentWithAuthJWT(fakeId, userToken, newComment);
    expect(createCommentResponse3.status).toBe(404);

    const createCommentResponse4 = await commentsManager.createCommentWithAuthJWT(postFromDb.id, userToken, {});
    expect(createCommentResponse4.status).toBe(400);
  });

  it("should find comment", async () => {
    const createCommentResponse = await commentsManager.createCommentWithAuthJWT(postFromDb.id, userToken, newComment);

    expect(createCommentResponse.status).toBe(201);

    const getCommentResponse = await commentsManager.getComment(createCommentResponse.body.id);
    expect(getCommentResponse.status).toBe(200);
    expect(getCommentResponse.body.content).toBe(newComment.content);
    expect(getCommentResponse.body.commentatorInfo.userLogin).toBe(newUser.login);
  });

  it("shouldn't find comment", async () => {
    const getCommentResponse = await commentsManager.getComment(fakeId);
    expect(getCommentResponse.status).toBe(404);
  });
  it("should delete comment", async () => {
    const createCommentResponse = await commentsManager.createCommentWithAuthJWT(postFromDb.id, userToken, newComment);
    expect(createCommentResponse.status).toBe(201);

    const deleteCommentResponse = await commentsManager.deleteCommentWithAuth(createCommentResponse.body.id, userToken);
    expect(deleteCommentResponse.status).toBe(204);
  });

  it("should update comment", async () => {
    const createCommentResponse = await commentsManager.createCommentWithAuthJWT(postFromDb.id, userToken, newComment);
    expect(createCommentResponse.status).toBe(201);

    const updatedComment = { content: "updated content with correct length" };
    const updateCommentResponse = await commentsManager.updateCommentWithAuth(createCommentResponse.body.id, userToken, updatedComment);
    expect(updateCommentResponse.status).toBe(204);

    const getCommentResponse = await commentsManager.getComment(createCommentResponse.body.id);
    expect(getCommentResponse.status).toBe(200);
    expect(getCommentResponse.body.content).toBe(updatedComment.content);
  });

  it("shouldn't update comment", async () => {
    const createCommentResponse = await commentsManager.createCommentWithAuthJWT(postFromDb.id, userToken, newComment);
    expect(createCommentResponse.status).toBe(201);

    const updatedComment = { content: "updated content" };
    const updateCommentResponse = await commentsManager.updateCommentWithAuth(createCommentResponse.body.id, "userToken", updatedComment);
    expect(updateCommentResponse.status).toBe(401);
  });

  it("shouldn't get comments with DB error", async () => {
    const createCommentResponse = await commentsManager.createCommentWithAuthJWT(postFromDb.id, userToken, newComment);
    expect(createCommentResponse.status).toBe(201);

    commentQueryRepository.findComment = jest.fn().mockReturnValue(null);
    const getCommentsResponse = await commentsManager.getComment(createCommentResponse.body.id);
    expect(getCommentsResponse.status).toBe(404);
  });

  it("should find comment with likes", async () => {
    const createCommentResponse = await commentsManager.createCommentWithAuthJWT(postFromDb.id, userToken, newComment);
    expect(createCommentResponse.status).toBe(201);

    const getCommentResponse = await commentsManager.getComment(createCommentResponse.body.id);

    expect(getCommentResponse.status).toBe(200);
    expect(getCommentResponse.body.likesInfo).toEqual(initLikesInfo);
  });

  it("authorized user should set first like to comment and get comment", async () => {
    const createCommentResponse = await commentsManager.createCommentWithAuthJWT(postFromDb.id, userToken, newComment);
    expect(createCommentResponse.status).toBe(201);

    const likeCommentResponse = await commentsManager.likeComment(createCommentResponse.body.id, userToken, { likeStatus: "Like" });
    expect(likeCommentResponse.status).toBe(204);

    const getCommentResponse1 = await commentsManager.getCommentWithAuth(createCommentResponse.body.id, userToken);
    expect(getCommentResponse1.status).toBe(200);
    expect(getCommentResponse1.body.likesInfo.likesCount).toBe(1);
    expect(getCommentResponse1.body.likesInfo.dislikesCount).toBe(0);
    expect(getCommentResponse1.body.likesInfo.myStatus).toBe("Like");
  });

  it("user shouldn't set likes to comment twice", async () => {
    const createCommentResponse = await commentsManager.createCommentWithAuthJWT(postFromDb.id, userToken, newComment);
    expect(createCommentResponse.status).toBe(201);

    const likeCommentResponse = await commentsManager.likeComment(createCommentResponse.body.id, userToken, { likeStatus: "Like" });
    expect(likeCommentResponse.status).toBe(204);

    const likeCommentResponse2 = await commentsManager.likeComment(createCommentResponse.body.id, userToken, { likeStatus: "Like" });
    expect(likeCommentResponse2.status).toBe(204);

    const getCommentResponse1 = await commentsManager.getCommentWithAuth(createCommentResponse.body.id, userToken);
    expect(getCommentResponse1.status).toBe(200);
    expect(getCommentResponse1.body.likesInfo.likesCount).toBe(1);
    expect(getCommentResponse1.body.likesInfo.dislikesCount).toBe(0);
    expect(getCommentResponse1.body.likesInfo.myStatus).toBe("Like");
  });

  it("authorized user should set likes and unauthorized user should get only count", async () => {
    const createCommentResponse = await commentsManager.createCommentWithAuthJWT(postFromDb.id, userToken, newComment);
    expect(createCommentResponse.status).toBe(201);

    const likeCommentResponse = await commentsManager.likeComment(createCommentResponse.body.id, userToken, { likeStatus: "Like" });
    expect(likeCommentResponse.status).toBe(204);

    const getCommentResponse = await commentsManager.getCommentWithAuth(createCommentResponse.body.id, userToken);
    expect(getCommentResponse.status).toBe(200);

    expect(getCommentResponse.body.likesInfo.likesCount).toBe(1);
    expect(getCommentResponse.body.likesInfo.dislikesCount).toBe(0);
    expect(getCommentResponse.body.likesInfo.myStatus).toBe("Like");

    const getCommentResponse2 = await commentsManager.getComment(createCommentResponse.body.id);
    expect(getCommentResponse2.status).toBe(200);

    expect(getCommentResponse2.body.likesInfo.likesCount).toBe(1);
    expect(getCommentResponse2.body.likesInfo.dislikesCount).toBe(0);
    expect(getCommentResponse2.body.likesInfo.myStatus).toBe("None");
  });

  it("authorized user should set dislike and unauthorized user should get only count", async () => {
    const createCommentResponse = await commentsManager.createCommentWithAuthJWT(postFromDb.id, userToken, newComment);
    expect(createCommentResponse.status).toBe(201);

    const likeCommentResponse = await commentsManager.likeComment(createCommentResponse.body.id, userToken, { likeStatus: "Dislike" });
    expect(likeCommentResponse.status).toBe(204);

    const getCommentResponse = await commentsManager.getCommentWithAuth(createCommentResponse.body.id, userToken);
    expect(getCommentResponse.status).toBe(200);

    expect(getCommentResponse.body.likesInfo.likesCount).toBe(0);
    expect(getCommentResponse.body.likesInfo.dislikesCount).toBe(1);
    expect(getCommentResponse.body.likesInfo.myStatus).toBe("Dislike");

    const getCommentResponse2 = await commentsManager.getComment(createCommentResponse.body.id);
    expect(getCommentResponse2.status).toBe(200);

    expect(getCommentResponse2.body.likesInfo.likesCount).toBe(0);
    expect(getCommentResponse2.body.likesInfo.dislikesCount).toBe(1);
    expect(getCommentResponse2.body.likesInfo.myStatus).toBe("None");
  });

  it("authorized user should set like and change to dislike", async () => {
    const createCommentResponse = await commentsManager.createCommentWithAuthJWT(postFromDb.id, userToken, newComment);
    expect(createCommentResponse.status).toBe(201);

    const likeCommentResponse = await commentsManager.likeComment(createCommentResponse.body.id, userToken, { likeStatus: "Like" });
    expect(likeCommentResponse.status).toBe(204);

    const getCommentResponse = await commentsManager.getCommentWithAuth(createCommentResponse.body.id, userToken);
    expect(getCommentResponse.status).toBe(200);

    expect(getCommentResponse.body.likesInfo.likesCount).toBe(1);
    expect(getCommentResponse.body.likesInfo.dislikesCount).toBe(0);
    expect(getCommentResponse.body.likesInfo.myStatus).toBe("Like");

    const likeCommentResponse2 = await commentsManager.likeComment(createCommentResponse.body.id, userToken, { likeStatus: "Dislike" });
    expect(likeCommentResponse2.status).toBe(204);

    const getCommentResponse2 = await commentsManager.getCommentWithAuth(createCommentResponse.body.id, userToken);
    expect(getCommentResponse2.status).toBe(200);

    expect(getCommentResponse2.body.likesInfo.likesCount).toBe(0);
    expect(getCommentResponse2.body.likesInfo.dislikesCount).toBe(1);
    expect(getCommentResponse2.body.likesInfo.myStatus).toBe("Dislike");
  });

  it("authorized user should set like and the second user set dislike get comment", async () => {
    const createCommentResponse = await commentsManager.createCommentWithAuthJWT(postFromDb.id, userToken, newComment);
    expect(createCommentResponse.status).toBe(201);

    const likeCommentResponse = await commentsManager.likeComment(createCommentResponse.body.id, userToken, { likeStatus: "Like" });
    expect(likeCommentResponse.status).toBe(204);

    const getCommentResponse = await commentsManager.getCommentWithAuth(createCommentResponse.body.id, userToken);
    expect(getCommentResponse.status).toBe(200);

    expect(getCommentResponse.body.likesInfo.likesCount).toBe(1);
    expect(getCommentResponse.body.likesInfo.dislikesCount).toBe(0);
    expect(getCommentResponse.body.likesInfo.myStatus).toBe("Like");

    const likeCommentResponse2 = await commentsManager.likeComment(createCommentResponse.body.id, userToken2, { likeStatus: "Dislike" });
    expect(likeCommentResponse2.status).toBe(204);

    const getCommentResponse2 = await commentsManager.getCommentWithAuth(createCommentResponse.body.id, userToken2);
    expect(getCommentResponse2.status).toBe(200);

    expect(getCommentResponse2.body.likesInfo.likesCount).toBe(1);
    expect(getCommentResponse2.body.likesInfo.dislikesCount).toBe(1);
    expect(getCommentResponse2.body.likesInfo.myStatus).toBe("Dislike");
  });

  it("authorized user should set like and the unauthorized user get none statuses", async () => {
    const createCommentResponse = await commentsManager.createCommentWithAuthJWT(postFromDb.id, userToken, newComment);
    expect(createCommentResponse.status).toBe(201);

    const likeCommentResponse = await commentsManager.likeComment(createCommentResponse.body.id, userToken, { likeStatus: "Like" });
    expect(likeCommentResponse.status).toBe(204);

    const getPostCommentsResponse = await commentsManager.getComments(postFromDb.id);

    expect(getPostCommentsResponse.status).toBe(200);

    expect(getPostCommentsResponse.body.items[0].likesInfo.likesCount).toBe(1);
    expect(getPostCommentsResponse.body.items[0].likesInfo.dislikesCount).toBe(0);
    expect(getPostCommentsResponse.body.items[0].likesInfo.myStatus).toBe("None");
  });

  it("authorized user should set like and the second user set dislike and get comments", async () => {
    const createCommentResponse = await commentsManager.createCommentWithAuthJWT(postFromDb.id, userToken, newComment);
    expect(createCommentResponse.status).toBe(201);

    const likeCommentResponse = await commentsManager.likeComment(createCommentResponse.body.id, userToken, { likeStatus: "Like" });
    expect(likeCommentResponse.status).toBe(204);

    const getPostCommentsResponse = await commentsManager.getCommentsWithAuth(postFromDb.id, userToken);

    expect(getPostCommentsResponse.status).toBe(200);

    expect(getPostCommentsResponse.body.items[0].likesInfo.likesCount).toBe(1);
    expect(getPostCommentsResponse.body.items[0].likesInfo.dislikesCount).toBe(0);
    expect(getPostCommentsResponse.body.items[0].likesInfo.myStatus).toBe("Like");

    const likeCommentResponse2 = await commentsManager.likeComment(createCommentResponse.body.id, userToken2, { likeStatus: "Dislike" });
    expect(likeCommentResponse2.status).toBe(204);

    const getCommentResponse2 = await commentsManager.getCommentsWithAuth(postFromDb.id, userToken2);
    expect(getCommentResponse2.status).toBe(200);

    expect(getCommentResponse2.body.items[0].likesInfo.likesCount).toBe(1);
    expect(getCommentResponse2.body.items[0].likesInfo.dislikesCount).toBe(1);
    expect(getCommentResponse2.body.items[0].likesInfo.myStatus).toBe("Dislike");

    const getCommentResponse3 = await commentsManager.getComments(postFromDb.id);
    expect(getCommentResponse3.status).toBe(200);

    expect(getCommentResponse3.body.items[0].likesInfo.likesCount).toBe(1);
    expect(getCommentResponse3.body.items[0].likesInfo.dislikesCount).toBe(1);
    expect(getCommentResponse3.body.items[0].likesInfo.myStatus).toBe("None");
  });
});
