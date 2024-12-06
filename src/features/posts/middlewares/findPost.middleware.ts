import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { PostRepository } from "../repositories/posts.repository";
import { container } from "../../../composition.root";

export const findPostMiddleware = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const postRepository = container.resolve(PostRepository);
  const isPostExist = await postRepository.findPost(req.params.id);

  if (!isPostExist) {
    return next(ApiError.NotFound("The requested resource was not found"));
  }

  next();
};
