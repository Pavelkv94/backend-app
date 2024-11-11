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
import { errorHandlerMiddleware } from "./global-middlewares/error-handler.middleware";
import { HTTP_STATUSES } from "./types/common-types";
import cookieParser from "cookie-parser";
import { apiSaveLogsMiddleware } from "./global-middlewares/apiSaveLogs.middleware";
import { securityDevicesRouter } from "./features/securityDevices/securityDevices.router";

export const initApp = () => {
  const app = express();

  config();

  app.set('trust proxy', true) 
  
  app.use(cookieParser())
  app.use(express.json());
  app.use(cors());

  app.use(apiSaveLogsMiddleware);

  app.get("/", (req, res) => {
    res.status(HTTP_STATUSES.SUCCESS).json({ version: "1.1" });
  });

  app.use(SETTINGS.PATH.AUTH, authRouter);
  app.use(SETTINGS.PATH.BLOGS, blogsRouter);
  app.use(SETTINGS.PATH.POSTS, postsRouter);
  app.use(SETTINGS.PATH.USERS, usersRouter);
  app.use(SETTINGS.PATH.COMMENTS, commentsRouter);
  app.use(SETTINGS.PATH.SECURITY, securityDevicesRouter);

  app.use(SETTINGS.PATH.TESTING, testingRouter);

  app.use(errorHandlerMiddleware);

  return app;
};
