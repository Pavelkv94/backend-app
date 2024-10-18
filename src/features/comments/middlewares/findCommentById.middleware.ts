import { NextFunction, Request, Response } from "express";
import { commentQueryRepository } from "../comments.query-repository";
import { ApiError } from "../../../exeptions/api-error";

export const findCommentByIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const isCommentExist = await commentQueryRepository.findComment(req.params.id);

  if (!isCommentExist) {
    return next(ApiError.NotFound("The requested resource was not found"));
  }
  next();
};
