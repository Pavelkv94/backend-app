import { Router } from "express";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrors.middleware";
import { authTokenMiddleware } from "../auth/middlewares/auth-token.middleware";
import { commentsController } from "./comments.controller";
import { findCommentByIdMiddleware } from "./middlewares/findCommentById.middleware";
import { commentBodyValidator } from "./middlewares/comment.body.validator";

export const commentsRouter = Router();

commentsRouter.get("/:id", findCommentByIdMiddleware, commentsController.getComment);
commentsRouter.put("/:id", authTokenMiddleware, findCommentByIdMiddleware, commentBodyValidator, inputCheckErrorsMiddleware, commentsController.updateComment);
commentsRouter.delete("/:id", authTokenMiddleware, findCommentByIdMiddleware, commentsController.deleteComment);
