import { NextFunction, Request, Response } from "express";
import { postsRepository } from "../posts.repository";
import { ApiError } from "../../../exeptions/api-error";

export const findPostMiddleware = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const isPostExist = await postsRepository.findPost(req.params.id);

  if (!isPostExist) {
    return next(ApiError.NotFound("The requested resource was not found"));
  }

  next();
};
