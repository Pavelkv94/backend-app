import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { postRepository } from "../repositories/posts.repository";

export const findPostMiddleware = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const isPostExist = await postRepository.findPost(req.params.id);

  if (!isPostExist) {
    return next(ApiError.NotFound("The requested resource was not found"));
  }

  next();
};
