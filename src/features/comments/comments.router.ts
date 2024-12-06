import { Router } from "express";
import { authAccessTokenMiddleware } from "../auth/middlewares/auth-accessToken.middleware";
import { findCommentByIdMiddleware } from "./middlewares/findCommentById.middleware";
import { commentBodyValidator } from "./middlewares/comment.body.validator";
import { likeBodyValidator } from "../likes/middlewares/like-body.validator";
import { CommentController } from "./comments.controller";
import { container } from "../../composition.root";

export const commentsRouter = Router();

const commentController = container.resolve(CommentController)

commentsRouter.get("/:id", findCommentByIdMiddleware, commentController.getComment.bind(commentController));
commentsRouter.put("/:id", authAccessTokenMiddleware, findCommentByIdMiddleware, commentBodyValidator, commentController.updateComment.bind(commentController));
commentsRouter.delete("/:id", authAccessTokenMiddleware, findCommentByIdMiddleware, commentController.deleteComment.bind(commentController));

commentsRouter.put(
  "/:id/like-status",
  authAccessTokenMiddleware,
  likeBodyValidator,
  findCommentByIdMiddleware,
  commentController.changeLikeStatus.bind(commentController)
);
