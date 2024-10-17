import express from "express";
import cors from "cors";
import { SETTINGS } from "./settings";
import { postsRouter } from "./features/posts/posts.router";
import { blogsRouter } from "./features/blogs/blogs.router";
import { config } from "dotenv";
import { usersRouter } from "./features/users/users.router";
import { testingRouter } from "./features/testing/testing.router";
import { authRouter } from "./features/auth/auth.router";
import { commentsRouter } from "./features/comments/comments.router";

export const initApp = () => {
  const app = express();

  config();

  app.use(express.json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.status(200).json({ version: "1.1" });
  });

  app.use(SETTINGS.PATH.AUTH, authRouter);
  app.use(SETTINGS.PATH.BLOGS, blogsRouter);
  app.use(SETTINGS.PATH.POSTS, postsRouter);
  app.use(SETTINGS.PATH.USERS, usersRouter);
  app.use(SETTINGS.PATH.COMMENTS, commentsRouter);

  app.use(SETTINGS.PATH.TESTING, testingRouter);

  return app;
};
