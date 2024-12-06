import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { CommentQueryRepository } from "../repositories/comments.query-repository";
import { container } from "../../../composition.root";

export const findCommentByIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const commentQueryRepository = container.resolve(CommentQueryRepository)
  const isCommentExist = await commentQueryRepository.findComment(req.params.id, null);

  if (!isCommentExist) {
    return next(ApiError.NotFound("The requested resource was not found"));
  }
  next();
};
