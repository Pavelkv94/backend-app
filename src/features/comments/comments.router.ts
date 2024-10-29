import { Router } from "express";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrors.middleware";
import { authAccessTokenMiddleware } from "../auth/middlewares/auth-accessToken.middleware";
import { commentsController } from "./comments.controller";
import { findCommentByIdMiddleware } from "./middlewares/findCommentById.middleware";
import { commentBodyValidator } from "./middlewares/comment.body.validator";

export const commentsRouter = Router();

commentsRouter.get("/:id", findCommentByIdMiddleware, commentsController.getComment);
commentsRouter.put("/:id", authAccessTokenMiddleware, findCommentByIdMiddleware, commentBodyValidator, commentsController.updateComment);
commentsRouter.delete("/:id", authAccessTokenMiddleware, findCommentByIdMiddleware, commentsController.deleteComment);
