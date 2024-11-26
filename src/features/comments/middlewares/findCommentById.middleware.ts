import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { commentQueryRepository } from "../repositories/comments.query-repository";

export const findCommentByIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const isCommentExist = await commentQueryRepository.findComment(req.params.id, null);

  if (!isCommentExist) {
    return next(ApiError.NotFound("The requested resource was not found"));
  }
  next();
};
