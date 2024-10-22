import { Router } from "express";
import { postsController } from "./posts.controller";
import { adminMiddleware } from "../../global-middlewares/admin.middleware";
import { sortQueryMiddleware } from "../../global-middlewares/sort-query.middleware";
import { paginationQueryMiddleware } from "../../global-middlewares/pagination-query.middleware";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrors.middleware";
import { findBlogByBodyIdValidator, postBodyValidators } from "./middlewares/post-body.validator";
import { findPostMiddleware } from "./middlewares/findPost.middleware";
import { authTokenMiddleware } from "../auth/middlewares/auth-token.middleware";
import { commentBodyValidator } from "../comments/middlewares/comment.body.validator";

export const postsRouter = Router();

postsRouter.get("/", paginationQueryMiddleware, sortQueryMiddleware, inputCheckErrorsMiddleware, postsController.getPosts);
postsRouter.get("/:id", findPostMiddleware, postsController.getPost);
postsRouter.post("/", adminMiddleware, findBlogByBodyIdValidator, postBodyValidators, postsController.createPost);
postsRouter.put("/:id", adminMiddleware, findPostMiddleware, findBlogByBodyIdValidator, postBodyValidators, postsController.updatePost);
postsRouter.delete("/:id", adminMiddleware, findPostMiddleware, postsController.deletePost);

postsRouter.get(
  "/:id/comments",
  findPostMiddleware,
  ...paginationQueryMiddleware,
  ...sortQueryMiddleware,
  inputCheckErrorsMiddleware,
  postsController.getComments
);
postsRouter.post("/:id/comments", authTokenMiddleware, findPostMiddleware, commentBodyValidator, inputCheckErrorsMiddleware, postsController.createComment);
