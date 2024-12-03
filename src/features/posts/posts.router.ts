import { Router } from "express";
import { postController } from "./posts.controller";
import { adminMiddleware } from "../../global-middlewares/admin.middleware";
import { sortQueryMiddleware } from "../../global-middlewares/sort-query.middleware";
import { paginationQueryMiddleware } from "../../global-middlewares/pagination-query.middleware";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrors.middleware";
import { findBlogByBodyIdValidator, postBodyValidators } from "./middlewares/post-body.validator";
import { findPostMiddleware } from "./middlewares/findPost.middleware";
import { authAccessTokenMiddleware } from "../auth/middlewares/auth-accessToken.middleware";
import { commentBodyValidator } from "../comments/middlewares/comment.body.validator";
import { likeBodyValidator } from "../likes/middlewares/like-body.validator";

export const postsRouter = Router();

postsRouter.get("/", paginationQueryMiddleware, sortQueryMiddleware, inputCheckErrorsMiddleware, postController.getPosts.bind(postController));
postsRouter.get("/:id", findPostMiddleware, postController.getPost.bind(postController));
postsRouter.post("/", adminMiddleware, findBlogByBodyIdValidator, postBodyValidators, postController.createPost.bind(postController));
postsRouter.put("/:id", adminMiddleware, findPostMiddleware, findBlogByBodyIdValidator, postBodyValidators, postController.updatePost.bind(postController));
postsRouter.delete("/:id", adminMiddleware, findPostMiddleware, postController.deletePost.bind(postController));

postsRouter.put("/:id/like-status", authAccessTokenMiddleware, likeBodyValidator, findPostMiddleware, postController.changeLikeStatus.bind(postController));

postsRouter.get(
  "/:id/comments",
  findPostMiddleware,
  ...paginationQueryMiddleware,
  ...sortQueryMiddleware,
  inputCheckErrorsMiddleware,
  postController.getComments.bind(postController)
);

postsRouter.post(
  "/:id/comments",
  authAccessTokenMiddleware,
  findPostMiddleware,
  commentBodyValidator,
  inputCheckErrorsMiddleware,
  postController.createComment.bind(postController)
);
